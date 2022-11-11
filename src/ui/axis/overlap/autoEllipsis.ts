import type { Text } from '@antv/g';
import { isNil } from '@antv/util';
import { getFont, parseLength } from '../../../util';
import { AxisStyleProps, EllipsisOverlapCfg } from '../types';
import { boundTest } from '../utils/helper';

export type Utils = {
  ellipsis: (text: Text, len?: number, suffix?: string) => void;
};

export default function ellipseLabels(
  labels: Text[],
  overlapCfg: EllipsisOverlapCfg,
  cfg: AxisStyleProps,
  utils: Utils
) {
  if (labels.length <= 1) return;
  const { suffix = '...', minLength, maxLength, step: ellipsisStep, margin = [0, 0, 0, 0] } = overlapCfg;

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
    source.forEach((label) => {
      utils.ellipsis(label, allowedLength, suffix);
    });
  }
}
