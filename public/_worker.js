export default {
  async fetch(request, env, ctx) {
    // Get the URL and pathname
    const url = new URL(request.url);
    const { pathname } = url;

    // Serve index.html for the root path and any client-side routes
    if (pathname === "/" || !pathname.includes(".")) {
      const response = await fetch(new URL("/index.html", request.url));
      return new Response(response.body, response);
    }

    // Try to serve the requested asset
    try {
      return await fetch(new URL(pathname, request.url));
    } catch (e) {
      // If the asset doesn't exist, serve index.html for client-side routing
      const response = await fetch(new URL("/index.html", request.url));
      return new Response(response.body, response);
    }
  },
};
