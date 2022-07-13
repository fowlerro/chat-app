import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from '../utils/axios';

import { UserContext } from '../context/UserContext';

const useLogout = () => {
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const logout = async () => {
    const res = await axios.delete('/auth/logout', {
      withCredentials: true,
    });
    if (res.status !== 200) return;
    setUser({
      avatar: null,
      id: null,
      isLoggedIn: false,
      login: null,
      username: null,
    });
    navigate('/login');
  };

  return logout;
};

export default useLogout;
