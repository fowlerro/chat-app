import prisma from '../prisma';

const notificationsService = {
  get: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        notifications: true,
      },
    });
    return user.notifications;
  },
  create: async (chatId: string, receiverId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });
    if (user.notifications.find((notification) => notification === chatId))
      return false;

    await prisma.user.update({
      where: {
        id: receiverId,
      },
      data: {
        notifications: {
          push: chatId,
        },
      },
    });
    return true;
  },
  delete: async (chatId: string, receiverId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });
    if (!user.notifications.find((notification) => notification === chatId))
      return false;

    await prisma.user.update({
      where: {
        id: receiverId,
      },
      data: {
        notifications: {
          set: user.notifications.filter(
            (notification) => notification !== chatId
          ),
        },
      },
    });
    return true;
  },
};

export default notificationsService;
