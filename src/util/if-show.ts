import { DisplayObject } from '@antv/g';
import { Selection } from './selection';

export function ifShow<T extends Selection | HTMLElement | DisplayObject = Selection, R = any>(
  show: boolean,
  container: T,
  creator: (group: T) => R,
  removeChildren: boolean = true,
  removeHandler: (group: T) => any = (g) => {
    if (g instanceof Selection) g.node().removeChildren();
    else if (g instanceof DisplayObject) g.removeChildren();
    else if (g instanceof HTMLElement) g.innerHTML = '';
  }
): null | R {
  if (show) {
    return creator(container);
  }
  if (removeChildren) removeHandler(container);
  return null;
}
