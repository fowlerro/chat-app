import { Box, Heading, HStack, IconButton, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { MdSend } from 'react-icons/md';
import socket from '../../socket';
import Input from '../Input';

interface InviteFriendProps {}

export default function InviteFriend({}: InviteFriendProps): JSX.Element {
  const [login, setLogin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInvite = () => {
    if (!login) return setErrorMessage('Login is required!');
    socket.emit('sendInvite', login, ({ error, done }) => {
      if (done) {
        // Sucessfully invited;
        setLogin('');
        setErrorMessage('');
      }
      setErrorMessage(error);
    });
  };

  return (
    <Box>
      <Heading fontSize="lg" textAlign="center" mb=".5rem">
        Invite Friend
      </Heading>
      <HStack alignItems="flex-start">
        <Input
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder={"Enter friend's login"}
          autoComplete="off"
          errorText={errorMessage}
          size="sm"
        />
        <IconButton
          size="sm"
          colorScheme="cyan"
          aria-label="Invite friend"
          onClick={handleInvite}
        >
          <MdSend />
        </IconButton>
      </HStack>
    </Box>
  );
}
