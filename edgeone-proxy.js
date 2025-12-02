// EdgeOne Edge Function Proxy for OpenAI API
// Deploy this as an Edge Function in Tencent EdgeOne and route /api/proxy/* to it.
// Environment variables needed:
// - OPENAI_API_KEY: Your OpenAI API key
// - OPENAI_BASE_URL: (Optional) The base URL of the API, default https://api.openai.com/v1

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  
  // Only handle paths under /api/proxy
  if (!url.pathname.startsWith('/api/proxy')) {
    return new Response('Not Found', { status: 404 });
  }

  // Extract the target path
  const targetPath = url.pathname.replace('/api/proxy', '') || '/';
  const targetUrl = (env.OPENAI_BASE_URL || 'https://api.openai.com/v1') + targetPath + url.search;

  // Clone request headers
  const headers = new Headers(request.headers);
  // Remove origin headers to avoid CORS issues
  headers.delete('origin');
  headers.delete('referer');
  // Add Authorization header with API key
  if (env.OPENAI_API_KEY) {
    headers.set('Authorization', `Bearer ${env.OPENAI_API_KEY}`);
  } else {
    return new Response('OPENAI_API_KEY not configured', { status: 500 });
  }

  // Forward the request
  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'follow'
  });

  try {
    const response = await fetch(modifiedRequest);
    // Modify response headers to allow CORS
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, { status: 500 });
  }
}

// For EdgeOne compatibility, export a default handler
export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  }
};