import { secrets } from 'base44:runtime';

// Raw diagnostic — replicates Google's own "Try this API" tool exactly.
// Only key + cx + q, no searchType/num/processing. Returns Google's raw reply
// so we can tell a project/credential issue from a Base44 code-construction bug.
export default async function (req) {
  try {
    const key = secrets.get('GOOGLE_CSE_API_KEY');
    const cx = secrets.get('GOOGLE_CSE_CX');
    if (!key || !cx) {
      return Response.json({
        error: 'Missing secrets',
        hasKey: !!key,
        hasCx: !!cx
      }, { status: 500 });
    }

    const url =
      'https://www.googleapis.com/customsearch/v1' +
      '?key=' + encodeURIComponent(key) +
      '&cx=' + encodeURIComponent(cx) +
      '&q=' + encodeURIComponent('Bogest');

    const gRes = await fetch(url, { method: 'GET' });
    const body = await gRes.text();
    let parsed = null;
    try { parsed = JSON.parse(body); } catch {}

    return Response.json({
      httpStatus: gRes.status,
      hasKey: true,
      hasCx: true,
      endpoint: 'https://www.googleapis.com/customsearch/v1',
      raw: parsed || body
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}