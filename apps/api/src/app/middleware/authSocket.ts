import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

const authSocket = (socket: Socket, next: (err?: ExtendedError) => void) => {
  if (!socket.request.session || !socket.request.session.user)
    return next(new Error('Not authorized'));
  next();
};

export default authSocket;
