import { ReactElement, ReactNode, useContext, useMemo, useState } from 'react';

import {
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  useBreakpointValue,
  useClipboard,
  useToast,
  ToastPosition,
  useDisclosure,
} from '@chakra-ui/react';

import { MdMode, MdDelete, MdContentCopy } from 'react-icons/md';
import { MessagesContext } from '../../../context/MessagesContext';
import { UserContext } from '../../../context/UserContext';
import DeleteMessageAlert from './DeleteMessageAlert';
import socket from '../../../socket';

export interface MessageContextMenuProps {
  isOpen: boolean;
  messageId: string | null;
  position: {
    x: number;
    y: number;
  };
  onClose: () => void;
  onEdit: (messageId: string) => void;
}

function MessageContextMenu({
  isOpen,
  messageId,
  position,
  onClose,
  onEdit,
}: MessageContextMenuProps) {
  const [messageIdToDelete, setMessageIdToDelete] = useState<string | null>(
    null
  );
  const { user } = useContext(UserContext);
  const { messages } = useContext(MessagesContext);
  const message = messages.find((message) => message.id === messageId);

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const { onCopy } = useClipboard(message ? message.content : '');
  const toast = useToast();

  const background = useColorModeValue('whitesmoke', 'gray.700');
  const shadow = useColorModeValue('2xl', 'lg');

  const toastPosition = useBreakpointValue<ToastPosition>({
    base: 'bottom',
    lg: 'bottom-left',
  });
  const toastMinWidth = useBreakpointValue({
    base: '100px',
    lg: '300px',
  });
  const toastMarginBottom = useBreakpointValue({
    base: '5rem',
    lg: '.5rem',
  });

  const handleCopyMessage = () => {
    onCopy();
    toast({
      title: 'Message copied!',
      duration: 5000,
      status: 'success',
      position: toastPosition,

      containerStyle: {
        marginBottom: toastMarginBottom,
        display: 'block',
        minWidth: toastMinWidth,
      },
    });
  };

  const handleEditMessage = () => {
    if (!message) return;
    if (message.authorId !== user.id) return;
    onEdit(message?.id!);
  };

  const handleDeleteMessage = () => {
    if (!messageIdToDelete) return onAlertClose();
    if (
      messages.find((message) => message.id === messageIdToDelete)?.authorId !==
      user.id
    )
      return onAlertClose();
    onAlertClose();
    socket.emit('deleteMessage', messageIdToDelete);
    setMessageIdToDelete(null);
  };

  return (
    <>
      {isOpen && message ? (
        <Portal>
          <Menu isOpen={isOpen} gutter={0} onClose={onClose}>
            <MenuButton
              aria-hidden={true}
              w={1}
              h={1}
              style={{
                position: 'absolute',
                left: position.x,
                top: position.y,
                cursor: 'default',
              }}
            />
            <MenuList
              bg={background}
              shadow={shadow}
              border="none"
              borderRadius="base"
            >
              <Item
                icon={<MdContentCopy fontSize={'1.25rem'} />}
                onClick={handleCopyMessage}
              >
                Copy message
              </Item>
              {message.authorId === user.id && (
                <>
                  <Item
                    onClick={handleEditMessage}
                    icon={<MdMode fontSize={'1.25rem'} />}
                  >
                    Edit
                  </Item>
                  <Item
                    icon={<MdDelete fontSize={'1.25rem'} />}
                    error
                    onClick={() => {
                      setMessageIdToDelete(message.id);
                      onAlertOpen();
                    }}
                  >
                    Delete
                  </Item>
                </>
              )}
            </MenuList>
          </Menu>
        </Portal>
      ) : null}
      <DeleteMessageAlert
        isOpen={isAlertOpen}
        onClose={onAlertClose}
        onSubmit={handleDeleteMessage}
      />
    </>
  );
}

interface ItemProps {
  children: ReactNode;
  icon?: ReactElement;
  error?: boolean;
  onClick?: () => void;
}

function Item({
  children,
  icon,
  error = false,
  onClick,
}: ItemProps): JSX.Element {
  const hoverBackground = useColorModeValue('blackAlpha.200', 'blackAlpha.300');
  const errorColor = useColorModeValue('red.600', 'red.500');

  return (
    <MenuItem
      icon={icon}
      onClick={onClick}
      _hover={{
        bg: hoverBackground,
      }}
      color={error ? errorColor : 'none'}
    >
      {children}
    </MenuItem>
  );
}

export default MessageContextMenu;
