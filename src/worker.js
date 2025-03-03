export default {
  async fetch(request, env, ctx) {
    return new Response("Cloudflare Image Uploader API", {
      headers: { "content-type": "text/plain" },
    });
  },
};
