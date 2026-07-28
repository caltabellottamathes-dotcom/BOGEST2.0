import { secrets } from "base44:runtime";

export default async function(req) {
  try {
    const apiKey = secrets.get("DID_API_KEY");
    if (!apiKey) {
      return Response.json({ error: "DID_API_KEY secret not set" }, { status: 500 });
    }

    // Determine allowed domains from request origin
    const url = new URL(req.url);
    const origin = req.headers.get("origin") || req.headers.get("referer") || url.origin;
    const requestHost = new URL(origin).origin;

    // Include common dev/preview domains + the requesting domain
    const allowedDomains = [...new Set([
      requestHost,
      "https://app.base44.com",
      "http://localhost:5173",
      "http://localhost:3000",
    ])];

    const response = await fetch("https://api.d-id.com/agents/client-key", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ allowed_domains: allowedDomains }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return Response.json(
        { error: `D-ID API error: ${response.status} - ${errorText}`, key_prefix: apiKey.substring(0, 15) },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json({
      client_key: data.client_key,
      agent_id: data.agent_id,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}