import { Button, HStack, Text, VStack, useDisclosure } from '@chakra-ui/react';

import ThemeSwitcher from '../ThemeSwitcher';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountAlert from './DeleteAccountAlert';

import useLogout from '../../hooks/useLogout';

export default function Settings(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();

  const handleLogout = useLogout();

  return (
    <>
      <VStack rowGap=".5rem" w="100%" align="stretch">
        <HStack justify="space-between">
          <Text>Theme</Text>
          <ThemeSwitcher />
        </HStack>
        <Button variant="outline" onClick={onOpen}>
          Change password
        </Button>
        <Button colorScheme="red" onClick={handleLogout}>
          Logout
        </Button>
        <Button colorScheme="red" onClick={onAlertOpen}>
          Delete Account
        </Button>
      </VStack>
      <ChangePasswordModal isOpen={isOpen} onClose={onClose} />
      <DeleteAccountAlert isOpen={isAlertOpen} onClose={onAlertClose} />
    </>
  );
}
