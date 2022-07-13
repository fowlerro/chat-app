import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  useColorMode,
  Text,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';

import {
  LoginResponse,
  SignUpErrors,
  SignInErrors,
} from '@chat-app/api-interfaces';
import { UserContext } from '../context/UserContext';
import Input from './Input';
import useAuth from '../hooks/useAuth';

export default function Login(): JSX.Element {
  const [signingUp, setSigningUp] = useState(false);

  const { colorMode } = useColorMode();
  const navigate = useNavigate();
  const isLogin = useAuth();

  useEffect(() => {
    if (isLogin) navigate('/');
  }, [isLogin]);

  const switchForm = () => setSigningUp(!signingUp);

  return (
    <Container display="flex" centerContent h="100%" justifyContent={'center'}>
      <Box
        bg={['none', colorMode === 'light' ? 'white' : 'gray.800']}
        p="1rem"
        borderRadius={'10px'}
        shadow={['none', 'md']}
        display="flex"
        flexDir="column"
        rowGap="1rem"
      >
        {signingUp ? (
          <SignUp switchForm={switchForm} />
        ) : (
          <SignIn switchForm={switchForm} />
        )}
      </Box>
    </Container>
  );
}

interface FormProps {
  switchForm: () => void;
}

function SignIn({ switchForm }: FormProps): JSX.Element {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignInErrors>({
    login: '',
    password: '',
    form: '',
  });

  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleInputChange =
    (setter: Dispatch<SetStateAction<string>>, errorKey: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrors((errors) => ({ ...errors, [errorKey]: '' }));
    };

  const handleSubmit = async () => {
    setLoading(true);
    const formErrors: SignInErrors = {};

    if (!login) formErrors.login = 'Login is required!';
    if (!password) formErrors.password = 'Password is required!';

    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    axios
      .post<LoginResponse>(
        '/auth/login',
        { login, password },
        { withCredentials: true }
      )
      .catch((err) => {
        setErrors(err.response.data);
        setLoading(false);
      })
      .then((res) => {
        setLoading(false);
        if (res && res.data) {
          setUser({
            ...res.data,
            isLoggedIn: true,
            avatar: res.data.avatar ?? null,
          });
          navigate('/');
        }
      });
  };

  return (
    <>
      <Heading textAlign="center" mb="1rem" flex="1">
        Sign in
      </Heading>

      <Input
        placeholder={'Login'}
        type="text"
        value={login}
        onChange={handleInputChange(setLogin, 'login')}
        errorText={errors.login}
        sx={{
          mb: ['1rem', 0],
        }}
      />
      <Input
        placeholder={'Password'}
        type="password"
        value={password}
        onChange={handleInputChange(setPassword, 'password')}
        errorText={errors.password}
        sx={{
          mb: '1rem',
        }}
      />
      {errors.form && <Text color="red.500">{errors.form}</Text>}
      <HStack flex="1" justifyContent="space-between">
        <Button colorScheme="cyan" onClick={handleSubmit} isLoading={loading}>
          Sign in
        </Button>
        <Button onClick={() => switchForm()} isLoading={loading}>
          Create Account
        </Button>
      </HStack>
    </>
  );
}

function SignUp({ switchForm }: FormProps): JSX.Element {
  const [login, setLogin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<SignUpErrors>({
    login: '',
    username: '',
    password: '',
    confirmPassword: '',
    form: '',
  });

  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    const formErrors: SignUpErrors = {};

    if (!login) formErrors.login = 'Login is required!';
    if (!username) formErrors.username = 'Username is required!';
    if (!password) formErrors.password = 'Password is required!';
    if (!confirmPassword)
      formErrors.confirmPassword = 'You must confirm your password!';
    if (confirmPassword && password !== confirmPassword)
      formErrors.confirmPassword = 'Passwords must be the same!';

    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    axios
      .post<LoginResponse>(
        '/auth/signup',
        {
          login,
          username,
          password,
          confirmPassword,
        },
        { withCredentials: true }
      )
      .catch((err) => {
        setErrors(err.response.data);
        setLoading(false);
      })
      .then((res) => {
        setLoading(false);
        if (res && res.data) {
          setUser({
            ...res.data,
            isLoggedIn: true,
            avatar: res.data.avatar ?? null,
          });
          navigate('/');
        }
      });
  };

  const handleInputChange =
    (setter: Dispatch<SetStateAction<string>>, errorKey: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrors((errors) => ({ ...errors, [errorKey]: '' }));
    };

  return (
    <>
      <Heading textAlign="center" mb="1rem" flex="1">
        Sign Up
      </Heading>

      <Input
        placeholder={'Login'}
        type="text"
        value={login}
        onChange={handleInputChange(setLogin, 'login')}
        errorText={errors.login}
        sx={{
          mb: ['1rem', 0],
        }}
      />
      <Input
        placeholder={'Username'}
        type="text"
        value={username}
        onChange={handleInputChange(setUsername, 'username')}
        errorText={errors.username}
        sx={{
          mb: ['1rem', 0],
        }}
      />
      <Input
        placeholder={'Password'}
        type="password"
        value={password}
        onChange={handleInputChange(setPassword, 'password')}
        errorText={errors.password}
        sx={{
          mb: ['1rem', 0],
        }}
      />
      <Input
        placeholder={'Confirm password'}
        type="password"
        value={confirmPassword}
        onChange={handleInputChange(setConfirmPassword, 'confirmPassword')}
        errorText={errors.confirmPassword}
        sx={{
          mb: '1rem',
        }}
      />
      {errors.form && <Text color="red.500">{errors.form}</Text>}
      <HStack flex="1" justifyContent="space-between">
        <Button colorScheme="cyan" onClick={handleSubmit} isLoading={loading}>
          Sign up
        </Button>
        <Button onClick={() => switchForm()} isLoading={loading}>
          <MdArrowBack fontSize="1.25rem" style={{ marginRight: '.25rem' }} />{' '}
          Back
        </Button>
      </HStack>
    </>
  );
}
