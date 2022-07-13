import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

import type { Message } from '@chat-app/api-interfaces';

interface MessagesContextProps {
  children: ReactNode;
}

interface MessagesContextValue {
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}

export const MessagesContext = createContext<MessagesContextValue>({
  messages: [],
} as unknown as MessagesContextValue);

const MessagesContextProvider = ({ children }: MessagesContextProps) => {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <MessagesContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};

export default MessagesContextProvider;
