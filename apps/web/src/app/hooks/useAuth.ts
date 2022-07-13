import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const useAuth = () => {
  const { user } = useContext(UserContext);
  return Boolean(user?.login);
};

export default useAuth;
