// Aanmelden voor Sveltia CMS (/admin) met één gedeeld wachtwoord.
// Marieke heeft GEEN GitHub-account nodig: ze typt het master-wachtwoord en
// deze functie geeft het CMS een GitHub-token dat enkel deze repo mag bewerken.
//
// Environment variables op Vercel (Production):
//   CMS_PASSWORD       het master-wachtwoord dat je aan Marieke doorstuurt
//   CMS_GITHUB_TOKEN   fine-grained GitHub PAT, enkel repo "mariecure",
//                      permissions: Contents = Read and write, Metadata = Read-only

const crypto = require('crypto');

module.exports = async (req, res) => {
  const password = process.env.CMS_PASSWORD;
  const token = process.env.CMS_GITHUB_TOKEN;

  const html = (status, body) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    res.end(body);
  };

  if (!password || !token) {
    html(500, loginShell('<p class="err">De server mist <code>CMS_PASSWORD</code> of <code>CMS_GITHUB_TOKEN</code>. Stel deze in op Vercel.</p>'));
    return;
  }

  if (req.method === 'POST') {
    const given = readPassword(req);
    if (safeEqual(given, password)) {
      html(200, successPage(token));
      return;
    }
    // Kleine vertraging maakt brute-force trager.
    await new Promise((r) => setTimeout(r, 600));
    html(401, loginShell('<p class="err">Wachtwoord klopt niet. Probeer opnieuw.</p>'));
    return;
  }

  html(200, loginShell(''));
};

function readPassword(req) {
  const b = req.body;
  if (!b) return '';
  if (typeof b === 'string') return new URLSearchParams(b).get('password') || '';
  return b.password || '';
}

// Constant-time vergelijking zodat de responstijd niets verraadt over het wachtwoord.
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function loginShell(notice) {
  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Mariecure — Aanmelden</title>
    <style>
      :root { --pink: #B87870; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center;
             font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
             background: #F2E0DC; color: #1a1a1a; padding: 24px; }
      .card { background: #fff; border: 1px solid rgba(184,120,112,.3);
              border-radius: 16px; padding: 32px; width: 100%; max-width: 360px;
              box-shadow: 0 10px 40px rgba(0,0,0,.06); }
      h1 { font-size: 20px; margin: 0 0 4px; }
      p.sub { margin: 0 0 20px; color: #666; font-size: 14px; }
      label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
      input { width: 100%; padding: 12px 14px; font-size: 16px; border: 1px solid #d9c7c2;
              border-radius: 10px; outline: none; }
      input:focus { border-color: var(--pink); box-shadow: 0 0 0 3px rgba(184,120,112,.15); }
      button { margin-top: 16px; width: 100%; padding: 12px 14px; font-size: 15px;
               font-weight: 600; color: #fff; background: var(--pink); border: 0;
               border-radius: 10px; cursor: pointer; }
      button:hover { background: #9c5f57; }
      .err { color: #b00020; font-size: 14px; margin: 0 0 16px; }
    </style>
  </head>
  <body>
    <form class="card" method="post" action="">
      <h1>Mariecure beheer</h1>
      <p class="sub">Vul het wachtwoord in om foto's te beheren.</p>
      ${notice}
      <label for="password">Wachtwoord</label>
      <input id="password" type="password" name="password" autofocus required autocomplete="current-password" />
      <button type="submit">Inloggen</button>
    </form>
  </body>
</html>`;
}

// Geeft het token via postMessage door aan het CMS-venster (Decap/Sveltia-protocol).
function successPage(token) {
  const message = `authorization:github:success:${JSON.stringify({ token, provider: 'github' })}`;
  const messageLiteral = JSON.stringify(message);
  return `<!doctype html>
<html lang="nl">
  <head><meta charset="utf-8" /><meta name="robots" content="noindex" /><title>Aanmelden…</title></head>
  <body style="font-family: system-ui, sans-serif; padding: 24px; color: #333;">
    <p>Bezig met aanmelden…</p>
    <script>
      (function () {
        function receiveMessage(e) {
          if (window.opener) {
            window.opener.postMessage(${messageLiteral}, e.origin);
          }
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        if (window.opener) {
          window.opener.postMessage('authorizing:github', '*');
        }
      })();
    </script>
  </body>
</html>`;
}
