import type { Invite, User } from '@chat-app/api-interfaces';

import prisma from '../prisma';
import { io } from '../../main';

const usersService = {
  findByLogin: async (login: string) => {
    const foundUser = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    return foundUser;
  },
  getFriendList: async (userId: string): Promise<User[]> => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: {
          select: {
            id: true,
            login: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!user) return [];

    const friends: User[] = user.friends.map((friend) => {
      const isOnline = io.sockets.adapter.rooms.has(friend.id);
      return {
        ...friend,
        online: isOnline,
      };
    });

    return friends;
  },
  getInvites: async (userId: string): Promise<Invite[]> => {
    const invites = await prisma.friendInvite.findMany({
      where: {
        OR: [
          {
            creatorId: userId,
          },
          {
            targetId: userId,
          },
        ],
      },
      include: {
        creator: {
          select: {
            id: true,
            login: true,
            username: true,
            avatar: true,
          },
        },
        target: {
          select: {
            id: true,
            login: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return invites;
  },
  createInvite: async (creatorId: string, targetId: string) => {
    const invite = await prisma.friendInvite.create({
      data: {
        creatorId,
        targetId,
      },
      include: {
        creator: {
          select: {
            id: true,
            login: true,
            username: true,
            avatar: true,
          },
        },
        target: {
          select: {
            id: true,
            login: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return invite;
  },
};

export default usersService;
