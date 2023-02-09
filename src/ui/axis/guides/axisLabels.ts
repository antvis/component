import type { DisplayObject, Text } from '@antv/g';
import { vec2 } from '@antv/matrix-util';
import { get, isFunction, memoize } from '@antv/util';
import { fadeOut } from '../../../animation';
import type { GenericAnimation, StandardAnimationOption } from '../../../animation/types';
import type { Vector2 } from '../../../types';
import {
  ellipsisIt,
  getCallbackValue,
  getTransform,
  inRange,
  percentTransform,
  radToDeg,
  renderExtDo,
  select,
  styleSeparator,
  transition,
  type Selection,
  type _Element,
} from '../../../util';
import { CLASS_NAMES } from '../constant';
import { processOverlap } from '../overlap';
import type { AxisDatum, AxisStyleProps } from '../types';
import { getFactor } from '../utils';
import { getDirectionVector, getLineTangentVector, getValuePos } from './axisLine';
import { filterExec, getCallbackStyle } from './utils';

const angleNormalizer = (angle: number) => {
  let normalizedAngle = angle;
  while (normalizedAngle < 0) normalizedAngle += 360;
  return normalizedAngle % 360;
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
  const label = group.querySelector<DisplayObject>(CLASS_NAMES.labelItem.class);
  label?.nodeName === 'text' && select(label).style('textAlign', textAlign);
}

function getLabelPos(datum: AxisDatum, index: number, data: AxisDatum[], cfg: AxisStyleProps) {
  const { showTick, tickLength, tickDirection, labelDirection, labelSpacing } = cfg;
  const finalLabelSpacing = getCallbackValue<number>(labelSpacing, [datum, index, data]);
  const [labelVector, unionFactor] = [getLabelVector(datum.value, cfg), getFactor(labelDirection!, tickDirection!)];
  const extraLength = unionFactor === 1 ? getCallbackValue<number>(showTick ? tickLength : 0, [datum, index, data]) : 0;
  const [x, y] = vec2.add(
    [0, 0],
    vec2.scale([0, 0], labelVector, finalLabelSpacing + extraLength),
    getValuePos(datum.value, cfg)
  );
  return { x, y };
}

function formatter(datum: AxisDatum, index: number, data: AxisDatum[], cfg: AxisStyleProps) {
  const { labelFormatter } = cfg;
  const el = isFunction(labelFormatter)
    ? () => renderExtDo(getCallbackValue(labelFormatter, [datum, index, data, getLabelVector(datum.value, cfg)]))
    : () => renderExtDo(datum.label || '');

  return el;
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
    ellipsis: (label, len = Infinity, suffix) => {
      label && ellipsisIt(label, len, suffix);
    },
    getTextShape: (label) => label.querySelector<DisplayObject>('text') as Text,
  });
}

function createLabel(
  datum: AxisDatum,
  index: number,
  data: AxisDatum[],
  cfg: AxisStyleProps,
  style: any,
  animate: GenericAnimation
) {
  // 1. set style
  // 2. set position
  // 3. set rotation
  // 4. set label align
  const label = select(this).append(datum.element).attr('className', CLASS_NAMES.labelItem.name).node();
  const [labelStyle, { transform, ...groupStyle }] = styleSeparator(getCallbackStyle(style, [datum, index, data]));
  label?.nodeName === 'text' &&
    label.attr({
      fontSize: 12,
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
      textAlign: 'center',
      textBaseline: 'middle',
      ...labelStyle,
    });
  this.attr(groupStyle);
  const animation = transition(this, getLabelPos(datum, index, data, cfg), animate);

  const layout = () => {
    percentTransform(this, transform);
    const rotate = getLabelRotation(datum, this, cfg);
    setRotateAndAdjustLabelAlign(rotate, this, cfg);
  };

  if (animation) {
    animation.finished.then(layout);
  } else layout();
  return animation;
}

function createLabels(
  container: Selection,
  element: Selection,
  data: any[],
  cfg: AxisStyleProps,
  style: any,
  animate: GenericAnimation
) {
  const elements = get(element, '_elements') as _Element[];
  if (elements.length === 0) return null;
  const transitions = get(element, '_transitions');
  const animations = elements.map((el: any) => createLabel.call(el, el.__data__, 0, data, cfg, style, animate));

  animations.forEach((a, i) => (transitions[i] = a));
  // to avoid async manipulations
  if (animations.filter((a) => !!a).length === 0) overlapHandler.call(container, cfg);
  else {
    Promise.all(animations).then(() => {
      overlapHandler.call(container, cfg);
    });
  }
  return animations;
}

export function renderLabels(
  container: Selection,
  data: AxisDatum[],
  cfg: AxisStyleProps,
  style: any,
  animate: StandardAnimationOption
) {
  const finalData = filterExec(data, cfg.labelFilter).map((datum, index, arr) => ({
    element: formatter(datum, index, arr, cfg),
    ...datum,
  }));

  return container
    .selectAll(CLASS_NAMES.label.class)
    .data(finalData, (d) => `${d.value}-${d.label}`)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', CLASS_NAMES.label.name)
          .call((element) => {
            createLabels(container, element, finalData, cfg, style, false);
          }),
      (update) =>
        update
          .each(async function () {
            select(this).node().removeChildren();
          })
          .call((element) => {
            createLabels(container, element, finalData, cfg, style, animate.update);
          }),
      (exit) =>
        exit.transition(function (datum: AxisDatum) {
          const animation = fadeOut(this, animate.exit);
          animation?.finished.then(() => {
            select(this).remove();
          });
          return animation;
        })
    )
    .transitions();
}
