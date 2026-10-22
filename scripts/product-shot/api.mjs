// Clients for the stack's REST API (a person's bearer session) and MCP endpoint (an agent token).
// Credentials stay in this process: they are never printed or passed on a command line.

async function call(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  if (!response.ok) throw new Error(`${init.method} ${new URL(url).pathname} answered ${response.status}: ${text.slice(0, 300)}`);
  return { response, data: text ? JSON.parse(text) : null };
}

function bearer(token) {
  return { authorization: ['Bearer', token].join(' ') };
}

// tokenFromLink takes the one-time token out of a sign-in link printed by `collie pair`.
export function tokenFromLink(link) {
  const token = new URL(link).searchParams.get('token');
  if (!token) throw new Error('the CLI did not print a sign-in link');
  return token;
}

// redeem exchanges a one-time sign-in token for a session, as the web sign-in page does.
// kind 'bearer' returns the session token; 'cookie' returns the session cookie for a browser.
export async function redeem(origin, token, kind) {
  const { response, data } = await call(`${origin}/api/v1/auth/redeem`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token, session_type: kind, label: 'Product screenshot' }),
  });
  if (kind === 'bearer') return data.token;
  const [pair] = response.headers.get('set-cookie').split(';');
  const at = pair.indexOf('=');
  return { name: pair.slice(0, at), value: pair.slice(at + 1) };
}

// rest calls /api/v1 as the person who owns `token`.
export function rest(origin, token) {
  return async (method, path, body) => (await call(`${origin}/api/v1${path}`, {
    method,
    headers: { ...bearer(token), 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })).data;
}

// mcp calls a tool on /mcp with an agent token and returns its structured result.
export function mcp(origin, token) {
  let id = 0;
  return async (name, args) => {
    id += 1;
    const { data } = await call(`${origin}/mcp`, {
      method: 'POST',
      headers: { ...bearer(token), 'content-type': 'application/json', accept: 'application/json, text/event-stream', 'mcp-protocol-version': '2025-11-25' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method: 'tools/call', params: { name, arguments: args } }),
    });
    if (data.error || data.result?.isError) {
      throw new Error(`MCP ${name} failed: ${JSON.stringify(data.error ?? data.result.content).slice(0, 300)}`);
    }
    return data.result.structuredContent;
  };
}

// inbound posts a raw RFC 5322 message to the email channel's inbound endpoint.
export async function inbound(url, secret, raw) {
  return (await call(url, {
    method: 'POST',
    headers: { 'x-colliedesk-inbound-secret': secret, 'content-type': 'message/rfc822' },
    body: raw,
  })).data;
}
