import { useContext, useEffect, useState } from 'react';
import { formatRelative } from 'date-fns';

import TextareaAutosize from 'react-textarea-autosize';
import {
  Text,
  HStack,
  VStack,
  useEditable,
  Textarea,
  Box,
} from '@chakra-ui/react';

import Avatar from '../../Avatar';

import { FriendsContext } from '../../../context/FriendsContext';
import { UserContext } from '../../../context/UserContext';

import type { Message as MessageType } from '@chat-app/api-interfaces';
import socket from '../../../socket';
import { capitalize, getAvatarURL } from '../../../utils/utils';

interface MessageProps {
  message: MessageType;
  isSelected: boolean;
  editingMessageId: string | null;
  onContextMenu: (x: number, y: number) => void;
  onEdit: () => void;
}

export default function Message({
  message,
  isSelected,
  editingMessageId,
  onContextMenu,
  onEdit,
}: MessageProps): JSX.Element {
  const { friends } = useContext(FriendsContext);
  const { user } = useContext(UserContext);

  const [isEditingLoading, setIsEditingLoading] = useState(false);

  const {
    value,
    isValueEmpty,
    getPreviewProps,
    getTextareaProps,
    onEdit: onEditableEdit,
    onSubmit,
    onCancel,
  } = useEditable({
    defaultValue: message.content,
    isPreviewFocusable: false,
    selectAllOnFocus: false,
  });

  useEffect(() => {
    if (message.id !== editingMessageId) return;
    onEditableEdit();
  }, [message.id, editingMessageId]);

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.currentTarget.tagName === 'Textarea') return;
    e.preventDefault();
    onContextMenu(e.pageX, e.pageY);
  };

  const handleEditMessage = () => {
    if (isValueEmpty) return onCancel();
    setIsEditingLoading(true);
    socket.emit('editMessage', message.id, value, ({ error, done }) => {
      if (error) return;
      onSubmit();
      setIsEditingLoading(false);
    });
  };

  const messageAuthor =
    friends.find((friend) => friend.id === message.authorId) || user;

  return (
    <HStack
      bg={isSelected ? 'blackAlpha.200' : 'none'}
      _hover={{
        bg: 'blackAlpha.200',
      }}
      p={'.5rem 1rem'}
      mt={'0 !important'}
      display="flex"
      alignItems={'flex-start'}
      onContextMenu={handleContextMenu}
    >
      <Avatar
        size="sm"
        src={getAvatarURL(messageAuthor.avatar ?? undefined)}
        isOnline={'online' in messageAuthor ? messageAuthor.online : false}
        mt=".25rem"
      />
      <VStack align="flex-start">
        <HStack>
          <Text fontSize="md" fontWeight={'medium'}>
            {messageAuthor?.username}
          </Text>
          <Text fontSize="xs" color={'gray.500'}>
            {capitalize(formatRelative(new Date(message.sentAt), new Date()))}
          </Text>
        </HStack>
        <Box>
          <Text
            {...getPreviewProps()}
            fontSize="sm"
            whiteSpace="pre-wrap"
            overflowWrap={'anywhere'}
          >
            {message.content}
          </Text>
          <Textarea
            {...getTextareaProps()}
            disabled={isEditingLoading}
            minRows={1}
            maxRows={10}
            resize="none"
            minH="2.5rem"
            variant="filled"
            as={TextareaAutosize}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleEditMessage();
                onEdit();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
                onEdit();
              }
            }}
          />
        </Box>
      </VStack>
    </HStack>
  );
}
