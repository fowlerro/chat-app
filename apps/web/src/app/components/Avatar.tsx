import {
  Avatar as ChakraAvatar,
  AvatarBadge,
  AvatarProps as ChakraAvatarProps,
} from '@chakra-ui/react';

type AvatarProps = {
  isOnline?: boolean;
  withBadge?: boolean;
} & ChakraAvatarProps;

export default function Avatar({
  isOnline = false,
  withBadge = false,
  size,
  ...avatarProps
}: AvatarProps): JSX.Element {
  const badgeSize = size === 'sm' ? '.75rem' : '1rem';
  return (
    <ChakraAvatar
      showBorder={false}
      bg="none"
      mr=".5rem"
      size={size}
      {...avatarProps}
    >
      {withBadge && (
        <AvatarBadge
          bg={isOnline ? 'green.700' : 'red.500'}
          boxSize={badgeSize}
        />
      )}
    </ChakraAvatar>
  );
}
