import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  IconButton,
  Input as ChakraInput,
  InputGroup,
  InputProps as ChakraInputProps,
  InputRightElement,
} from '@chakra-ui/react';
import { useState } from 'react';

import { IoEye, IoEyeOff } from 'react-icons/io5';

type InputProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
} & ChakraInputProps;

export default function Input({
  label,
  helperText,
  errorText,
  id,
  sx,
  ...inputProps
}: InputProps): JSX.Element {
  if (inputProps.type === 'password')
    return (
      <PasswordInput
        label={label}
        helperText={helperText}
        errorText={errorText}
        id={id}
        sx={sx}
        {...inputProps}
      />
    );

  return (
    <FormControl isInvalid={Boolean(errorText)} sx={sx}>
      {label && (
        <FormLabel htmlFor={id} mb={0}>
          {label}
        </FormLabel>
      )}
      <ChakraInput id={id} {...inputProps} />
      {errorText ? (
        <FormErrorMessage>{errorText}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}

function PasswordInput({
  label,
  helperText,
  errorText,
  id,
  sx,
  ...inputProps
}: InputProps) {
  const [show, setShow] = useState(false);

  return (
    <FormControl isInvalid={Boolean(errorText)} sx={sx}>
      {label && (
        <FormLabel htmlFor={id} mb={0}>
          {label}
        </FormLabel>
      )}
      <InputGroup>
        <ChakraInput
          id={id}
          {...inputProps}
          type={show ? 'text' : 'password'}
        />
        <InputRightElement>
          <IconButton
            variant="ghost"
            aria-label={show ? 'Hide password' : 'Show password'}
            onClick={() => setShow(!show)}
          >
            {show ? <IoEyeOff /> : <IoEye />}
          </IconButton>
        </InputRightElement>
      </InputGroup>
      {errorText ? (
        <FormErrorMessage>{errorText}</FormErrorMessage>
      ) : (
        helperText && <FormHelperText>{helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
