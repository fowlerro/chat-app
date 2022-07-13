import { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Main from './components/Main';
import ChatView from './components/ChatView';
import Login from './components/Login';

import { UserContext } from './context/UserContext';

export const App = () => {
  const { user } = useContext(UserContext);

  return user.isLoggedIn === null ? (
    <>Loading</>
  ) : (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Main />} />
          <Route path="chats/:user" element={<ChatView />} />
        </Route>
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};

export default App;
