import { useContext, Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
  Text,
  VStack,
  LinkBox,
  LinkOverlay,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';

import Avatar from '../Avatar';

import { FriendsContext } from '../../context/FriendsContext';
import { getAvatarURL } from '../../utils/utils';
import { NotificationsContext } from '../../context/NotificationsContext';
import { MessagesContext } from '../../context/MessagesContext';
import { UserContext } from '../../context/UserContext';

export default function FriendList(): JSX.Element {
  const { friends } = useContext(FriendsContext);
  const { notifications } = useContext(NotificationsContext);
  const { messages } = useContext(MessagesContext);
  const { user } = useContext(UserContext);

  const sortedMessages = messages.sort(
    (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
  const sortedFriends = friends.sort(
    (a, b) =>
      sortedMessages.findIndex(
        (message) => message.authorId === a.id || message.receiverId === a.id
      ) -
      sortedMessages.findIndex(
        (message) => message.authorId === b.id || message.receiverId === b.id
      )
  );

  const hoverBackground = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');
  const unreadTextColor = useColorModeValue('black', 'white');

  return (
    <VStack alignItems="stretch" flex="1">
      {sortedFriends.map((friend) => (
        <Fragment key={friend.id}>
          <HStack
            alignItems="center"
            as={LinkBox}
            padding=".5rem 1rem"
            borderRadius="md"
            _hover={{
              bg: hoverBackground,
            }}
          >
            <Avatar
              src={getAvatarURL(friend.avatar)}
              isOnline={friend.online}
              withBadge
              size="sm"
            />
            <VStack alignItems="flex-start" overflow="hidden">
              <LinkOverlay
                fontSize="sm"
                fontWeight={'semibold'}
                as={Link}
                to={`/chats/${friend.login}`}
              >
                {friend.username}
              </LinkOverlay>
              <Text
                fontSize="xs"
                mt={'0 !important'}
                color={
                  notifications.find((notif) => notif === friend.id)
                    ? unreadTextColor
                    : 'gray'
                }
                textOverflow="ellipsis"
                overflow="hidden"
                maxW={['100%', null, '200px']}
                whiteSpace="nowrap"
                fontWeight={
                  notifications.find((notif) => notif === friend.id)
                    ? 'bold'
                    : 'normal'
                }
              >
                {
                  sortedMessages.find(
                    (message) =>
                      (message.authorId === user.id &&
                        message.receiverId === friend.id) ||
                      (message.authorId === friend.id &&
                        message.receiverId === user.id)
                  )?.content
                }
              </Text>
            </VStack>
          </HStack>
        </Fragment>
      ))}
    </VStack>
  );
}
