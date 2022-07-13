import { useNavigate } from 'react-router-dom';

import {
  Button,
  Heading,
  HStack,
  IconButton,
  Show,
  Skeleton,
  SkeletonCircle,
  Theme,
  Tooltip,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { MdChevronLeft, MdPersonOff } from 'react-icons/md';

import { User } from '@chat-app/api-interfaces';
import Avatar from '../Avatar';
import { getAvatarURL } from '../../utils/utils';
import socket from '../../socket';

interface HeaderProps {
  friend: User | undefined;
}

export default function Header({ friend }: HeaderProps): JSX.Element {
  const background = useColorModeValue('blackAlpha.50', 'gray.800');

  const navigate = useNavigate();
  const theme = useTheme<Theme>();

  const handleRemoveFriend = () => {
    if (!friend) return;
    socket.emit('removeFriend', friend.id);
    navigate('/');
  };

  return (
    <HStack bg={background} p="1rem" shadow="md">
      <IconButton
        aria-label="Back"
        variant="ghost"
        isRound
        onClick={() => navigate('/')}
      >
        <MdChevronLeft fontSize="2rem" />
      </IconButton>
      <SkeletonCircle
        isLoaded={Boolean(friend)}
        width={theme.sizes[8]}
        height={theme.sizes[8]}
      >
        <Avatar
          src={getAvatarURL(friend?.avatar)}
          isOnline={friend?.online}
          withBadge
          size="sm"
        />
      </SkeletonCircle>
      <Skeleton isLoaded={Boolean(friend)} flex="1">
        <Heading fontSize="xl" ml=".5rem">
          {friend?.username}
        </Heading>
      </Skeleton>
      <Show above="md">
        <Button colorScheme="red" size="sm" onClick={handleRemoveFriend}>
          Remove friend
        </Button>
      </Show>
      <Show below="md">
        <Tooltip label="Remove friend">
          <IconButton
            aria-label="Remove friend"
            colorScheme="red"
            onClick={handleRemoveFriend}
          >
            <MdPersonOff />
          </IconButton>
        </Tooltip>
      </Show>
    </HStack>
  );
}
