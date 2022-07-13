import { Show } from '@chakra-ui/react';
import HomeViewDesktop from './HomeViewDesktop';
import HomeViewMobile from './HomeViewMobile';

export default function HomeView(): JSX.Element {
  return (
    <>
      <Show below="md">
        <HomeViewMobile />
      </Show>
      <Show above="md">
        <HomeViewDesktop />
      </Show>
    </>
  );
}
