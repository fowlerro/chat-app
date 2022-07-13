import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

interface NotificationsContextProps {
  children: ReactNode;
}

interface NotificationsContextValue {
  notifications: string[];
  setNotifications: Dispatch<SetStateAction<string[]>>;
}

export const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
} as unknown as NotificationsContextValue);

const NotificationsContextProvider = ({
  children,
}: NotificationsContextProps) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  return (
    <NotificationsContext.Provider value={{ notifications, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContextProvider;
