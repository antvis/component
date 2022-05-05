import { Text } from '@antv/g';
import { isNil } from '@antv/util';
import { getEllipsisText, getFont, parseLength } from '../../../util';
import { AxisTextStyleProps } from '../types';
import { ifX, boundTest } from '../utils';
import { getNumberSimplifyStrategy } from './autoEllipsisNumber';
import { getTimeSimplifyStrategy } from './autoEllipsisTime';

function ellipseLabels(orient: string, labels: Text[], cfg?: any) {
  if (labels.length <= 1) return;

  const { ellipsisStep, minLength, maxLength, margin = [], labelType } = cfg;
  const font = getFont(labels[0] as Text);
  const step = parseLength(ellipsisStep!, font) || 1;
  const min = parseLength(minLength!, font) || 1;
  let max = parseLength(maxLength!, font);

  // Enable to ellipsis label when overlap.
  if (isNil(max) || max === Infinity) {
    max = Math.max.apply(
      null,
      labels.map((d) => d.getBBox().width)
    );
  }

  // Generally, 100 ticks cost less than 300ms. If cost time exceed, means ticks count is too large to see.
  const timeout = 300;
  const now = Date.now();

  let source = labels.slice();
  const [top = 0, right = 0, bottom = top, left = right] = margin as number[];
  for (let allowedLength = max; allowedLength > min + step; allowedLength -= step) {
    source = boundTest(labels, margin);

    // 碰撞检测
    if (source.length < 1) return;
    // layout time exceeded;
    if (Date.now() - now > timeout) return;

    let ellipsisStrategy = (text: string, label: Text) => '';
    // [todo] y-direction.
    const width = ifX(orient, allowedLength - left - right, allowedLength);
    if (labelType === 'time') {
      ellipsisStrategy = getTimeSimplifyStrategy(labels, width);
    } else if (labelType === 'number') {
      ellipsisStrategy = getNumberSimplifyStrategy(labels, width);
    } else {
      // Apply ellipsis to the labels overlaps.
      ellipsisStrategy = (text: string) => getEllipsisText(text, allowedLength, font);
    }
    source.forEach((label, idx) => {
      const tip = (label.style as AxisTextStyleProps).tip || label.style.text;
      (label.style as AxisTextStyleProps).tip = tip;
      const text = ellipsisStrategy.call(null, tip, label);
      label.attr('text', text);
    });
  }
}

// [todo] Support head-ellipsis, or mid-ellipsis later.
export default {
  getDefault: () => ellipseLabels,
  ellipsis: ellipseLabels,
};
