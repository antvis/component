import { parseSeriesAttr } from '../../../util';
import type { Text } from '../../../shapes';
import { isAxisHorizontal } from '../guides/line';
import { AxisStyleProps, LinearAxisStyleProps, WrapOverlapCfg } from '../types';
import { boundTest } from '../utils/test';

export type Utils = {
  wrap: (label: Text, wordWrapWidth: number, maxLines?: number, textBaseline?: string) => void;
};

type WrapType = Parameters<Utils['wrap']>[1];

const DEFAULT_WRAP_WIDTH = 50;

function inferTextBaseline(attr: AxisStyleProps) {
  const { type, labelDirection } = attr;
  if (type === 'linear' && isAxisHorizontal(attr as Required<LinearAxisStyleProps>)) {
    return labelDirection === 'negative' ? 'bottom' : 'top';
  }
  return 'middle';
}

function inferWrapWidth(labels: Text[], margin: WrapOverlapCfg['margin'] = [0]) {
  if (labels.length < 2) {
    return DEFAULT_WRAP_WIDTH;
  }
  const [top, right, bottom, left] = parseSeriesAttr(margin);
  const labelWidth = labels[1].getBBox().x - labels[0].getBBox().x - left - right;
  return labelWidth <= 0 ? DEFAULT_WRAP_WIDTH : labelWidth;
}

export default function wrapLabels(labels: Text[], overlapCfg: WrapOverlapCfg, attr: AxisStyleProps, utils: Utils) {
  const {
    wordWrapWidth = inferWrapWidth(labels, overlapCfg.margin),
    maxLines = 3,
    recoverWhenFailed = true,
    margin = [0, 0, 0, 0],
  } = overlapCfg;

  const defaultLines = labels.map((label) => label.attr('maxLines') || 1);

  const minLines = Math.min(...defaultLines);

  const runAndPassed = () => boundTest(labels, attr, margin).length < 1;

  const textBaseline = inferTextBaseline(attr);

  const setLabelsWrap = (lines: WrapType | WrapType[]) =>
    labels.forEach((label, index) => {
      const maxLines = Array.isArray(lines) ? lines[index] : lines;
      utils.wrap(label, wordWrapWidth, maxLines, textBaseline);
    });

  if (minLines > maxLines) return;

  for (let lines = minLines; lines <= maxLines; lines++) {
    setLabelsWrap(lines);
    if (runAndPassed()) return;
  }

  if (recoverWhenFailed) {
    setLabelsWrap(defaultLines);
  }
}
