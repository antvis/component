import { Text } from '../ui/text';
import type { Selection } from './selection';

export function ellipsisIt(el: Text | Selection<Text>, w: number, suffix = '...') {
  const node = el instanceof Text ? el : (el.node() as Text);
  if (node.nodeName === 'text') {
    const cfg = { wordWrap: true, wordWrapWidth: w, maxLines: 1, textOverflow: suffix };
    node.attr(cfg);
  }
}
