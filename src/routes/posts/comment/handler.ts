import db from "@/db";

export async function getComments(options: { imageId: string }) {
  try {
    const findImage = await db.image.findFirst({
      where: {
        id: Number(options.imageId),
      },
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

    const comments = await db.comment.findMany({
      where: { imageId: Number(options.imageId) },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Comments found",
        data: comments,
      }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error finding comments",
      }),
      {
        status: 500,
      }
    );
  }
}

export async function createComment(options: {
  imageId: string;
  content: string;
  userId: string;
}) {
  const { imageId, content, userId } = options;

  try {
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

    const comment = await db.comment.create({
      data: {
        content,
        imageId: Number(imageId),
        userId: Number(userId),
      },
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Comment created",
        data: comment,
      }),
      {
        status: 200,
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error creating comment",
      }),
      {
        status: 500,
      }
    );
  }
}

export async function updateComment(
  id: string,
  options: {
    content?: string;
    userId?: string;
  }
) {
  try {
    const { content } = options;

    const findData = await db.comment.findFirst({
      where: {
        id: Number(id),
        userId: Number(options.userId),
      },
    });

    if (!findData) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Comment not found",
        }),
        {
          status: 404,
        }
      );
    }
    const data = await db.comment.update({
      where: {
        id: Number(id),
      },
      data: {
        content: content ?? findData.content,
      },
    });

    return new Response(
      JSON.stringify({
        status: "success",
        message: "Comment updated",
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
        message: "Error updating comment",
      }),
      {
        status: 500,
      }
    );
  }
}

export async function deleteComment(
  options: { commentId: string },
  userId: string
) {
  try {
    const findData = await db.comment.findFirst({
      where: { id: Number(options.commentId), userId: Number(userId) },
    });
    if (!findData) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Comment not found",
        }),
        {
          status: 404,
        }
      );
    }

    const comment = await db.comment.delete({
      where: { id: Number(options.commentId), userId: Number(userId) },
    });
    if (!comment) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Error deleting comment",
        }),
        {
          status: 500,
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          status: "success",
          message: "Comment deleted",
        }),
        {
          status: 200,
        }
      );
    }
  } catch (e) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Error deleting comment",
      }),
      {
        status: 500,
      }
    );
  }
}
