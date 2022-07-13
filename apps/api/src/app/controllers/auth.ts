import { Request, Response } from 'express';

import authService from '../services/auth';
import usersService from '../services/users';
import { io } from '../../main';
import {
  SignInErrors,
  SignUpErrors,
  SignUpRequestBody,
} from '@chat-app/api-interfaces';
import prisma from '../prisma';

interface LoginBody {
  login: string;
  password: string;
}

const authController = {
  signup: async (req: Request, res: Response) => {
    try {
      const { login, username, password, confirmPassword } =
        req.body as SignUpRequestBody;
      const errors: SignUpErrors = {};

      if (!login) errors.login = 'Login is required!';
      if (typeof login !== 'string') errors.login = 'Invalid login!';
      if (!username) errors.username = 'Username is required!';
      if (typeof username !== 'string') errors.username = 'Invalid username!';
      if (!password) errors.password = 'Password is required!';
      if (typeof password !== 'string') errors.password = 'Invalid password!';
      if (!confirmPassword)
        errors.confirmPassword = 'You must confirm your password!';
      if (confirmPassword && password !== confirmPassword)
        errors.confirmPassword = 'Passwords must be the same!';

      if (Object.keys(errors).length) return res.status(400).json(errors);

      if (await authService.isLoginTaken(login))
        return res.status(409).json({ login: 'Login taken!' });

      const signedUpUser = await authService.signup({
        login,
        password,
        username,
      });

      req.session.user = {
        id: signedUpUser.id,
        login: signedUpUser.login,
        username: signedUpUser.username,
        avatar: signedUpUser.avatar,
      };
      res.status(201).json({
        id: signedUpUser.id,
        login: signedUpUser.login,
        username: signedUpUser.username,
        avatar: signedUpUser.avatar,
      });
    } catch (err) {
      res.status(500).json({ form: err.message });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { login, password } = req.body as LoginBody;

      const errors: SignInErrors = {};
      if (!login) errors.login = 'Login is required!';
      if (typeof login !== 'string') errors.login = 'Invalid login!';
      if (!password) errors.password = 'Password is required!';
      if (typeof password !== 'string') errors.password = 'Invalid password!';

      if (Object.keys(errors).length) return res.status(400).json(errors);

      const user = await usersService.findByLogin(login);
      if (!user)
        return res
          .status(401)
          .json({ form: 'Login or password is incorrect!' });

      const matchPassword = await authService.checkPassword(
        password,
        user.password
      );
      if (!matchPassword)
        return res
          .status(401)
          .json({ form: 'Login or password is incorrect!' });

      req.session.user = {
        id: user.id,
        login: user.login,
        username: user.username,
        avatar: user.avatar,
      };

      res.json({
        id: user.id,
        login: user.login,
        username: user.username,
        avatar: user.avatar,
      });
    } catch (err) {
      res.status(500).json({ form: err.message });
    }
  },
  logout: async (req: Request, res: Response) => {
    if (!req.session) return res.end();

    const userId = req.session.user.id;
    req.session.destroy((err) => {
      if (err) return res.sendStatus(400);
      res.clearCookie('sid');
      io.sockets.in(userId).disconnectSockets();
      res.sendStatus(200);
    });
  },
  changePassword: async (req: Request, res: Response) => {
    const { newPassword, confirmNewPassword } = req.body;
    if (!newPassword)
      return res.status(400).json({ password: 'Field is required!' });
    if (!confirmNewPassword)
      return res.status(400).json({ confirmPassword: 'Field is required!' });
    if (typeof newPassword !== 'string')
      return res.status(400).json({ password: 'Invalid value!' });
    if (typeof confirmNewPassword !== 'string')
      return res.status(400).json({ confirmPassword: 'Invalid value!' });

    if (newPassword !== confirmNewPassword)
      return res
        .status(400)
        .json({ confirmPassword: 'Passwords must be the same!' });

    const newUser = await authService
      .changePassword(req.session.user.id, newPassword)
      .catch(console.error);

    if (!newUser) return res.sendStatus(500);

    res.sendStatus(200);
  },
  deleteAccount: async (req: Request, res: Response) => {
    const userId = req.session.user.id;

    const deletedAccount = await prisma.user
      .delete({
        where: {
          id: userId,
        },
        include: {
          friends: true,
          createdInvites: true,
          invites: true,
        },
      })
      .catch(console.error);

    if (!deletedAccount) return res.sendStatus(500);

    const socketRooms = new Set<string>();
    deletedAccount.friends.forEach((friend) => socketRooms.add(friend.id));
    deletedAccount.createdInvites.forEach((invite) =>
      socketRooms.add(invite.targetId)
    );
    deletedAccount.invites.forEach((invite) =>
      socketRooms.add(invite.creatorId)
    );

    req.session.destroy((err) => {
      if (err) return res.sendStatus(400);
      res.clearCookie('sid');
      io.sockets.in(userId).disconnectSockets();
      io.sockets
        .to(Array.from(socketRooms))
        .emit('deleteAccount', deletedAccount.id);
      res.sendStatus(200);
    });
  },
};

export default authController;
