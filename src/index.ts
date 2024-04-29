import Elysia from "elysia";
import postsRouter from "./routes/posts/route";
import swagger from "@elysiajs/swagger";
import staticPlugin from "@elysiajs/static";
import authRoutes from "./routes/auth/route";
import cors from "@elysiajs/cors";
import { commentsRouter } from "./routes/posts/comment/route";
import { likeRouter } from "./routes/posts/like/route";

const app = new Elysia().listen(
  process.env.PORT ?? 9595,
  ({ hostname, port }) => {
    console.log(`Running at http://${hostname}:${port}`);
  }
);

app
  .get("/", () => "Hello World")
  .group("/api", (app) =>
    app.use(postsRouter).use(authRoutes).use(commentsRouter).use(likeRouter)
  )
  .use(swagger())
  .use(
    cors({
      origin: "*",
      allowedHeaders: "*",
    })
  )
  .use(
    staticPlugin({
      assets: "./public",
      enableDecodeURI: true,
    })
  )
  .onError((err) => console.log(err));

console.log(`Server ${app.server?.port}`);

export default app;
