import { useContext, useEffect, useState } from 'react';

import {
  Alert,
  AlertDescription,
  Box,
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  IconButton,
  Text,
  useColorModeValue,
  useEditableControls,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { MdCheck, MdClose, MdEdit } from 'react-icons/md';

import Avatar from '../Avatar';

import { UserContext } from '../../context/UserContext';
import FileUpload from '../FileUpload';
import Input from '../Input';
import UnsavedAlert from './UnsavedAlert';
import axios from '../../utils/axios';
import { getAvatarURL } from '../../utils/utils';
import { User } from '@chat-app/api-interfaces';

export default function Profile(): JSX.Element {
  const { user, setUser } = useContext(UserContext);

  const [username, setUsername] = useState(user.username ?? '');
  const [avatar, setAvatar] = useState<{
    preview: string;
    data: File | undefined;
  }>({
    preview: '',
    data: undefined,
  });

  const toast = useToast();

  useEffect(() => {
    if (
      username !== user.username ||
      (avatar.preview && avatar.preview !== user.avatar)
    ) {
      if (toast.isActive('changeProfileToast'))
        return toast.update('changeProfileToast', {
          render: () => (
            <UnsavedAlert onReset={handleReset} onSubmit={handleSubmit} />
          ),
        });
      toast({
        id: 'changeProfileToast',
        duration: null,

        render: () => (
          <UnsavedAlert onReset={handleReset} onSubmit={handleSubmit} />
        ),
      });
    } else toast.close('changeProfileToast');
  }, [username, avatar.preview]);

  const handleAvatarChange = (e: React.FormEvent<HTMLInputElement>) => {
    setAvatar({
      preview: URL.createObjectURL(e.currentTarget.files?.[0] as Blob),
      data: e.currentTarget.files?.[0],
    });
  };

  const handleReset = () => {
    setUsername(user.username ?? '');
    setAvatar({ preview: '', data: undefined });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('avatar', avatar.data as Blob);
    formData.append('username', username);
    axios
      .put('/users/profile', formData, {
        withCredentials: true,
      })
      .then((res) => {
        if (!res.data) return;

        const updatedUser = res.data as User;

        setUser({
          id: updatedUser.id,
          login: updatedUser.login,
          username: updatedUser.username,
          avatar: updatedUser.avatar ?? null,
          isLoggedIn: true,
        });
        toast.close('changeProfileToast');
      });
  };

  const usernameBackground = useColorModeValue(
    'blackAlpha.100',
    'whiteAlpha.100'
  );

  return (
    <VStack>
      <FileUpload
        accept=".png, .jpg, .jpeg, .gif"
        onChange={handleAvatarChange}
      >
        <Box position="relative" marginInline={'auto'}>
          <MdEdit
            style={{
              position: 'absolute',
              top: 0,
              right: '.5rem',
              zIndex: 2,
              fontSize: '1.25rem',
            }}
          />
          <Avatar
            src={avatar.preview || getAvatarURL(user.avatar ?? undefined)}
            size="lg"
          />
        </Box>
      </FileUpload>
      <Editable
        value={username}
        onChange={(value) => setUsername(value)}
        bg={usernameBackground}
        borderRadius="md"
        isPreviewFocusable={false}
        display="flex"
        justifyContent={'space-between'}
        alignItems="center"
        fontSize="lg"
        fontWeight={'medium'}
        width="100%"
        p=".5rem 1rem"
        shadow="md"
      >
        <EditablePreview />
        <Input as={EditableInput} />
        <EditableControls />
      </Editable>
    </VStack>
  );
}

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  const background = useColorModeValue('blackAlpha.300', 'whiteAlpha.300');

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm" ml="1rem">
      <IconButton
        aria-label="Apply"
        icon={<MdCheck />}
        {...getSubmitButtonProps()}
        colorScheme="cyan"
      />
      <IconButton
        aria-label="Cancel"
        icon={<MdClose />}
        bg={background}
        {...getCancelButtonProps()}
      />
    </ButtonGroup>
  ) : (
    <IconButton
      aria-label="Edit username"
      size="sm"
      icon={<MdEdit />}
      colorScheme={'cyan'}
      {...getEditButtonProps()}
    />
  );
}
