import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import prisma from '../prisma';

import usersService from './users';

const authService = {
  isLoginTaken: async (login: string): Promise<boolean> => {
    const user = await usersService.findByLogin(login);

    return Boolean(user);
  },
  signup: async (user: Prisma.UserCreateInput): Promise<User> => {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const signedUpUser = await prisma.user.create({
      data: {
        login: user.login,
        password: hashedPassword,
        username: user.username,
        avatar: `default_${Math.floor(Math.random() * (4 - 1 + 1) + 1)}.png`,
      },
    });

    return signedUpUser;
  },
  checkPassword: async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },
  changePassword: async (userId: string, newPassword: string) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return user;
  },
};

export default authService;
