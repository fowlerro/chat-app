import { Box, Divider } from '@chakra-ui/react';

import FriendList from '../FriendList';
import User from '../User';

export default function Sidebar(): JSX.Element {
  return (
    <>
      <Box minW="300px" display="flex" flexDir="column" h="100%">
        <Box m="1rem .5rem" flex="1">
          <FriendList />
        </Box>
        <User />
      </Box>
      <Divider margin={'0 !important'} orientation="vertical" />
    </>
  );
}
