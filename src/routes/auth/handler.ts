import db from "@/db";
import { Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { sha256 } from "js-sha256";

// sign in
export async function signIn(options: { username: string; password: string }) {
  const { username, password } = options;
  const hashedPassword = sha256(password);
  const token = sha256(
    username + password + `${Math.random() * (999999 - 111111) + 111111}`
  );
  try {
    // Find User
    const findUser = await db.user.findFirst({
      where: {
        username,
        password: hashedPassword,
      },
    });
    if (findUser) {
      // Find token
      const findToken = await db.token.findFirst({
        where: {
          userId: findUser.id,
        },
      });

      if (findToken) {
        // Delete Token
        await db.token.delete({
          where: {
            id: findToken.id,
          },
        });

        // Create new token
        await db.token.create({
          data: {
            token,
            userId: findUser.id,
          },
        });

        // get user
        const data = await db.user.findFirst({
          where: {
            id: findUser.id,
          },
          select: {
            id: true,
            username: true,
            name: true,
            token: {
              select: {
                token: true,
              },
            },
          },
        });

        return new Response(
          JSON.stringify({
            status: "success",
            message: "Credentials is valid and Login successfully!",
            data: data,
          }),
          { status: 200 }
        );
      } else {
        // Create new token
        await db.token.create({
          data: {
            token,
            userId: findUser.id,
          },
        });
        const data = await db.user.findFirst({
          where: {
            id: findUser.id,
          },
          select: {
            id: true,
            username: true,
            name: true,
            token: {
              select: {
                token: true,
              },
            },
          },
        });
        return new Response(
          JSON.stringify({
            status: "success",
            message: "Credentials is valid and Login successfully!",
            data: data,
          }),
          { status: 200 }
        );
      }
    }

    if (!findUser) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Invalid credentials",
        }),
        {
          status: 401,
        }
      );
    }

    return new Response(
      JSON.stringify({
        status: "error",
        message: "Unknown error",
      }),
      {
        status: 500,
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Unknown error",
      }),
      {
        status: 500,
      }
    );
  }
}

// sign up
export async function signUp(options: {
  username: string;
  password: string;
  name: string;
}) {
  const { username, password, name } = options;

  try {
    const hashedPassword = sha256(password);
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
      },
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Sign up successfully",
        data: user,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return new Response(
          JSON.stringify({
            status: "error",
            message: "Username already exists",
          }),
          {
            status: 409,
          }
        );
      }
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Unknown error",
        }),
        {
          status: 500,
        }
      );
    }
  }
}

// sign out
export async function signOut(options: { token: string }) {
  const { token } = options;
  try {
    const data = await db.token.deleteMany({
      where: {
        token,
      },
    });

    if (!data.count) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Invalid token",
        }),
        {
          status: 401,
        }
      );
    }
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Sign out successfully",
      }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Unknown error",
      }),
      {
        status: 500,
      }
    );
  }
}

// update
export async function updateProfile(options: { name: string; userId: string }) {
  const { name, userId } = options;
  try {
    const findUser = await db.user.findFirst({
      where: {
        id: Number(userId),
      },
    });

    if (!findUser) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "User not found",
        }),
        {
          status: 404,
        }
      );
    }

    const user = await db.user.update({
      where: {
        id: Number(userId),
      },
      data: {
        name,
      },
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    // revalidate token
    await db.token.deleteMany({
      where: {
        userId: Number(userId),
      },
    });

    const tokenH = sha256(
      findUser.username +
        findUser.password +
        `${Math.random() * (999999 - 111111) + 111111}`
    );

    const token = await db.token.create({
      data: {
        token: tokenH,
        userId: Number(userId),
      },
      select: {
        token: true,
      },
    });
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Update profile successfully",
        data: {
          ...user,
          token: token.token,
        },
      }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Unknown error",
      }),
      {
        status: 500,
      }
    );
  }
}

// verify
export async function verify(options: { token: string }) {
  const { token } = options;
  try {
    const user = await db.token.findFirst({
      where: {
        token,
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        token: true,
      },
    });
    if (!user) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Invalid token",
        }),
        {
          status: 401,
        }
      );
    }
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Verify successfully",
        data: user,
      }),
      {
        status: 200,
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Unknown error",
      }),
      {
        status: 500,
      }
    );
  }
}
