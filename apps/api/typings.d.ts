import 'express-session';
import 'http';
import 'socket.io';
import { Session, SessionData } from 'express-session';

import { User } from '@chat-app/api-interfaces';

declare module 'express-session' {
  interface SessionData {
    user?: User;
  }
}

declare module 'socket.io' {
  interface Socket {
    user?: User;
  }
}

declare module 'http' {
  interface IncomingMessage {
    session: Session & SessionData;
  }
}
