import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

/**
 * OpenAI-compatible Chat Completions endpoint used ONLY as the Base44 LLM
 * fallback for the ElevenLabs voice agent. ElevenLabs calls this URL when the
 * agent is switched to "Custom LLM" (done automatically by
 * elevenLabsFallbackMonitor when ElevenLabs credits run low).
 *
 * It forwards the conversation + tool definitions to Base44's InvokeLLM
 * ("automatic" model) and returns an OpenAI-style SSE stream. Tool calls are
 * preserved so website navigation / scroll / highlight (client tools) keep
 * working exactly as on the native path.
 */

function authOk(req) {
  const expected = secrets.get('ELEVENLABS_API_KEY');
  if (!expected) return true; // until a proxy key is configured, allow (URL is private)
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return token === expected;
}

function msgContent(m) {
  if (m == null) return '';
  if (typeof m.content === 'string') return m.content;
  if (Array.isArray(m.content)) return m.content.map((c) => (typeof c === 'string' ? c : c?.text || '')).join('');
  return m.content ? JSON.stringify(m.content) : '';
}

export default async function(req) {
  try {
    if (!authOk(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const tools = Array.isArray(body.tools) ? body.tools : [];

    const base44 = createClientFromRequest(req);

    // ── Build a single prompt from the OpenAI-style messages ──
    const systemParts = messages.filter((m) => m.role === 'system').map(msgContent);
    const systemPrompt = systemParts.join('\n\n');

    const convo = messages
      .filter((m) => m.role !== 'system')
      .map((m) => {
        const c = msgContent(m);
        if (m.role === 'tool') return `Tool result: ${c}`;
        if (m.role === 'assistant' && m.tool_calls) return `Assistant called: ${JSON.stringify(m.tool_calls)}`;
        return `${m.role}: ${c}`;
      })
      .join('\n');

    const toolsBlock = tools.length
      ? tools
          .map((t) => {
            const f = t.function || t;
            return `- ${f.name || t.name}: ${f.description || ''}`;
          })
          .join('\n')
      : '';

    const instr = [
      systemPrompt,
      toolsBlock
        ? `\n\nAVAILABLE TOOLS (call by name to act):\n${toolsBlock}\n\nTo call a tool, respond with ONLY this JSON and nothing else (no markdown fences, no extra text):\n{"tool_calls":[{"name":"<tool_name>","arguments":{...}}]}\nYou may call multiple tools at once by adding them to the array. Otherwise respond naturally as the host.`
        : '',
      `\n\nCONVERSATION:\n${convo}\n\nRespond now:`,
    ].join('');

    const res = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: instr,
      model: 'automatic',
    });
    const text = typeof res === 'string' ? res : res?.text || res?.content || JSON.stringify(res ?? '');

    // ── Parse a tool-call JSON object out of the response ──
    let toolCalls = null;
    let content = text;
    let candidate = text.trim();
    const fenced = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) candidate = fenced[1].trim();
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start >= 0 && end > start) {
      try {
        const parsed = JSON.parse(candidate.slice(start, end + 1));
        if (parsed && Array.isArray(parsed.tool_calls) && parsed.tool_calls.length) {
          toolCalls = parsed.tool_calls.map((tc, i) => {
            const name = tc.name || tc.function?.name;
            const args = tc.arguments ?? tc.function?.arguments ?? {};
            return {
              id: tc.id || `call_${Date.now()}_${i}`,
              type: 'function',
              function: { name, arguments: typeof args === 'string' ? args : JSON.stringify(args) },
            };
          });
          content = '';
        }
      } catch { /* not a tool call — treat as plain content */ }
    }

    const id = `chatcmpl-${Date.now()}`;
    const created = Math.floor(Date.now() / 1000);
    const delta = toolCalls ? { tool_calls: toolCalls } : { content };
    const finish = toolCalls ? 'tool_calls' : 'stop';

    const chunk = {
      id,
      object: 'chat.completion.chunk',
      created,
      model: body.model || 'automatic',
      choices: [{ index: 0, delta, finish_reason: null }],
    };
    const finalChunk = {
      id,
      object: 'chat.completion.chunk',
      created,
      model: body.model || 'automatic',
      choices: [{ index: 0, delta: {}, finish_reason: finish }],
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalChunk)}\n\n`));
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache',
        'connection': 'keep-alive',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}