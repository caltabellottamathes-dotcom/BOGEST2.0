import { secrets } from "base44:runtime";

export default async function(req) {
  try {
    const apiKey = secrets.get("DID_API_KEY");
    if (!apiKey) {
      return Response.json({ error: "DID_API_KEY secret not set" }, { status: 500 });
    }

    const headers = {
      "Authorization": `Basic ${apiKey}`,
      "Content-Type": "application/json",
    };

    // 1. Try to GET existing client key first
    const getRes = await fetch("https://api.d-id.com/agents/client-key", { headers });

    let clientKey;
    if (getRes.ok) {
      const data = await getRes.json();
      clientKey = data.client_key;
    } else if (getRes.status === 404) {
      // No existing key — create one
      const url = new URL(req.url);
      const origin = req.headers.get("origin") || req.headers.get("referer") || url.origin;
      const requestHost = new URL(origin).origin;

      const allowedDomains = [...new Set([
        requestHost,
        "https://app.base44.com",
        "http://localhost:5173",
        "http://localhost:3000",
      ])];

      const postRes = await fetch("https://api.d-id.com/agents/client-key", {
        method: "POST",
        headers,
        body: JSON.stringify({ allowed_domains: allowedDomains }),
      });

      if (!postRes.ok) {
        const errorText = await postRes.text();
        return Response.json(
          { error: `D-ID create key error: ${postRes.status} - ${errorText}` },
          { status: postRes.status }
        );
      }

      const postData = await postRes.json();
      clientKey = postData.client_key;
    } else {
      const errorText = await getRes.text();
      return Response.json(
        { error: `D-ID get key error: ${getRes.status} - ${errorText}` },
        { status: getRes.status }
      );
    }

    // 2. List agents to find the agent ID
    let agentId = null;
    const agentsRes = await fetch("https://api.d-id.com/agents", { headers });
    if (agentsRes.ok) {
      const agentsData = await agentsRes.json();
      const agents = Array.isArray(agentsData) ? agentsData : (agentsData.agents || []);
      if (agents.length > 0) {
        agentId = agents[0].id || agents[0]._id;
      }
    }

    return Response.json({
      client_key: clientKey,
      agent_id: agentId,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}