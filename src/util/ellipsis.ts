import type { Selection } from './selection';
import { applyStyle } from './selection';

export function ellipsisIt(el: Selection, w: number) {
  const node = el.node();

  if (node.nodeName === 'text') {
    const cfg = { wordWrap: true, wordWrapWidth: w, maxLines: 1, textOverflow: '...' };
    el.call(applyStyle, cfg);
  }
}
