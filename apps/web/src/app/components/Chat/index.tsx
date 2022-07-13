import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import { VStack } from '@chakra-ui/layout';

import ChatInput from './ChatInput';
import Header from '../Header';
import Messages from './Messages';

import { FriendsContext } from '../../context/FriendsContext';

export default function Chat(): JSX.Element {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const { user } = useParams();
  const { friends } = useContext(FriendsContext);

  const friend = friends.find((friend) => friend.login === user);

  const bottomDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomDivRef.current?.scrollIntoView({
      block: 'center',
      behavior: 'smooth',
    });
  });

  return (
    <VStack m={0} p={0} h="100vh" align="stretch">
      <Header friend={friend} />
      <Messages
        friend={friend}
        bottomDivRef={bottomDivRef}
        editingMessageId={editingMessageId}
        setEditingMessageId={setEditingMessageId}
      />
      <ChatInput
        chatId={friend?.id}
        isMessageEditing={Boolean(editingMessageId)}
      />
    </VStack>
  );
}
