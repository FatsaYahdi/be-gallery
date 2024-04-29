import Elysia, { t } from "elysia";

export const commentModel = new Elysia().model({
  // create
  createComment: t.Object({
    content: t.String({
      minLength: 3,
      error: "Comment need to be at least 3 characters long",
    }),
    userId: t.String({
      minLength: 1,
      error: "User ID is required",
    }),
  }),
  // get
  getComment: t.Object({
    imageId: t.String({
      minLength: 1,
      error: "Image ID is required",
    }),
  }),
  // update
  updateComment: t.Object({
    content: t.String({
      minLength: 3,
      error: "Comment need to be at least 3 characters long",
    }),
    commentId: t.String({
      minLength: 1,
      error: "Comment ID is required",
    }),
    userId: t.String({
      minLength: 1,
      error: "User ID is required",
    }),
  }),
  // delete
  deleteComment: t.Object({
    commentId: t.String({
      minLength: 1,
      error: "Comment ID is required",
    }),
    userId: t.String({
      minLength: 1,
      error: "User ID is required",
    }),
  }),
});
