export const getAvatarURL = (avatar: string | undefined) =>
  avatar ? `http://192.168.0.103:3333/avatars/${avatar}` : undefined;

export const capitalize = (string: string) =>
  string[0].toUpperCase() + string.substring(1);
