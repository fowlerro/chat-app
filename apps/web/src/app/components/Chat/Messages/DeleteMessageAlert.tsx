import { useRef, useState } from 'react';

import {
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';

interface DeleteMessageAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function DeleteMessageAlert({
  isOpen,
  onClose,
  onSubmit,
}: DeleteMessageAlertProps): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      size="xs"
    >
      <AlertDialogOverlay>
        <AlertDialogContent marginInline="1rem">
          <AlertDialogHeader>Delete message!</AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete that message?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme={'red'} onClick={onSubmit} ml="1rem">
              Delete!
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
