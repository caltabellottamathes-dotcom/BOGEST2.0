const TARGET_ORIGIN = 'https://www.bogest-online.be';

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);

    // The Deno handler runs behind a dispatcher. Use the full canonical function URL
    // so all rewritten resource URLs resolve correctly from the browser.
    const appId = Deno.env.get("BASE44_APP_ID") || '';
    const proxyBase = `https://base44.app/api/apps/${appId}/functions/proxyExternalSite?path=`;

    // Helper: rewrite a single URL to go through the proxy (relative URL)
    const rewriteUrl = (rawUrl) => {
      if (!rawUrl || rawUrl.startsWith('#') || rawUrl.startsWith('data:') || rawUrl.startsWith('mailto:') || rawUrl.startsWith('javascript:')) return rawUrl;
      if (rawUrl.startsWith(TARGET_ORIGIN)) {
        const p = rawUrl.slice(TARGET_ORIGIN.length) || '/';
        return proxyBase + encodeURIComponent(p);
      }
      if (rawUrl.startsWith('//') || rawUrl.startsWith('http')) return rawUrl;
      const p = rawUrl.startsWith('/') ? rawUrl : '/' + rawUrl;
      return proxyBase + encodeURIComponent(p);
    };

    // Build the AJAX interceptor script that rewrites dynamic JS requests
    const buildInterceptor = () => `<script>(function(){
      var PROXY = ${JSON.stringify(proxyBase)};
      var TARGET = ${JSON.stringify(TARGET_ORIGIN)};
      function rewrite(u){if(!u||typeof u!=='string')return u;
        if(u.charAt(0)==='/'&&u.charAt(1)!=='/')return PROXY+encodeURIComponent(u);
        if(u.indexOf(TARGET)===0)return PROXY+encodeURIComponent(u.slice(TARGET.length)||'/');
        return u;}
      var o=XMLHttpRequest.prototype.open;
      XMLHttpRequest.prototype.open=function(m,u){arguments[1]=rewrite(u);return o.apply(this,arguments);};
      var f=window.fetch;
      if(f){window.fetch=function(i,init){if(typeof i==='string')i=rewrite(i);return f.call(this,i,init);};}
      var sb=navigator.sendBeacon;
      if(sb){navigator.sendBeacon=function(u,d){return sb.call(this,rewrite(u),d);};}
    })();</script>`;

    // Shared logic to process the upstream HTML response
    const processHtml = async (upstream) => {
      let html = await upstream.text();

      // Remove any existing <base> tags — they would break our rewritten relative URLs
      html = html.replace(/<base[^>]*>/gi, '');

      // Rewrite href="..." and src="..." in HTML
      html = html.replace(/(href|src)\s*=\s*"([^"]*)"/gi, (m, attr, val) => `${attr}="${rewriteUrl(val)}"`);
      html = html.replace(/(href|src)\s*=\s*'([^']*)'/gi, (m, attr, val) => `${attr}='${rewriteUrl(val)}'`);

      // Rewrite form actions
      html = html.replace(/action\s*=\s*"([^"]*)"/gi, (m, val) => `action="${rewriteUrl(val)}"`);

      // Rewrite url() in inline styles
      html = html.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi, (m, val) => `url('${rewriteUrl(val)}')`);

      // Inject AJAX interceptor at the start of <head>
      const interceptor = buildInterceptor();
      if (html.includes('<head')) {
        html = html.replace(/<head([^>]*)>/i, `<head$1>${interceptor}`);
      } else {
        html = interceptor + html;
      }

      return html;
    };

    // ── GET: reverse-proxy mode (iframe src, CSS, JS, images, AJAX) ──
    if (req.method === 'GET') {
      const rawPath = url.searchParams.get('path') || '/';
      const proxyPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
      const targetUrl = TARGET_ORIGIN + proxyPath;

      const upstream = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'nl-BE,nl;q=0.9,en;q=0.8',
          'Referer': TARGET_ORIGIN + '/',
        },
        redirect: 'manual',
      });

      // Follow redirects manually, rewriting Location to go through the proxy
      if (upstream.status >= 300 && upstream.status < 400) {
        const loc = upstream.headers.get('location') || '';
        if (loc.startsWith(TARGET_ORIGIN)) {
          const p = loc.slice(TARGET_ORIGIN.length) || '/';
          return new Response(null, { status: upstream.status, headers: { Location: proxyBase + encodeURIComponent(p) } });
        }
        if (loc.startsWith('/')) {
          return new Response(null, { status: upstream.status, headers: { Location: proxyBase + encodeURIComponent(loc) } });
        }
        // Absolute redirect to a different host — pass through
        return new Response(null, { status: upstream.status, headers: { Location: loc } });
      }

      const contentType = upstream.headers.get('content-type') || '';

      // HTML
      if (contentType.includes('text/html')) {
        const html = await processHtml(upstream);
        return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
      }

      // CSS: rewrite url() references
      if (contentType.includes('text/css')) {
        let css = await upstream.text();
        css = css.replace(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi, (m, val) => `url('${rewriteUrl(val)}')`);
        return new Response(css, { status: 200, headers: { 'content-type': 'text/css; charset=utf-8', 'cache-control': 'public, max-age=86400' } });
      }

      // JavaScript: rewrite absolute target URLs to proxy paths
      if (contentType.includes('javascript') || contentType.includes('text/js')) {
        let js = await upstream.text();
        js = js.split(TARGET_ORIGIN).join(proxyBase);
        return new Response(js, { status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'public, max-age=86400' } });
      }

      // Everything else: stream as-is
      const body = await upstream.arrayBuffer();
      return new Response(body, { status: 200, headers: { 'content-type': contentType, 'cache-control': 'public, max-age=86400' } });
    }

    // ── POST: proxied form/AJAX submission OR SDK invocation ──
    const pathParam = url.searchParams.get('path');

    if (pathParam) {
      // Proxied POST — forward the entire request to the target
      const proxyPath = pathParam.startsWith('/') ? pathParam : '/' + pathParam;
      const targetUrl = TARGET_ORIGIN + proxyPath;
      const reqContentType = req.headers.get('content-type') || '';
      const bodyBuffer = await req.arrayBuffer();

      const fwdHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': req.headers.get('accept') || '*/*',
        'Accept-Language': 'nl-BE,nl;q=0.9,en;q=0.8',
        'Referer': TARGET_ORIGIN + '/',
      };
      if (reqContentType) fwdHeaders['Content-Type'] = reqContentType;
      const cookie = req.headers.get('cookie');
      if (cookie) fwdHeaders['Cookie'] = cookie;

      const upstream = await fetch(targetUrl, {
        method: 'POST',
        headers: fwdHeaders,
        body: bodyBuffer,
        redirect: 'manual',
      });

      // Follow redirects manually
      if (upstream.status >= 300 && upstream.status < 400) {
        const loc = upstream.headers.get('location') || '';
        if (loc.startsWith(TARGET_ORIGIN)) {
          const p = loc.slice(TARGET_ORIGIN.length) || '/';
          return new Response(null, { status: upstream.status, headers: { Location: proxyBase + encodeURIComponent(p) } });
        }
        if (loc.startsWith('/')) {
          return new Response(null, { status: upstream.status, headers: { Location: proxyBase + encodeURIComponent(loc) } });
        }
        return new Response(null, { status: upstream.status, headers: { Location: loc } });
      }

      const respContentType = upstream.headers.get('content-type') || '';

      // HTML response — process and return
      if (respContentType.includes('text/html')) {
        const html = await processHtml(upstream);
        const respHeaders = { 'content-type': 'text/html; charset=utf-8' };
        const setCookie = upstream.headers.get('set-cookie');
        if (setCookie) respHeaders['set-cookie'] = setCookie;
        return new Response(html, { status: upstream.status, headers: respHeaders });
      }

      // JSON or other — return as-is
      const respBody = await upstream.arrayBuffer();
      const respHeaders = { 'content-type': respContentType };
      const setCookie = upstream.headers.get('set-cookie');
      if (setCookie) respHeaders['set-cookie'] = setCookie;
      return new Response(respBody, { status: upstream.status, headers: respHeaders });
    }

    // SDK invocation — return rewritten HTML as JSON
    const body = await req.json().catch(() => ({}));
    const targetUrl = body.url || TARGET_ORIGIN + '/';
    const upstream = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'nl-BE,nl;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });
    const html = await processHtml(upstream);
    return Response.json({ html, url: targetUrl, ok: upstream.ok });
  } catch (error) {
    return Response.json({ error: error.message, ok: false }, { status: 500 });
  }
});