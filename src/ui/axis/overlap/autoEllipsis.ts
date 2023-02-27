import type { DisplayObject } from '@antv/g';
import { isNil } from '@antv/util';
import type { Text } from '../../text';
import { getFont, parseLength } from '../../../util';
import { AxisStyleProps, EllipsisOverlapCfg } from '../types';
import { boundTest } from '../utils/helper';

export type Utils = {
  ellipsis: (text: Text, len?: number, suffix?: string) => void;
  getTextShape: (el: DisplayObject) => Text;
};

export default function ellipseLabels(
  labels: DisplayObject[],
  overlapCfg: EllipsisOverlapCfg,
  cfg: AxisStyleProps,
  utils: Utils
) {
  if (labels.length <= 1) return;
  const { suffix = '...', minLength, maxLength, step: ellipsisStep, margin = [0, 0, 0, 0] } = overlapCfg;

  const font = getFont(utils.getTextShape(labels[0]));
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
    source.forEach((label) => {
      utils.ellipsis(utils.getTextShape(label), allowedLength, suffix);
    });

    source = boundTest(labels, margin);
    // 碰撞检测
    if (source.length < 1) return;
    // layout time exceeded;
    if (Date.now() - now > timeout) return;
  }
}
