import { useContext } from 'react';

import {
  HStack,
  VStack,
  Text,
  Tabs,
  TabPanels,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';

import Avatar from '../Avatar';
import FriendList from '../FriendList';

import { UserContext } from '../../context/UserContext';
import BottomNavigation from '../BottomNavigation';
import InviteList from '../InviteList';
import Settings from '../Settings';
import Profile from '../Profile';
import { getAvatarURL } from '../../utils/utils';

export default function HomeViewMobile(): JSX.Element {
  const { user } = useContext(UserContext);

  const headerBackground = useColorModeValue('white', 'blackAlpha.200');

  return (
    <VStack
      align="stretch"
      h="100vh"
      w="100%"
      as={Tabs}
      variant="unstyled"
      isLazy
    >
      <HStack bg={headerBackground} p="1rem" shadow={'md'} mb=".5rem">
        <Avatar src={getAvatarURL(user.avatar ?? undefined)} size="sm" />
        <Text fontWeight={'medium'}>{user.username}</Text>
      </HStack>
      <TabPanels flex="1">
        <TabPanel p={0}>
          <FriendList />
        </TabPanel>
        <TabPanel>
          <InviteList />
        </TabPanel>
        <TabPanel>
          <Profile />
        </TabPanel>
        <TabPanel>
          <Settings />
        </TabPanel>
      </TabPanels>
      <BottomNavigation />
    </VStack>
  );
}
