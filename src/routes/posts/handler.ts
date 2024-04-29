import db from "@/db";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { unlink } from "node:fs/promises";

export async function getImages() {
  try {
    const images = await db.image.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully retrieve Images",
        data: images,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error getting images",
        data: error,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function getImage(id: string) {
  if (!id) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Id is required",
        data: null,
      }),
      {
        status: 400,
      }
    );
  }
  try {
    const likeCount = await db.like.count({
      where: {
        imageId: Number(id),
      },
    });
    const image = await db.image.findFirst({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
        Comment: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
        Like: {
          select: {
            id: true,
            imageId: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!image) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Image not found",
          data: null,
        }),
        {
          status: 404,
        }
      );
    }

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully retrieve Image",
        data: image,
        like: likeCount,
        isLiked: true,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error getting image",
        data: error,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function createImage(options: {
  title: string;
  content: string;
  image: File[];
  userId: string;
}) {
  try {
    const { title, content, image } = options;
    const imageName = `${Date.now()}-${image[0].name}`;
    const imagePath = `./public/images/${imageName}`;

    const findUser = await db.user.findFirst({
      where: { id: Number(options.userId) },
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

    Bun.write(imagePath, image);
    const data = await db.image.create({
      data: {
        title,
        content,
        image: imageName,
        user: {
          connect: {
            id: Number(options.userId),
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully create Image",
        data,
      }),
      {
        status: 201,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error creating image",
        data: error,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function getImageByOwner(id: string, userId: string) {
  try {
    // check if image is exist
    const findImage = await db.image.findFirst({
      where: { id: Number(id) },
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

    // check if user is owner of the image
    const data = await db.image.findFirst({
      where: { userId: Number(userId), id: Number(id) },
    });
    if (!data) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "You cannot edit this image because you are not the owner",
        }),
        {
          status: 401,
        }
      );
    }

    if (!data) {
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

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully retrieve Images",
        data,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error getting images",
        data: error,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function updateImage(
  id: string,
  userId: string,
  options: {
    title?: string;
    content?: string;
  }
) {
  try {
    const { title, content } = options;

    const oldData = await db.image.findFirst({
      where: { id: Number(id), userId: Number(userId) },
    });

    if (!oldData) {
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
    const data = await db.image.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title ?? oldData.title,
        content: content ?? oldData.content,
      },
    });
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully update Image",
        data,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error updating image",
        data: error,
      }),
      {
        status: 500,
      }
    );
  }
}

export async function deleteImage(options: { id: string; userId: string }) {
  const { id, userId } = options;
  try {
    const findImage = await db.image.findFirst({
      where: { id: Number(id), userId: Number(userId) },
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

    const imagePath = `./public/images/${findImage.image}`;
    await unlink(imagePath);

    const data = await db.image.delete({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
    return new Response(
      JSON.stringify({
        status: "success",
        message: "Successfully delete Image",
        data,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError)
      switch (error.code) {
        case "P2025":
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

    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error deleting image",
        data: error,
      }),
      {
        status: 500,
      }
    );
  }
}
