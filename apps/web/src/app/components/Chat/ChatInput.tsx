import { useRef, useState } from 'react';

import TextareaAutosize from 'react-textarea-autosize';
import {
  HStack,
  IconButton,
  Textarea,
  useEventListener,
  useColorModeValue,
} from '@chakra-ui/react';

import socket from '../../socket';
import { MdSend } from 'react-icons/md';

interface ChatInputProps {
  chatId: string | undefined;
  isMessageEditing: boolean;
}

export default function ChatInput({
  chatId,
  isMessageEditing,
}: ChatInputProps): JSX.Element {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!chatId) return;
    if (!message || !message.trim().length) return;
    if (message.trimStart().trimEnd().length > 2000) return;
    socket.emit('sendMessage', chatId, message);
    setMessage('');
  };

  useEventListener('keypress', (e) => {
    if (isMessageEditing) return;
    inputRef.current?.focus();
  });

  const background = useColorModeValue('gray.300', 'gray.700');

  return (
    <HStack w="100%" p={'1rem'}>
      <Textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={'Message...'}
        size="lg"
        autoComplete="off"
        minRows={1}
        maxRows={10}
        resize="none"
        minH="2.5rem"
        variant="filled"
        bgColor={background}
        as={TextareaAutosize}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <IconButton
        aria-label="Send message"
        size="md"
        colorScheme="cyan"
        onClick={handleSubmit}
      >
        <MdSend />
      </IconButton>
    </HStack>
  );
}
