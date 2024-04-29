import { Elysia, t } from "elysia";
import {
  createImage,
  deleteImage,
  getImage,
  getImageByOwner,
  getImages,
  updateImage,
} from "./handler";
import { imageModel } from "@/models/post.model";

const imagesRouter = new Elysia({
  prefix: "/images",
  detail: {
    tags: ["Images"],
    description: "Images API",
  },
})
  .use(imageModel)
  .get("/", () => getImages(), {
    detail: {
      summary: "Get all images",
      description: "Get all images",
    },
  })
  .get("/detail/:id", ({ params: { id } }) => getImage(id), {
    params: "getImage",
    detail: {
      summary: "Get image by id",
      description: "Get image by id",
    },
  })
  .post("/", ({ body }) => createImage(body), {
    body: "createImage",
    detail: {
      summary: "Create new image",
      description: "Create new image",
    },
  })
  .get(
    "/edit/:id/:userId",
    ({ params: { id, userId } }) => getImageByOwner(id, userId),
    {
      params: "getImageByOwner",
      detail: {
        summary: "Get image by id",
        description: "Get image by id",
      },
    }
  )
  .patch(
    "/:id",
    ({ params: { id }, body }) =>
      updateImage(id, body.userId, {
        content: body.content,
        title: body.title,
      }),
    {
      params: "getImage",
      body: "patchImage",
      detail: {
        summary: "Update image by id",
        description: "Update image by id",
      },
    }
  )
  .delete(
    "/",
    ({ body }) =>
      deleteImage({
        id: body.id,
        userId: body.userId,
      }),
    {
      body: "deleteImage",
      detail: {
        summary: "Delete image by id",
        description: "Delete image by id",
      },
    }
  );
export default imagesRouter;
