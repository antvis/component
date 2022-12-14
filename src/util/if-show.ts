import { DisplayObject } from '@antv/g';
import { Selection } from './selection';

export function ifShow<T extends Selection | HTMLElement | DisplayObject = Selection>(
  show: boolean,
  container: T,
  creator: (group: T) => void,
  removeChildren: boolean = true,
  removeHandler: (group: T) => void = (g) => {
    if (g instanceof Selection) g.node().removeChildren();
    else if (g instanceof DisplayObject) g.removeChildren();
    else if (g instanceof HTMLElement) g.innerHTML = '';
  }
) {
  if (show) {
    creator(container);
  } else if (removeChildren) removeHandler(container);
}
