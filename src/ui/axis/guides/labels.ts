import type { IAnimation } from '@antv/g';
import { get, isFunction } from '@antv/util';
import type { StandardAnimationOption } from '../../../animation';
import { fadeOut, onAnimateFinished, onAnimatesFinished, transition, transitionShape } from '../../../animation';
import type { DisplayObject, TextStyleProps } from '../../../shapes';
import { Text } from '../../../shapes';
import type { Vector2 } from '../../../types';
import type { Selection, _Element } from '../../../util';
import {
  add,
  defined,
  ellipsisIt,
  getCallbackValue,
  hide,
  inRange,
  percentTransform,
  radToDeg,
  renderExtDo,
  scale,
  select,
  show,
  splitStyle,
  subStyleProps,
  wrapIt,
} from '../../../util';
import { CLASS_NAMES } from '../constant';
import { processOverlap } from '../overlap';
import type { AxisDatum, AxisLabelStyleProps, AxisStyleProps } from '../types';
import { getFactor } from '../utils';
import { getValuePos } from './line';
import { filterExec, getCallbackStyle, getLabelVector, getLineTangentVector } from './utils';

function angleNormalizer(angle: number) {
  let normalizedAngle = angle;
  while (normalizedAngle < 0) normalizedAngle += 360;
  return Math.round(normalizedAngle % 360);
}

function getAngle(v1: Vector2, v2: Vector2) {
  const [x1, y1] = v1;
  const [x2, y2] = v2;
  const [dot, det] = [x1 * x2 + y1 * y2, x1 * y2 - y1 * x2];
  return Math.atan2(det, dot);
}

/** to correct label rotation to avoid inverted character */
function correctLabelRotation(_rotate: number) {
  let rotate = (_rotate + 360) % 180;
  if (!inRange(rotate, -90, 90)) rotate += 180;
  return rotate;
}

/** get rotation from preset or layout */
function getLabelRotation(datum: AxisDatum, label: DisplayObject, attr: Required<AxisStyleProps>) {
  const { labelAlign } = attr;
  // if label rotate is set, use it
  const customRotate = label.style.transform?.includes('rotate');
  if (customRotate) return label.getLocalEulerAngles();
  let rotate = 0;
  const labelVector = getLabelVector(datum.value, attr);
  const tangentVector = getLineTangentVector(datum.value, attr);
  if (labelAlign === 'horizontal') return 0;
  if (labelAlign === 'perpendicular') rotate = getAngle([1, 0], labelVector);
  else rotate = getAngle([tangentVector[0] < 0 ? -1 : 1, 0], tangentVector);
  return correctLabelRotation(radToDeg(rotate));
}

/** get the label align according to its tick and label angle  */
function getLabelStyle(
  value: number,
  rotate: number,
  attr: Required<AxisStyleProps>
): Pick<TextStyleProps, 'textAlign' | 'textBaseline'> {
  const { type, labelAlign } = attr;
  const labelVector = getLabelVector(value, attr);
  const labelAngle = angleNormalizer(rotate);
  const tickAngle = angleNormalizer(radToDeg(getAngle([1, 0], labelVector)));

  let textAlign: TextStyleProps['textAlign'] = 'center';
  let textBaseline: TextStyleProps['textBaseline'] = 'middle';
  if (type === 'linear') {
    // tick 和 label 均为水平或垂直时，做快速判断
    if ([90, 270].includes(tickAngle) && labelAngle === 0) {
      textAlign = 'center';
      textBaseline = labelVector[1] === 1 ? 'top' : 'bottom';
    } else if (!(tickAngle % 180) && [90, 270].includes(labelAngle)) {
      textAlign = 'center';
    }
    // 根据 tick 和 label 的角度，判断 label 的对齐方式
    else if (tickAngle === 0) {
      if (inRange(labelAngle, 0, 90, false, true)) {
        textAlign = 'start';
      } else if (inRange(labelAngle, 0, 90) || inRange(labelAngle, 270, 360)) {
        textAlign = 'start';
      }
    } else if (tickAngle === 90) {
      if (inRange(labelAngle, 0, 90, false, true)) {
        textAlign = 'start';
      } else if (inRange(labelAngle, 90, 180) || inRange(labelAngle, 270, 360)) {
        textAlign = 'end';
      }
    } else if (tickAngle === 270) {
      if (inRange(labelAngle, 0, 90, false, true)) {
        textAlign = 'end';
      } else if (inRange(labelAngle, 90, 180) || inRange(labelAngle, 270, 360)) {
        textAlign = 'start';
      }
    } else if (tickAngle === 180) {
      if (labelAngle === 90) {
        textAlign = 'start';
      } else if (inRange(labelAngle, 0, 90) || inRange(labelAngle, 270, 360)) {
        textAlign = 'end';
      }
    }
    /**
     * todo tick 倾斜时的判断逻辑，该情况下坐标轴非垂直或水平
     */
  } else {
    // 弧线坐标轴 label 的对齐方式判断逻辑
    if (labelAlign === 'parallel') {
      if (inRange(tickAngle, 0, 180, true)) {
        textBaseline = 'top';
      } else {
        textBaseline = 'bottom';
      }
    } else if (labelAlign === 'horizontal') {
      if (inRange(tickAngle, 90, 270, false)) {
        textAlign = 'end';
      } else if (inRange(tickAngle, 270, 360, false) || inRange(tickAngle, 0, 90)) {
        textAlign = 'start';
      }
    } else if (labelAlign === 'perpendicular') {
      if (inRange(tickAngle, 90, 270)) {
        textAlign = 'end';
      } else {
        textAlign = 'start';
      }
    }
  }
  return { textAlign, textBaseline };
}

function setRotateAndAdjustLabelAlign(rotate: number, group: _Element, attr: Required<AxisStyleProps>) {
  group.setLocalEulerAngles(rotate);
  const { value } = group.__data__;
  const textStyle = getLabelStyle(value, rotate, attr);
  const label = group.querySelector<DisplayObject>(CLASS_NAMES.labelItem.class);
  if (label) applyTextStyle(label, textStyle);
}

function getLabelPos(datum: AxisDatum, data: AxisDatum[], attr: Required<AxisStyleProps>) {
  const { showTick, tickLength, tickDirection, labelDirection, labelSpacing } = attr;
  const index = data.indexOf(datum);
  const finalLabelSpacing = getCallbackValue<number>(labelSpacing, [datum, index, data]);
  const [labelVector, unionFactor] = [getLabelVector(datum.value, attr), getFactor(labelDirection!, tickDirection!)];
  const extraLength = unionFactor === 1 ? getCallbackValue<number>(showTick ? tickLength : 0, [datum, index, data]) : 0;
  const [x, y] = add(scale(labelVector, finalLabelSpacing + extraLength), getValuePos(datum.value, attr));
  return { x, y };
}

function formatter(datum: AxisDatum, index: number, data: AxisDatum[], attr: Required<AxisStyleProps>) {
  const { labelFormatter } = attr;
  const element = isFunction(labelFormatter)
    ? () => renderExtDo(getCallbackValue(labelFormatter, [datum, index, data, getLabelVector(datum.value, attr)]))
    : () => renderExtDo(datum.label || '');
  return element;
}

function applyTextStyle(node: DisplayObject, style: Partial<TextStyleProps>) {
  if (node.nodeName === 'text') node.attr(style);
}

function overlapHandler(attr: Required<AxisStyleProps>) {
  processOverlap(this.node().childNodes as DisplayObject[], attr, {
    hide,
    show,
    rotate: (label, angle) => {
      setRotateAndAdjustLabelAlign(+angle, label, attr);
    },
    ellipsis: (label, len, suffix) => {
      label && ellipsisIt(label, len || Infinity, suffix);
    },
    wrap: (label, width, lines) => {
      label && wrapIt(label, width, lines);
    },
    getTextShape: (label) => label.querySelector<DisplayObject>('text') as Text,
  });
}

function renderLabel(container: DisplayObject, datum: any, data: any[], style: any, attr: Required<AxisStyleProps>) {
  const index = data.indexOf(datum);
  const label = select(container)
    .append(formatter(datum, index, data, attr))
    .attr('className', CLASS_NAMES.labelItem.name)
    .node();
  const [labelStyle, { transform, ...groupStyle }] = splitStyle(getCallbackStyle(style, [datum, index, data]));
  percentTransform(container, transform);

  const rotate = getLabelRotation(datum, container, attr);
  container.setLocalEulerAngles(+rotate);

  applyTextStyle(label, {
    ...getLabelStyle(datum.value, rotate, attr),
    ...labelStyle,
  });
  // todo G transform 存在问题，需要二次设置
  percentTransform(container, transform);
  container.attr(groupStyle);
  return label;
}

export function renderLabels(
  container: Selection,
  data: AxisDatum[],
  attr: Required<AxisStyleProps>,
  animate: StandardAnimationOption
) {
  const finalData = filterExec(data, attr.labelFilter);
  const style = subStyleProps<AxisLabelStyleProps>(attr, 'label');
  return container
    .selectAll(CLASS_NAMES.label.class)
    .data(finalData, (d, i) => i)
    .join(
      (enter) =>
        enter
          .append('g')
          .attr('className', CLASS_NAMES.label.name)
          .transition(function (datum) {
            renderLabel(this, datum, data, style, attr);
            this.attr(getLabelPos(datum, data, attr));
            this.__bbox__ = datum.bbox;
            return null;
          })
          .call(() => overlapHandler.call(container, attr)),
      (update) =>
        update
          .transition(function (datum) {
            const prevLabel = this.querySelector(CLASS_NAMES.labelItem.class);
            const label = renderLabel(this, datum, data, style, attr);
            const shapeAnimation = transitionShape(prevLabel, label, animate.update);
            const animation = transition(this, getLabelPos(datum, data, attr), animate.update);
            this.__bbox__ = datum.bbox;
            return [...shapeAnimation, animation];
          })
          .call((selection) => {
            const transitions = get(selection, '_transitions').flat().filter(defined) as IAnimation[];
            onAnimatesFinished(transitions, () => overlapHandler.call(container, attr));
          }),
      (exit) =>
        exit.transition(function () {
          const animation = fadeOut(this.childNodes[0], animate.exit);
          onAnimateFinished(animation, () => select(this).remove());
          return animation;
        })
    )
    .transitions();
}
