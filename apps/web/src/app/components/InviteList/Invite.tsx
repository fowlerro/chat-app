import { useContext } from 'react';

import {
  Badge,
  Divider,
  HStack,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';

import Avatar from '../Avatar';

import { UserContext } from '../../context/UserContext';

import { Invite as InviteType } from '@chat-app/api-interfaces';
import socket from '../../socket';
import { MdPersonAdd, MdPersonOff } from 'react-icons/md';
import { getAvatarURL } from '../../utils/utils';
import ListItem from '../ListItem';

interface InviteProps {
  invite: InviteType;
}

export default function Invite({ invite }: InviteProps): JSX.Element {
  const { user } = useContext(UserContext);

  const background = useColorModeValue('blackAlpha.400', 'whiteAlpha.200');

  const handleAcceptInvite = () => {
    socket.emit('acceptInvite', invite.creatorId);
  };

  const handleDeclineInvite = () => {
    socket.emit('declineInvite', invite.creatorId);
  };

  const inviteUser =
    invite.creatorId === user.id ? invite.target : invite.creator;

  return (
    <ListItem>
      <Avatar
        src={getAvatarURL(inviteUser.avatar)}
        isOnline={inviteUser.online}
        withBadge
        size="sm"
      />
      <VStack alignItems="flex-start" flex="1">
        <Text fontSize="sm" fontWeight={'semibold'}>
          {inviteUser.username}
        </Text>
        <Text fontSize="xs" mt={'0 !important'} color="gray">
          @{inviteUser.login}
        </Text>
      </VStack>
      {invite.creatorId === user.id ? (
        <Badge bg={background}>PENDING</Badge>
      ) : (
        <>
          <Tooltip label="Accept invite">
            <IconButton
              aria-label="Accept"
              onClick={handleAcceptInvite}
              colorScheme="cyan"
              size="sm"
            >
              <MdPersonAdd />
            </IconButton>
          </Tooltip>
          <Tooltip label="Decline invite">
            <IconButton
              aria-label="Decline"
              onClick={handleDeclineInvite}
              bg={background}
              size="sm"
            >
              <MdPersonOff />
            </IconButton>
          </Tooltip>
        </>
      )}
    </ListItem>
  );
}
