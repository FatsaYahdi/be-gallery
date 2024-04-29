import Elysia, { t } from "elysia";
import { authModel } from "../../models/auth.model";
import { signIn, signOut, signUp, updateProfile, verify } from "./handler";

const authRoutes = new Elysia({
  prefix: "/auth",
  detail: {
    tags: ["Auth"],
    description: "Auth routes",
  },
})
  .use(authModel)
  .post("/sign-in", ({ body }) => signIn(body), {
    body: "signIn",
    detail: {
      summary: "Sign In",
    },
  })
  .post("/sign-up", ({ body }) => signUp(body), {
    body: "signUp",
    detail: {
      summary: "Sign Up",
    },
  })
  .post("/sign-out", ({ body }) => signOut(body), {
    body: "signOut",
    detail: {
      summary: "Sign Out",
    },
  })
  .post("/update-profile", ({ body }) => updateProfile(body), {
    body: "updateProfile",
    detail: {
      summary: "Update Profile",
    },
  })
  .get(
    "/verify/:token",
    ({ params: { token } }) =>
      verify({
        token,
      }),
    {
      params: "verify",
      detail: {
        summary: "Verify Token",
      },
    }
  );
export default authRoutes;
