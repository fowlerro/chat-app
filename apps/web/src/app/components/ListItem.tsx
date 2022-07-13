import {
  ComponentWithAs,
  HStack,
  StackProps,
  useColorModeValue,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

type ListItemProps = {
  children: ReactNode;
  notification?: boolean;
} & StackProps;

const ListItem: ComponentWithAs<'div', ListItemProps> = ({
  children,
  notification = false,
  ...rest
}) => {
  const boxBackground = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const hoverBackground = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <HStack
      justifyContent="flex-start"
      bg={boxBackground}
      transition=".2s background-color"
      _hover={{
        bg: hoverBackground,
      }}
      borderRadius="lg"
      p=".25rem .5rem"
      shadow="md"
      {...rest}
    >
      {children}
    </HStack>
  );
};

export default ListItem;
