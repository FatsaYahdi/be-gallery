import { commentModel } from "@/models/comment.model";
import Elysia from "elysia";
import {
  createComment,
  updateComment,
  getComments,
  deleteComment,
} from "./handler";

export const commentsRouter = new Elysia({
  prefix: "/comments",
  detail: {
    tags: ["Comments"],
    description: "Comments",
  },
})
  .use(commentModel)
  // get all
  .get(
    "/:imageId",
    ({ params: { imageId } }) => getComments({ imageId: imageId }),
    {
      params: "getComment",
      detail: {
        summary: "Get all comment",
        description: "Get all comment",
      },
    }
  )
  // create
  .post(
    "/:imageId",
    ({ params: { imageId }, body }) =>
      createComment({
        content: body.content,
        imageId: imageId,
        userId: body.userId,
      }),

    {
      body: "createComment",
      detail: {
        summary: "Create Comment",
      },
    }
  )
  // edit
  .patch(
    "/:commentId",
    ({ params: { commentId }, body }) =>
      updateComment(commentId, {
        content: body.content,
        userId: body.userId,
      }),
    {
      body: "updateComment",
      detail: {
        summary: "Edit Comment",
      },
    }
  )
  // delete
  .delete(
    "/:commentId",
    ({ params: { commentId }, body }) =>
      deleteComment(
        {
          commentId: commentId,
        },
        body.userId
      ),
    {
      body: "deleteComment",
      detail: {
        summary: "Delete Comment",
      },
    }
  );
