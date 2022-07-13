import {
  Box,
  Button,
  HStack,
  Show,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from '@chakra-ui/react';
import InviteList from '../InviteList';
import Profile from '../Profile';
import Settings from '../Settings';

import Sidebar from '../Sidebar';

export default function HomeViewDesktop(): JSX.Element {
  return (
    <HStack h="100vh" alignItems="flex-start" as={Tabs} variant="unstyled">
      <Show above="md">
        <Sidebar />
      </Show>
      <Box flex="1" m={'0 !important'}>
        <VStack maxWidth="600px" marginInline="auto">
          <HStack as={TabList} mt="1rem">
            <Button
              as={Tab}
              _selected={{
                color: 'cyan.500',
              }}
            >
              Invites
            </Button>
            <Button
              as={Tab}
              _selected={{
                color: 'cyan.500',
              }}
            >
              Profile
            </Button>
            <Button
              as={Tab}
              _selected={{
                color: 'cyan.500',
              }}
            >
              Settings
            </Button>
          </HStack>
          <TabPanels flex="1">
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
        </VStack>
      </Box>
    </HStack>
  );
}
