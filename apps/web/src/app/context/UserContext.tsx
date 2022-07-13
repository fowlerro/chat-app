import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../utils/axios';

interface UserContextProps {
  children: ReactNode;
}

interface User {
  isLoggedIn: boolean | null;
  id: string | null;
  login: string | null;
  username: string | null;
  avatar: string | null;
}

interface UserContextValue {
  user: User;
  setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextValue>({
  user: {
    isLoggedIn: null,
    id: null,
    login: null,
    username: null,
    avatar: null,
  },
} as UserContextValue);

const UserContextProvider = ({ children }: UserContextProps) => {
  const [user, setUser] = useState<User>({
    isLoggedIn: null,
    id: null,
    login: null,
    username: null,
    avatar: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/users', {
        withCredentials: true,
      })
      .catch((err) => {
        setUser({
          isLoggedIn: false,
          id: null,
          login: null,
          username: null,
          avatar: null,
        });
        return;
      })
      .then((res) => {
        if (!res || !res.data) {
          setUser({
            isLoggedIn: false,
            id: null,
            login: null,
            username: null,
            avatar: null,
          });
          return;
        }
        setUser({ ...res.data, isLoggedIn: true });
      });
  }, [navigate]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
