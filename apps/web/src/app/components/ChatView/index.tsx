import { Box, HStack, Show } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FriendsContext } from '../../context/FriendsContext';
import { NotificationsContext } from '../../context/NotificationsContext';
import socket from '../../socket';

import Chat from '../Chat';
import Sidebar from '../Sidebar';

export default function ChatView(): JSX.Element {
  const { notifications, setNotifications } = useContext(NotificationsContext);
  const { friends } = useContext(FriendsContext);
  const { user } = useParams();

  const friend = friends.find((friend) => friend.login === user);

  useEffect(() => {
    if (!friend?.id) return;
    if (!notifications.find((notification) => notification === friend.id))
      return;
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification !== friend.id)
    );
    socket.emit('readNotification', friend.id);
  }, [friend?.id, notifications, setNotifications]);

  return (
    <HStack h="100vh" alignItems="flex-start">
      <Show above="md">
        <Sidebar />
      </Show>
      <Box flex="1" m={'0 !important'}>
        <Chat />
      </Box>
    </HStack>
  );
}
