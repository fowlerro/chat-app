import { HStack, IconButton, Text, Tooltip, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { MdLogout } from 'react-icons/md';
import { UserContext } from '../context/UserContext';
import useLogout from '../hooks/useLogout';
import { getAvatarURL } from '../utils/utils';
import Avatar from './Avatar';

export default function User(): JSX.Element {
  const { user } = useContext(UserContext);
  const logout = useLogout();

  return (
    <HStack bg="blackAlpha.300" p=".5rem 1rem" shadow="2xl">
      <Avatar src={getAvatarURL(user.avatar ?? undefined)} />
      <VStack flex="1" align="flex-start">
        <Text fontWeight="semibold" fontSize="md">
          {user.username}
        </Text>
        <Text fontSize="xs" m="0 !important" fontWeight="light" color="gray">
          @{user.login}
        </Text>
      </VStack>
      <Tooltip label="Logout">
        <IconButton aria-label="Logout" colorScheme="red" onClick={logout}>
          <MdLogout />
        </IconButton>
      </Tooltip>
    </HStack>
  );
}
