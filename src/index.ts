import { serve, file } from "bun";
import index from "./index.html";

const server = serve({
  port: Number(process.env.PORT ?? 3002),
  routes: {
    "/me-bw.jpeg": file("src/assets/me-bw.jpeg"),
    "/me-color.jpeg": file("src/assets/me-color.jpeg"),
    "/og-image.png": file("src/assets/og-image.png"),
    "/favicon.ico": file("public/favicon.ico"),
    "/favicon-16x16.png": file("public/favicon-16x16.png"),
    "/favicon-32x32.png": file("public/favicon-32x32.png"),
    "/apple-touch-icon.png": file("public/apple-touch-icon.png"),
    "/android-chrome-192x192.png": file("public/android-chrome-192x192.png"),
    "/android-chrome-512x512.png": file("public/android-chrome-512x512.png"),
    "/site.webmanifest": file("public/site.webmanifest"),
    "/fight_club.jpg": file("src/assets/fight_club.jpg"),
    "/interstellar.jpg": file("src/assets/interstellar.jpg"),
    "/martian.jpg": file("src/assets/martian.jpg"),
    "/inception.jpg": file("src/assets/inception.jpg"),
    "/oppenheimer.jpg": file("src/assets/oppenheimer.jpg"),
    "/tenet.jpg": file("src/assets/tenet.jpg"),
    "/pulse-api.png": file("src/assets/pulse-api.png"),

    "/api/hello": {
      async GET(req) {
        return Response.json({ message: "Hello, world!", method: "GET" });
      },
      async PUT(req) {
        return Response.json({ message: "Hello, world!", method: "PUT" });
      },
    },

    "/api/hello/:name": async (req) => {
      const name = req.params.name;
      return Response.json({ message: `Hello, ${name}!` });
    },

    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,

    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
