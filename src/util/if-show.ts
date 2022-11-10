import { Selection } from './selection';

export function ifShow(
  show: boolean,
  container: Selection,
  creator: (group: Selection) => void,
  removeChildren?: boolean
) {
  if (show) {
    creator(container);
  } else if (removeChildren) container.node().removeChildren();
}
