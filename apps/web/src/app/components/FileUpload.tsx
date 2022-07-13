import { HTMLAttributes, ReactNode, useRef } from 'react';

import { InputGroup } from '@chakra-ui/react';

type FileUploadProps = {
  accept?: string;
  multiple?: boolean;
  children?: ReactNode;
} & HTMLAttributes<HTMLInputElement>;

const FileUpload = ({
  accept,
  multiple,
  children,
  ...inputProps
}: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => inputRef.current?.click();

  return (
    <InputGroup onClick={handleClick}>
      <input
        type={'file'}
        multiple={multiple || false}
        hidden
        accept={accept}
        {...inputProps}
        ref={inputRef}
      />
      {children}
    </InputGroup>
  );
};

export default FileUpload;
