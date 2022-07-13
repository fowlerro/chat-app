import { useState } from 'react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
} from '@chakra-ui/react';

import Input from '../Input';
import axios from '../../utils/axios';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Errors {
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
}: ChangePasswordModalProps): JSX.Element {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const handleChangePassword = () => {
    setErrors({});
    let errors: Errors = {};
    setLoading(true);
    if (!newPassword) errors.password = 'Field is required!';
    if (!confirmNewPassword) errors.confirmPassword = 'Field is required!';
    if (newPassword !== confirmNewPassword)
      errors.confirmPassword = 'Passwords must be the same!';

    if (Object.keys(errors).length) {
      setErrors(errors);
      setLoading(false);
      return;
    }

    axios
      .put(
        '/auth/change-password',
        {
          newPassword,
          confirmNewPassword,
        },
        { withCredentials: true }
      )
      .catch((err) => {
        setErrors(
          err.response.data ?? { form: 'An error occurred, please try again' }
        );
        setLoading(false);
      })
      .then((res) => {
        setLoading(false);
        onClose();
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent m={'1rem'} minWidth="200px">
        <ModalHeader>Change password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="New password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{
              mb: '1rem',
            }}
            isRequired
            errorText={errors.password}
          />
          <Input
            placeholder="Confirm new password"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            isRequired
            errorText={errors.confirmPassword}
          />
          {errors.form && <Text color="red">{errors.form}</Text>}
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={loading}
            variant="outline"
            size="sm"
            mr=".5rem"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            isLoading={loading}
            colorScheme="teal"
            size="sm"
            onClick={handleChangePassword}
          >
            Submit!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
