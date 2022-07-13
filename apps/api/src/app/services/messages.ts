import prisma from '../prisma';

const messagesService = {
  find: async (messageId: string) => {
    return prisma.message.findUnique({
      where: {
        id: messageId,
      },
    });
  },
  getDMs: async (userId: string) => {
    const messages = await prisma.message.findMany({
      where: {
        dm: true,
        OR: [
          {
            authorId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
    });

    return messages || [];
  },
  save: async (authorId: string, receiverId: string, content: string) => {
    return prisma.message.create({
      data: {
        dm: true,
        content: content.trimStart().trimEnd(),
        authorId,
        receiverId,
      },
    });
  },
  edit: async (messageId: string, newContent: string) => {
    return prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content: newContent,
      },
    });
  },
  delete: async (messageId: string) => {
    const deletedMessage = await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
    return deletedMessage;
  },
};

export default messagesService;
