export type LoginResponse = User;

export interface User {
  id: string;
  login: string;
  username: string;
  avatar?: string;
  online?: boolean;
}

export interface Message {
  id: string;
  author?: User;
  authorId: string;
  receiverId?: string;
  content: string;
  sentAt: Date;
  updatedAt: Date;
}

export type Callback = ({
  error,
  done,
}: {
  error: string;
  done: boolean;
}) => void;

export interface ServerToClientEvents {
  getMessages: (messages: Message[]) => void;
  sendMessage: (message: Message) => void;
  editMessage: (messageId: string, newContent: string, updatedAt: Date) => void;
  deleteMessage: (messageId: string) => void;
  getFriends: (friendList: User[]) => void;
  getInvites: (invites: Invite[]) => void;
  sendInvite: (invite: Invite) => void;
  acceptInvite: (inviteId: string, newFriend: User) => void;
  declineInvite: (inviteId: string) => void;
  removeFriend: (friendId: string) => void;
  connected: (status: boolean, userId: string) => void;
  getNotifications: (notifications: string[]) => void;
  sendNotification: (chatId: string) => void;
  deleteAccount: (userId: string) => void;
  updateUser: (updatedUser: User) => void;
}

export interface ClientToServerEvents {
  getMessages: () => void;
  sendMessage: (receiverId: string, messageContent: string) => void;
  editMessage: (
    messageId: string,
    newContent: string,
    callback: Callback
  ) => void;
  deleteMessage: (messageId: string) => void;
  getFriends: () => void;
  getInvites: () => void;
  sendInvite: (targetLogin: string, callback: Callback) => void;
  acceptInvite: (creatorId: string) => void;
  declineInvite: (creatorId: string) => void;
  removeFriend: (friendId: string) => void;
  getNotifications: () => void;
  readNotification: (chatId: string) => void;
}

export interface SignUpRequestBody {
  login: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpErrors {
  login?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export interface SignInErrors {
  login?: string;
  password?: string;
  form?: string;
}

export interface Invite {
  id: string;
  creator: User;
  creatorId: string;
  target: User;
  targetId: string;
  createdAt: Date;
}
