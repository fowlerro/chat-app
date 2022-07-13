import { useContext } from 'react';

import { Box, Divider, VStack } from '@chakra-ui/react';

import Invite from './Invite';
import InviteFriend from './InviteFriend';

import { InvitesContext } from '../../context/InvitesContext';

export default function InviteList(): JSX.Element {
  const { invites } = useContext(InvitesContext);

  return (
    <>
      <VStack>
        <InviteFriend />
        <Divider />
        <VStack alignItems="stretch" flex="1" marginInline={'.5rem'} w="100%">
          {invites.map((invite) => (
            <Invite key={invite.id} invite={invite} />
          ))}
        </VStack>
      </VStack>
    </>
  );
}
