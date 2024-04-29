import { Elysia, t } from "elysia";

export const imageModel = new Elysia().model({
  createImage: t.Object({
    title: t.String({
      minLength: 3,
    }),
    content: t.String({
      minLength: 3,
    }),
    image: t.Files({
      maxItems: 1,
      minItems: 1,
      type: ["image"],
    }),
    userId: t.String({
      minLength: 1,
    }),
  }),
  patchImage: t.Object({
    title: t.String({ minLength: 3 }),
    content: t.String({ minLength: 3 }),
    userId: t.String({ minLength: 1 }),
  }),
  getImage: t.Object({
    id: t.String({
      minLength: 1,
    }),
  }),
  getImageByOwner: t.Object({
    id: t.String({
      minLength: 1,
    }),
    userId: t.String({
      minLength: 1,
    }),
  }),
  deleteImage: t.Object({
    id: t.String({
      minLength: 1,
    }),
    userId: t.String({
      minLength: 1,
    }),
  }),
});
