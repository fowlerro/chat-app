import type { Request, Response } from 'express';

import { Callback, Invite, User } from '@chat-app/api-interfaces';

import usersService from '../services/users';

import { CustomSocket, io } from '../../main';
import prisma from '../prisma';

const usersController = {
  getUser: async (req: Request, res: Response) => {
    res.json(req.session.user);
  },
  changeProfile: async (req: Request, res: Response) => {
    const { username } = req.body;
    const file = req.file;

    const updatedUser = await prisma.user
      .update({
        where: {
          id: req.session.user.id,
        },
        data: {
          avatar: file?.filename,
          username: username || undefined,
        },
        include: {
          friends: true,
        },
      })
      .catch(console.error);
    if (!updatedUser) return res.sendStatus(500);

    const onlineFriendRooms = updatedUser.friends
      .filter((friend) => io.sockets.adapter.rooms.has(friend.id))
      .map((friend) => friend.id);

    const data: User = {
      id: updatedUser.id,
      login: updatedUser.login,
      username: updatedUser.username,
      avatar: updatedUser.avatar,
      online: io.sockets.adapter.rooms.has(updatedUser.id),
    };

    req.session.user = data;
    io.to(onlineFriendRooms).emit('updateUser', data);

    res.status(200).json(data);
  },
  connectUser: async (socket: CustomSocket) => {
    socket.user = { ...socket.request.session.user };
    socket.join(socket.user.id);
  },
  disconnectUser: async (socket: CustomSocket) => {
    const friends = await usersService
      .getFriendList(socket.user.id)
      .catch(console.error);
    if (!friends) return;
    const onlineFriends = friends.filter((friend) => friend.online);
    const onlineFriendRooms = onlineFriends.map((friend) => friend.id);
    if (onlineFriendRooms.length)
      socket.to(onlineFriendRooms).emit('connected', false, socket.user.id);

    socket.leave(socket.user.id);
  },
  getFriends: async (socket: CustomSocket) => {
    const userFriends = await usersService
      .getFriendList(socket.user.id)
      .catch(console.error);
    if (!userFriends) return;

    const onlineFriends = userFriends.filter((friend) => friend.online);
    const onlineFriendRooms = onlineFriends.map((friend) => friend.id);
    if (onlineFriendRooms.length)
      socket.to(onlineFriendRooms).emit('connected', true, socket.user.id);

    socket.emit('getFriends', userFriends);
  },
  getInvites: async (socket: CustomSocket) => {
    const invites = await usersService.getInvites(socket.user.id);

    const invitesWithStatus = invites.map<Invite>((invite) => ({
      ...invite,
      creator: {
        ...invite.creator,
        online: io.sockets.adapter.rooms.has(invite.creatorId),
      },
      target: {
        ...invite.target,
        online: io.sockets.adapter.rooms.has(invite.targetId),
      },
    }));

    socket.emit('getInvites', invitesWithStatus);
  },
  sendInvite: async (
    socket: CustomSocket,
    targetLogin: string,
    callback: Callback
  ) => {
    const targetUser = await prisma.user
      .findUnique({
        where: {
          login: targetLogin,
        },
        include: {
          friends: true,
          invites: true,
          createdInvites: true,
        },
      })
      .catch(console.error);
    if (!targetUser) return callback({ error: 'User not found!', done: false });
    if (targetUser.friends.find((friend) => friend.id === socket.user.id))
      return callback({ error: 'User already is your friend!', done: false });
    if (
      targetUser.invites.find((invite) => invite.creatorId === socket.user.id)
    )
      return callback({ error: 'User has been already invited!', done: false });
    if (
      targetUser.createdInvites.find(
        (invite) => invite.targetId === socket.user.id
      )
    )
      return callback({ error: 'This user already invited you!', done: false });

    const createdInvite = await usersService
      .createInvite(socket.user.id, targetUser.id)
      .catch(console.error);

    if (!createdInvite)
      return callback({
        error: 'Something went wrong, please try again',
        done: false,
      });

    io.to([socket.user.id, targetUser.id]).emit('sendInvite', createdInvite);
    callback({ error: '', done: true });
  },
  acceptInvite: async (socket: CustomSocket, creatorId: string) => {
    const invite = await prisma.friendInvite
      .findFirst({
        where: {
          creatorId,
          targetId: socket.user.id,
        },
      })
      .catch(console.error);

    if (!invite) return;

    const prismaResults = await prisma
      .$transaction([
        // Add current user to inviter's friends
        prisma.user.update({
          where: {
            id: creatorId,
          },
          data: {
            friends: {
              connect: {
                id: socket.user.id,
              },
            },
          },
        }),
        // Add inviter to current user's friends
        prisma.user.update({
          where: {
            id: socket.user.id,
          },
          data: {
            friends: {
              connect: { id: creatorId },
            },
          },
        }),
        // Delete invite
        prisma.friendInvite.delete({
          where: {
            id: invite.id,
          },
        }),
      ])
      .catch(console.error);

    if (!prismaResults) return;
    const [inviteCreator, invitedUser, deletedInvite] = prismaResults;

    socket.emit('acceptInvite', deletedInvite.id, {
      id: inviteCreator.id,
      login: inviteCreator.login,
      username: inviteCreator.username,
      avatar: inviteCreator.avatar,
      online: io.sockets.adapter.rooms.has(inviteCreator.id),
    });
    io.to(inviteCreator.id).emit('acceptInvite', deletedInvite.id, {
      id: invitedUser.id,
      login: invitedUser.login,
      username: invitedUser.username,
      avatar: invitedUser.avatar,
      online: io.sockets.adapter.rooms.has(invitedUser.id),
    });
  },
  declineInvite: async (socket: CustomSocket, creatorId: string) => {
    const invite = await prisma.friendInvite
      .findFirst({
        where: {
          creatorId,
          targetId: socket.user.id,
        },
      })
      .catch(console.error);

    if (!invite) return;

    const deletedInvite = await prisma.friendInvite
      .delete({
        where: {
          id: invite.id,
        },
      })
      .catch(console.error);

    if (!deletedInvite) return;

    socket.emit('declineInvite', deletedInvite.id);
    io.to(creatorId).emit('declineInvite', deletedInvite.id);
  },
  removeFriend: async (socket: CustomSocket, friendId: string) => {
    const user = await prisma.user
      .findUnique({
        where: {
          id: socket.user.id,
        },
        include: {
          friends: true,
        },
      })
      .catch(console.error);
    if (!user) return;

    if (!user.friends.find((friend) => friend.id === friendId)) return;

    const res = await prisma.$transaction([
      prisma.user.update({
        where: {
          id: socket.user.id,
        },
        data: {
          friends: {
            disconnect: {
              id: friendId,
            },
          },
        },
      }),
      prisma.user.update({
        where: {
          id: friendId,
        },
        data: {
          friends: {
            disconnect: {
              id: socket.user.id,
            },
          },
        },
      }),
    ]);

    if (!res) return;

    socket.emit('removeFriend', friendId);
    io.to(friendId).emit('removeFriend', socket.user.id);
  },
};

export default usersController;
