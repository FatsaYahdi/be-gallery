import { Elysia, t } from "elysia";

export const authModel = new Elysia().model({
  signIn: t.Object({
    username: t.String({
      minLength: 3,
      maxLength: 20,
    }),
    password: t.String({
      minLength: 6,
    }),
  }),
  signUp: t.Object({
    name: t.String({
      minLength: 3,
      maxLength: 50,
    }),
    username: t.String({
      minLength: 3,
      maxLength: 20,
    }),
    password: t.String({
      minLength: 6,
    }),
  }),
  verify: t.Object({
    token: t.String(),
  }),
  updateProfile: t.Object({
    name: t.String({
      minLength: 3,
    }),
    userId: t.String({
      minLength: 1,
    }),
  }),
  signOut: t.Object({
    token: t.String(),
  }),
});
