import { useContext, useEffect } from 'react';

import { FriendsContext } from '../context/FriendsContext';
import { InvitesContext } from '../context/InvitesContext';
import { MessagesContext } from '../context/MessagesContext';
import { NotificationsContext } from '../context/NotificationsContext';
import { UserContext } from '../context/UserContext';

import socket from '../socket';

const useSocket = () => {
  const { setUser } = useContext(UserContext);
  const { setMessages } = useContext(MessagesContext);
  const { setFriends } = useContext(FriendsContext);
  const { setInvites } = useContext(InvitesContext);
  const { setNotifications } = useContext(NotificationsContext);
  useEffect(() => {
    socket.connect();
    socket.emit('getMessages');
    socket.emit('getNotifications');
    socket.on('getMessages', (messages) => {
      setMessages(messages);
    });
    socket.on('editMessage', (messageId, newContent, updatedAt) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId
            ? { ...message, content: newContent, updatedAt }
            : message
        )
      );
    });
    socket.on('deleteMessage', (messageId) => {
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
    });
    socket.on('sendMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('getNotifications', (notifications) =>
      setNotifications(notifications)
    );
    socket.on('sendNotification', (chatId) => {
      setNotifications((prevNotifications) => [...prevNotifications, chatId]);
    });
    socket.emit('getFriends');
    socket.on('getFriends', (friendList) => {
      setFriends(friendList);
    });
    socket.emit('getInvites');
    socket.on('getInvites', (invites) => {
      setInvites(invites);
    });
    socket.on('sendInvite', (invite) => {
      setInvites((prevInvites) => [...prevInvites, invite]);
    });
    socket.on('acceptInvite', (inviteId, newFriend) => {
      setInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== inviteId)
      );
      setFriends((prevFriends) => [newFriend, ...prevFriends]);
    });
    socket.on('declineInvite', (inviteId) => {
      setInvites((prevInvites) =>
        prevInvites.filter((invite) => invite.id !== inviteId)
      );
    });
    socket.on('removeFriend', (friendId) => {
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== friendId)
      );
    });

    socket.on('deleteAccount', (userId) => {
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.id !== userId)
      );
      setMessages((prevMessages) =>
        prevMessages.filter(
          (message) =>
            message.authorId !== userId || message.receiverId !== userId
        )
      );
      setInvites((prevInvites) =>
        prevInvites.filter(
          (invite) => invite.creatorId !== userId || invite.targetId !== userId
        )
      );
    });

    socket.on('updateUser', (user) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) => (friend.id === user.id ? user : friend))
      );
    });

    socket.on('connected', (status, userId) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === userId ? { ...friend, online: status } : friend
        )
      );
    });
    socket.on('connect_error', () => {
      setUser({
        isLoggedIn: false,
        id: null,
        login: null,
        username: null,
        avatar: null,
      });
    });

    return () => {
      socket.off('getMessages');
      socket.off('editMessage');
      socket.off('sendMessage');
      socket.off('getNotifications');
      socket.off('sendNotification');
      socket.off('getFriends');
      socket.off('getInvites');
      socket.off('sendInvite');
      socket.off('acceptInvite');
      socket.off('declineInvite');
      socket.off('removeFriend');
      socket.off('deleteAccount');
      socket.off('updateUser');
      socket.off('connected');
      socket.off('connect_error');
    };
  }, [setUser, setFriends, setMessages, setInvites, setNotifications]);
};

export default useSocket;
