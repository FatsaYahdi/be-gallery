import { likeModel } from "@/models/like.model";
import Elysia from "elysia";
import { createLike } from "./handler";

export const likeRouter = new Elysia({
  prefix: "like",
  detail: {
    tags: ["Like"],
    description: "Like API",
  },
})
  .use(likeModel)
  .get(
    "/",
    ({ body }) => {
      return {
        status: "success",
        message: "get all like",
        data: body,
      };
    },
    {
      body: "getLike",
      detail: {
        summary: "Get all like",
      },
    }
  )
  .post(
    "/:imageId",
    ({ params: { imageId }, body }) =>
      createLike({
        imageId: imageId,
        userId: body.userId,
      }),
    {
      body: "createLike",
      detail: {
        summary: "Create like",
      },
    }
  );
