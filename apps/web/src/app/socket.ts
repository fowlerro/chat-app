import { io, Socket } from 'socket.io-client';

import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@chat-app/api-interfaces';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://192.168.0.103:3333',
  {
    autoConnect: false,
    withCredentials: true,
  }
);

export default socket;
