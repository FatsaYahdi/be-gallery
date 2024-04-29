import db from "@/db";

export async function createLike(options: { imageId: string; userId: string }) {
  const { imageId, userId } = options;
  try {
    const findUser = await db.user.findFirst({
      where: { id: Number(userId) },
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

    const findImage = await db.image.findFirst({
      where: { id: Number(imageId) },
    });
    if (!findImage) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Image not found",
        }),
        {
          status: 404,
        }
      );
    }

    const findLike = await db.like.findFirst({
      where: { imageId: Number(imageId), userId: Number(userId) },
    });

    if (findLike) {
      await db.like.delete({ where: { id: findLike.id } });
      return new Response(
        JSON.stringify({
          status: "success",
          message: "The image has been unliked",
        }),
        {
          status: 200,
        }
      );
    }

    await db.like.create({
      data: {
        imageId: Number(imageId),
        userId: Number(userId),
      },
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "The image has been liked",
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Internal Server Error",
      }),
      {
        status: 500,
      }
    );
  }
  // return await db.like.create({

  //   data: {
  //     postId,
  //     userId,
  //   },
  // });
}
