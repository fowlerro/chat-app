import { Alert, AlertDescription, Button, ButtonGroup } from '@chakra-ui/react';

interface UnsavedAlertProps {
  onReset: () => void;
  onSubmit: () => void;
}

export default function UnsavedAlert({
  onReset,
  onSubmit,
}: UnsavedAlertProps): JSX.Element {
  return (
    <Alert
      status="info"
      variant={'left-accent'}
      minWidth="200px !important"
      width="auto"
      m="1rem"
      mb="4rem"
      rounded="md"
      display="flex"
      flexDir="column"
    >
      <AlertDescription>You have unsaved changes.</AlertDescription>
      <ButtonGroup>
        <Button variant="ghost" size="sm" onClick={onReset}>
          Reset
        </Button>
        <Button colorScheme="green" size="sm" onClick={onSubmit}>
          Save
        </Button>
      </ButtonGroup>
    </Alert>
  );
}
