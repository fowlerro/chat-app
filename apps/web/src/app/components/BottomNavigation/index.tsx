import {
  Divider,
  HStack,
  IconButton,
  TabList,
  Tab,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import {
  MdChatBubble,
  MdEmail,
  MdOutlineSettings,
  MdPerson,
} from 'react-icons/md';

export default function BottomNavigation(): JSX.Element {
  const dividerColor = useColorModeValue('blackAlpha.400', 'whiteAlpha.200');

  return (
    <HStack
      bg="blackAlpha.200"
      shadow="dark-lg"
      justify="space-around"
      p=".5rem"
      as={TabList}
    >
      <Item label="Chats" icon={<MdChatBubble />} />
      <Divider orientation="vertical" borderColor={dividerColor} />
      <Item label="Invites" icon={<MdEmail />} />
      <Divider orientation="vertical" borderColor={dividerColor} />
      <Item label="Profile" icon={<MdPerson />} />
      <Divider orientation="vertical" borderColor={dividerColor} />
      <Item label="Settings" icon={<MdOutlineSettings />} />
    </HStack>
  );
}

interface ItemProps {
  label: string;
  icon: ReactNode;
}

export function Item({ label, icon }: ItemProps) {
  const selectedBackground = useColorModeValue(
    'blackAlpha.300',
    'whiteAlpha.200'
  );

  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="lg"
      as={Tab}
      flex="1"
      _selected={{
        bg: selectedBackground,
        color: 'cyan.400',
      }}
    >
      {icon}
    </IconButton>
  );
}
