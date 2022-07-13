import { useContext, useRef } from 'react';
import axios from '../../utils/axios';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';

import useLogout from '../../hooks/useLogout';
import { UserContext } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

interface DeleteAccountAlertProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteAccountAlert({
  isOpen,
  onClose,
}: DeleteAccountAlertProps): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    axios
      .delete('/auth/delete-account', {
        withCredentials: true,
      })
      .then((res) => {
        setUser({
          avatar: null,
          id: null,
          isLoggedIn: false,
          login: null,
          username: null,
        });
        navigate('/login');
      });
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
    >
      <AlertDialogOverlay />
      <AlertDialogContent m={'1rem'}>
        <AlertDialogHeader>Delete Account</AlertDialogHeader>
        <AlertDialogBody>
          Are you sure you want to delete your account?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} variant="outline" onClick={onClose} mr="1rem">
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
