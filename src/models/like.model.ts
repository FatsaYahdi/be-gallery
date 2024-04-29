import Elysia, { t } from "elysia";

export const likeModel = new Elysia().model({
  getLike: t.Object({
    imageId: t.String({
      minLength: 1,
      error: "Image ID is required",
    }),
  }),
  createLike: t.Object({
    userId: t.String({
      minLength: 1,
      error: "User ID is required",
    }),
  }),
});
