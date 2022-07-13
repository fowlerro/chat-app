import type { Socket } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@chat-app/api-interfaces';

import usersController from './app/controllers/users';
import messagesController from './app/controllers/messages';
import notificationsController from './app/controllers/notifications';

const connectionEvent = async (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>
) => {
  usersController.connectUser(socket);

  socket.on('disconnect', () => usersController.disconnectUser(socket));

  socket.on('getMessages', () => messagesController.getMessages(socket));
  socket.on('sendMessage', async (receiverId, messageContent) =>
    messagesController.sendMessage(socket, receiverId, messageContent)
  );
  socket.on('editMessage', (messageId, newContent, callback) =>
    messagesController.editMessage(socket, messageId, newContent, callback)
  );
  socket.on('deleteMessage', (messageId) =>
    messagesController.deleteMessage(socket, messageId)
  );

  socket.on('getNotifications', () =>
    notificationsController.getNotifications(socket)
  );
  socket.on('readNotification', (chatId) =>
    notificationsController.readNotification(socket, chatId)
  );

  socket.on('getFriends', () => usersController.getFriends(socket));
  socket.on('getInvites', () => usersController.getInvites(socket));
  socket.on('sendInvite', (targetLogin, callback) =>
    usersController.sendInvite(socket, targetLogin, callback)
  );
  socket.on('acceptInvite', (creatorId) =>
    usersController.acceptInvite(socket, creatorId)
  );
  socket.on('declineInvite', (creatorId) =>
    usersController.declineInvite(socket, creatorId)
  );
  socket.on('removeFriend', (friendId) =>
    usersController.removeFriend(socket, friendId)
  );
};

export const socketEvents = {
  connection: connectionEvent,
};
