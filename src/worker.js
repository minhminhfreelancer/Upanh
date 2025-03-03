export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    // API routes for R2 storage
    if (pathname.startsWith("/api/")) {
      // Handle image upload to R2
      if (pathname === "/api/upload" && request.method === "POST") {
        try {
          const formData = await request.formData();
          const file = formData.get("file");

          if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Generate a unique key for the image
          const uniqueKey = `${Date.now()}-${file.name}`;

          // Upload to R2 bucket
          await env.IMAGES_BUCKET.put(uniqueKey, file, {
            httpMetadata: {
              contentType: file.type,
            },
          });

          // Return success response with the image URL
          const imageUrl = `${url.origin}/api/images/${uniqueKey}`;
          return new Response(
            JSON.stringify({
              success: true,
              imageUrl,
              id: uniqueKey,
              variants: [imageUrl],
            }),
            {
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // Handle image retrieval from R2
      if (pathname.startsWith("/api/images/") && request.method === "GET") {
        try {
          const imageKey = pathname.replace("/api/images/", "");
          const object = await env.IMAGES_BUCKET.get(imageKey);

          if (!object) {
            return new Response("Image not found", { status: 404 });
          }

          return new Response(object.body, {
            headers: {
              "Content-Type": object.httpMetadata.contentType || "image/jpeg",
              "Cache-Control": "public, max-age=31536000",
            },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // List all images in the R2 bucket
      if (pathname === "/api/images" && request.method === "GET") {
        try {
          const objects = await env.IMAGES_BUCKET.list();
          const images = objects.objects.map((obj) => ({
            id: obj.key,
            imageUrl: `${url.origin}/api/images/${obj.key}`,
            title: obj.key.split("-").slice(1).join("-"),
            uploadDate: new Date(parseInt(obj.key.split("-")[0]))
              .toISOString()
              .split("T")[0],
            size: `${(obj.size / (1024 * 1024)).toFixed(2)} MB`,
            dimensions: "1200 x 800", // This would ideally be calculated from the actual image
            format: obj.httpMetadata.contentType.split("/")[1].toUpperCase(),
          }));

          return new Response(JSON.stringify({ images }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      // Delete an image from R2
      if (pathname.startsWith("/api/images/") && request.method === "DELETE") {
        try {
          const imageKey = pathname.replace("/api/images/", "");
          await env.IMAGES_BUCKET.delete(imageKey);

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    // Serve static assets for the frontend
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
