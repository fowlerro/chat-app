import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

import type { User } from '@chat-app/api-interfaces';

interface FriendsContextProps {
  children: ReactNode;
}

interface FriendsContextValue {
  friends: User[];
  setFriends: Dispatch<SetStateAction<User[]>>;
}

export const FriendsContext = createContext<FriendsContextValue>({
  friends: [],
} as unknown as FriendsContextValue);

const FriendsContextProvider = ({ children }: FriendsContextProps) => {
  const [friends, setFriends] = useState<User[]>([]);

  return (
    <FriendsContext.Provider value={{ friends, setFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};

export default FriendsContextProvider;
