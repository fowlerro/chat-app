import * as dotenv from 'dotenv';
dotenv.config();
import * as http from 'http';
import * as express from 'express';
import { Server, Socket } from 'socket.io';
import * as cors from 'cors';
import * as path from 'path';

import routes from './app/routes';
import sessionMiddleware from './app/middleware/session';
import authSocket from './app/middleware/authSocket';
import { socketEvents } from './socket';

import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@chat-app/api-interfaces';

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: ['http://localhost:4200', 'http://192.168.0.103:4200'],
  credentials: true,
};
export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export const io = new Server<ClientToServerEvents, ServerToClientEvents>(
  server,
  {
    cors: corsOptions,
  }
);
const port = process.env.port || 3333;

app.use(express.static(path.join(__dirname, 'assets')));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);

app.use('/', routes);

io.use((socket, next) =>
  sessionMiddleware(socket.request as never, {} as never, next as never)
);
io.use(authSocket);
io.on('connection', socketEvents.connection);

server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/api');
});
server.on('error', console.error);
