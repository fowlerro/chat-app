import { Button, useColorMode, useColorModeValue } from '@chakra-ui/react';

import { MdLightMode, MdDarkMode } from 'react-icons/md';

export default function ThemeSwitcher(): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();
  const background = useColorModeValue('blackAlpha.200', 'whiteAlpha.200');

  return (
    <Button onClick={() => toggleColorMode()} m="1rem" bg={background}>
      {colorMode === 'dark' ? <MdLightMode /> : <MdDarkMode />}
    </Button>
  );
}
