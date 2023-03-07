import { Text } from '../shapes';

export function ellipsisIt(node: Text, w: number, suffix = '...') {
  if (node.nodeName === 'text') {
    const cfg = { wordWrap: true, wordWrapWidth: w, maxLines: 1, textOverflow: suffix };
    node.attr(cfg);
  }
}
