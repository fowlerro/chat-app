import { Navigate, Outlet } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import useSocket from '../hooks/useSocket';

export default function ProtectedRoute(): JSX.Element {
  const isAuth = useAuth();

  return isAuth ? <ProtectedLayout /> : <Navigate to="/login" />;
}

function ProtectedLayout() {
  useSocket();

  return <Outlet />;
}
