import messagesService from '../services/messages';

import { CustomSocket, io } from '../../main';
import type { Callback } from '@chat-app/api-interfaces';
import notificationsService from '../services/notifications';
import notificationsController from './notifications';

const messagesController = {
  getMessages: async (socket: CustomSocket) => {
    const messages = await messagesService.getDMs(socket.user.id);
    socket.emit('getMessages', messages);
  },
  sendMessage: async (
    socket: CustomSocket,
    receiverId: string,
    messageContent: string
  ) => {
    if (
      typeof messageContent !== 'string' ||
      messageContent.trimStart().trimEnd().length > 2000
    )
      return;
    const savedMessage = await messagesService
      .save(socket.user.id, receiverId, messageContent)
      .catch(console.error);
    if (!savedMessage) return;

    io.to([socket.user.id, receiverId]).emit('sendMessage', savedMessage);

    notificationsController.sendNotification(socket, receiverId);
  },
  editMessage: async (
    socket: CustomSocket,
    messageId: string,
    newContent: string,
    callback: Callback
  ) => {
    if (typeof messageId !== 'string')
      return callback({ error: 'Invalid messageId', done: false });
    if (typeof newContent !== 'string')
      return callback({ error: 'Invalid message content!', done: false });
    if (newContent.length > 2000)
      return callback({
        error: 'Message content cannot exceed 2000 characters!',
        done: false,
      });

    const message = await messagesService.find(messageId).catch(console.error);
    if (!message) return callback({ error: 'Message not found!', done: false });
    if (message.authorId !== socket.user.id)
      return callback({ error: 'Cannot edit that message!', done: false });

    const editedMessage = await messagesService
      .edit(messageId, newContent)
      .catch(console.error);
    if (!editedMessage)
      return callback({
        error: 'Something went wrong, please try again!',
        done: false,
      });

    io.to([editedMessage.authorId, editedMessage.receiverId]).emit(
      'editMessage',
      editedMessage.id,
      editedMessage.content,
      editedMessage.updatedAt
    );
    callback({
      error: '',
      done: true,
    });
  },
  deleteMessage: async (socket: CustomSocket, messageId: string) => {
    if (typeof messageId !== 'string') return;
    const message = await messagesService.find(messageId).catch(console.error);
    if (!message) return;
    if (message.authorId !== socket.user.id) return;

    const deletedMessage = await messagesService
      .delete(message.id)
      .catch(console.error);
    if (!deletedMessage) return;

    io.to([deletedMessage.authorId, deletedMessage.receiverId]).emit(
      'deleteMessage',
      deletedMessage.id
    );
  },
};

export default messagesController;
