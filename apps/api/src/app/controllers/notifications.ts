import { CustomSocket, io } from '../../main';
import notificationsService from '../services/notifications';

const notificationsController = {
  getNotifications: async (socket: CustomSocket) => {
    const notifications = await notificationsService.get(socket.user.id);
    socket.emit('getNotifications', notifications)
  },
  sendNotification: async (socket: CustomSocket, receiverId: string) => {
    const notification = await notificationsService
      .create(socket.user.id, receiverId)
      .catch(console.error);
    if (!notification) return;

    io.to(receiverId).emit('sendNotification', socket.user.id);
  },
  readNotification: async (socket: CustomSocket, chatId: string) => {
    await notificationsService
      .delete(chatId, socket.user.id)
      .catch(console.error);
  },
};

export default notificationsController;
