import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from 'react';

import type { Invite } from '@chat-app/api-interfaces';

interface InvitesContextProps {
  children: ReactNode;
}

interface InvitesContextValue {
  invites: Invite[];
  setInvites: Dispatch<SetStateAction<Invite[]>>;
}

export const InvitesContext = createContext<InvitesContextValue>({
  friends: [],
} as unknown as InvitesContextValue);

const InvitesContextProvider = ({ children }: InvitesContextProps) => {
  const [invites, setInvites] = useState<Invite[]>([]);

  return (
    <InvitesContext.Provider value={{ invites, setInvites }}>
      {children}
    </InvitesContext.Provider>
  );
};

export default InvitesContextProvider;
