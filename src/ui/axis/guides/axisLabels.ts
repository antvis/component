import type { DisplayObject, Group } from '@antv/g';
import { vec2 } from '@antv/matrix-util';
import { isFunction, isString, memoize } from '@antv/util';
import type { Vector2 } from '../../../types';
import type { Selection, _Element } from '../../../util';
import {
  applyStyle,
  getCallbackValue,
  getTransform,
  inRange,
  radToDeg,
  renderExtDo,
  select,
  styleSeparator,
  percentTransform,
} from '../../../util';
import { CLASS_NAMES } from '../constant';
import { processOverlap } from '../overlap';
import type { AxisDatum, AxisStyleProps } from '../types';
import { getFactor } from '../utils';
import { getDirectionVector, getLineTangentVector, getValuePos } from './axisLine';
import { filterExec, getCallbackStyle } from './utils';

const angleNormalizer = (_angle: number) => {
  let angle = _angle;
  while (angle < 0) angle += 360;
  return angle % 360;
};

const getAngle = memoize(
  (v1: Vector2, v2: Vector2) => {
    const [x1, y1] = v1;
    const [x2, y2] = v2;
    const [dot, det] = [x1 * x2 + y1 * y2, x1 * y2 - y1 * x2];
    return Math.atan2(det, dot);
  },
  (v1, v2) => [...v1, ...v2].join()
);

function getLabelVector(value: number, cfg: AxisStyleProps) {
  return getDirectionVector(value, cfg.labelDirection!, cfg);
}

/** to correct label rotation to avoid inverted character */
function correctLabelRotation(_rotate: number) {
  let rotate = (_rotate + 360) % 180;
  if (!inRange(rotate, -90, 90)) rotate += 180;
  return rotate;
}

/** get rotation from preset or layout */
function getLabelRotation(datum: AxisDatum, label: DisplayObject, cfg: AxisStyleProps) {
  const { labelAlign } = cfg;
  const customRotate = getTransform(label, 'rotate');
  if (customRotate) return +customRotate % 180;
  let rotate = 0;
  const labelVector = getLabelVector(datum.value, cfg);
  const tangentVector = getLineTangentVector(datum.value, cfg);
  if (labelAlign === 'horizontal') return 0;
  if (labelAlign === 'perpendicular') rotate = getAngle([1, 0], labelVector);
  else rotate = getAngle([tangentVector[0] < 0 ? -1 : 1, 0], tangentVector);
  return correctLabelRotation(radToDeg(rotate));
}

/** get the label align according to its tick and label angle  */
function getLabelAlign(value: number, rotate: number, cfg: AxisStyleProps) {
  const { type, labelAlign } = cfg;
  const labelVector = getLabelVector(value, cfg);
  const labelAngle = angleNormalizer(rotate);
  const tickAngle = angleNormalizer(radToDeg(getAngle([1, 0], labelVector)));

  if ([90, 270].includes(tickAngle) && !labelAngle) return 'middle';
  if (!(tickAngle % 180) && [90, 270].includes(labelAngle)) return 'middle';

  if (type === 'linear') {
    if (tickAngle === 0) {
      if (inRange(labelAngle, 0, 90, false, true)) return 'start';
      if (inRange(labelAngle, 0, 90) || inRange(labelAngle, 270, 360)) return 'start';
    }
    if (tickAngle === 90) {
      if (inRange(labelAngle, 0, 90, false, true)) return 'start';
      if (inRange(labelAngle, 90, 180) || inRange(labelAngle, 270, 360)) return 'end';
    }
    if (tickAngle === 270) {
      if (inRange(labelAngle, 0, 90, false, true)) return 'end';
      if (inRange(labelAngle, 90, 180) || inRange(labelAngle, 270, 360)) return 'start';
    }
    if (tickAngle === 180) {
      if (labelAngle === 90) return 'start';
      if (inRange(labelAngle, 0, 90) || inRange(labelAngle, 270, 360)) return 'end';
    }
  } else {
    if (labelAlign === 'parallel') return 'middle';
    if (inRange(labelAngle, 90, 270)) {
      if (inRange(tickAngle, 90, 270)) return 'start';
      return 'end';
    }
    if (inRange(tickAngle, 90, 270)) return 'end';
    return 'start';
  }
  // TODO 笛卡尔坐标系倾斜状态布局
  return 'start';
  // const align = { '1': 'start', '-1': 'end' };
  // if (labelAlign === 'parallel') return 'middle';
  // if (Math.abs(tickVector[1]) === 1) {
  //   if (labelAlign === 'perpendicular') return tickVector[1] === unionFactor ? 'end' : 'start';
  //   else return 'middle';
  // }
  // if (tickVector[0] > 0) return align[unionFactor];
  // return align[-unionFactor as VerticalFactor];
}

function setRotateAndAdjustLabelAlign(rotate: number, group: _Element, cfg: AxisStyleProps) {
  group.setLocalEulerAngles(+rotate);
  const { value } = group.__data__;
  const textAlign = getLabelAlign(value, rotate, cfg);
  const label = group.querySelector<DisplayObject>('.axis-label-item');
  label?.nodeName === 'text' && select(label).style('textAlign', textAlign);
}

function getLabelPos(datum: AxisDatum, index: number, data: AxisDatum[], cfg: AxisStyleProps) {
  const { showTick, tickLength, tickDirection, labelDirection, labelSpacing } = cfg;
  const _labelSpacing = getCallbackValue<number>(labelSpacing, [datum, index, data]);
  const [labelVector, unionFactor] = [getLabelVector(datum.value, cfg), getFactor(labelDirection!, tickDirection!)];
  const extraLength = unionFactor === 1 ? getCallbackValue<number>(showTick ? tickLength : 0, [datum, index, data]) : 0;
  const [x, y] = vec2.add(
    [0, 0],
    vec2.scale([0, 0], labelVector, _labelSpacing + extraLength),
    getValuePos(datum.value, cfg)
  );
  return { x, y };
}

function createLabelEl(container: Selection, datum: AxisDatum, index: number, data: AxisDatum[], cfg: AxisStyleProps) {
  const { labelFormatter: formatter } = cfg;
  const labelVector = getLabelVector(datum.value, cfg);
  let el: any = () => renderExtDo(datum.label || '');
  if (isString(formatter)) el = () => renderExtDo(formatter);
  else if (isFunction(formatter))
    el = () => renderExtDo(getCallbackValue(formatter, [datum, index, data, labelVector]));

  return container.append(el).attr('className', CLASS_NAMES.labelItem.name);
}

function applyLabelStyle(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  group: Group,
  cfg: AxisStyleProps,
  style: any
) {
  // 1. set style
  // 2. set position
  // 3. set rotation
  // 4. set label align
  const label = group.getElementsByClassName<DisplayObject>(CLASS_NAMES.labelItem.toString())?.[0];
  const [labelStyle, { transform, ...groupStyle }] = styleSeparator(getCallbackStyle(style, [datum, index, data]));
  label?.nodeName === 'text' &&
    select(label as DisplayObject).call(applyStyle, {
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
      textBaseline: 'middle',
      ...labelStyle,
    });
  group.attr({ ...getLabelPos(datum, index, data, cfg), ...groupStyle });
  percentTransform(group, transform);
  const rotate = getLabelRotation(datum, group, cfg);
  setRotateAndAdjustLabelAlign(rotate, group, cfg);
}

function overlapHandler(cfg: AxisStyleProps) {
  processOverlap(this.node().childNodes as DisplayObject[], cfg, {
    hide: (label) => {
      label.style.visibility = 'hidden';
    },
    show: (label) => {
      label.style.visibility = 'visible';
    },
    rotate: (label, angle) => {
      setRotateAndAdjustLabelAlign(+angle, label, cfg);
    },
    ellipsis: (label, len, suffix) => {
      label
        .querySelector<DisplayObject>('text')
        ?.attr('wordWrap', true)
        .attr('wordWrapWidth', len)
        .attr('maxLines', 1)
        .attr('textOverflow', suffix);
    },
  });
}

export function renderLabels(container: Selection, _data: AxisDatum[], cfg: AxisStyleProps, style: any) {
  const data = filterExec(_data, cfg.labelFilter);
  container
    .selectAll(CLASS_NAMES.label.class)
    .data(data)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', CLASS_NAMES.label.name)
          .each(function (...args) {
            createLabelEl(select(this), ...args, data, cfg);
            applyLabelStyle(...args, data, this, cfg, style);
          })
          .call(() => {
            overlapHandler.call(container, cfg);
          }),
      (update) =>
        update
          .each(function (...args) {
            const group = select(this);
            group.node().removeChildren();
            createLabelEl(group, ...args, data, cfg);
            applyLabelStyle(...args, data, this, cfg, style);
          })
          .call(() => {
            overlapHandler.call(container, cfg);
          }),
      (exit) => exit.remove()
    );
}
