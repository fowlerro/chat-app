import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import App from './app/app';
import theme from './app/styles/theme';

import FriendsContextProvider from './app/context/FriendsContext';
import UserContextProvider from './app/context/UserContext';
import MessagesContextProvider from './app/context/MessagesContext';
import InvitesContextProvider from './app/context/InvitesContext';
import NotificationsContextProvider from './app/context/NotificationsContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme['config'].initialColorMode} />
      <BrowserRouter>
        <UserContextProvider>
          <FriendsContextProvider>
            <InvitesContextProvider>
              <MessagesContextProvider>
                <NotificationsContextProvider>
                  <Routes>
                    <Route path="/*" element={<App />} />
                  </Routes>
                </NotificationsContextProvider>
              </MessagesContextProvider>
            </InvitesContextProvider>
          </FriendsContextProvider>
        </UserContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </StrictMode>
);
