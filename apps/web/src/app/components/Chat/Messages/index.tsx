import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

import { VStack } from '@chakra-ui/react';

import type { Message as MessageType, User } from '@chat-app/api-interfaces';

import Message from './Message';
import MessageContextMenu from './MessageContextMenu';

import { UserContext } from '../../../context/UserContext';
import { MessagesContext } from '../../../context/MessagesContext';

interface MessagesProps {
  friend: User | undefined;
  bottomDivRef: React.RefObject<HTMLDivElement>;
  editingMessageId: string | null;
  setEditingMessageId: Dispatch<SetStateAction<string | null>>;
}

const filterMessages = (
  messages: MessageType[],
  userId: string,
  friendId: string
): MessageType[] =>
  messages
    .filter(
      (message) =>
        (message.receiverId === friendId && message.authorId === userId) ||
        (message.receiverId === userId && message.authorId === friendId)
    )
    .sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );

export default function Messages({
  friend,
  bottomDivRef,
  editingMessageId,
  setEditingMessageId,
}: MessagesProps): JSX.Element {
  const [contextMenuMessageId, setContextMenuMessageId] = useState<
    string | null
  >(null);
  const isContextMenuOpen = Boolean(contextMenuMessageId);
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const { user } = useContext(UserContext);
  const { messages } = useContext(MessagesContext);

  const filteredMessages = friend
    ? filterMessages(messages, user.id as string, friend.id)
    : null;

  return (
    <MessageBox>
      <div ref={bottomDivRef} />
      {filteredMessages &&
        filteredMessages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isSelected={message.id === contextMenuMessageId}
            editingMessageId={editingMessageId}
            onContextMenu={(x, y) => {
              setContextMenuPosition({ x, y });
              setContextMenuMessageId(message.id);
            }}
            onEdit={() => setEditingMessageId(null)}
          />
        ))}
      <MessageContextMenu
        isOpen={isContextMenuOpen}
        messageId={contextMenuMessageId}
        onClose={() => setContextMenuMessageId(null)}
        onEdit={(messageId) => setEditingMessageId(messageId)}
        position={contextMenuPosition}
      />
    </MessageBox>
  );
}

const MessageBox = ({ children }: { children: ReactNode }) => {
  return (
    <VStack
      overflowY="auto"
      align="left"
      pb={0}
      flex="1"
      flexDir={'column-reverse'}
    >
      {children}
    </VStack>
  );
};
