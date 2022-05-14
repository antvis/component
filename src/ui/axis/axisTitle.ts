import { Group } from '@antv/g';
import { noop } from '@antv/util';
import { Bounds } from '../../layout/bounds';
import {
  createTempText,
  getEllipsisText,
  getFont,
  multi,
  defined,
  Selection,
  DegToRad,
  getLocalBBox,
  TEXT_INHERITABLE_PROPS,
} from '../../util';
import { getSign, ifLeft, ifBottom, ifX, ifTop } from './utils';
import { AxisTitleCfg } from './types';

type AxisTitleOptions = AxisTitleCfg & {
  /** Orient of axis */
  orient: 'top' | 'bottom' | 'left' | 'right';
};

const { cos, abs } = Math;

export function getAxisTitleStyle(selection: Selection, options: AxisTitleOptions) {
  const {
    orient = 'bottom',
    titleAnchor = 'end',
    titlePadding = 0,
    maxLength,
    content: text = '',
    rotate: rotation,
    style = {},
  } = options;

  const sign = getSign(orient, -1, 1);
  // eslint-disable-next-line no-nested-ternary
  const anchorExpr = (anchor: string) => (anchor === 'start' ? 0 : anchor === 'end' ? 1 : 0.5);
  // Axis-line and axis-label-group are under the same parent node.
  const axisLineBounds = (() => {
    // [Attention!!!] should use local position. AxisTitle is relative to axisLine and axisLabel in Local Coord System.
    const axisLine = selection.select('.axis-line').node() as Group;
    return new Bounds(getLocalBBox(axisLine));
  })();
  const axisLabelBounds = (() => {
    const box = getLocalBBox(selection.select('.axis-label-group').node());
    if (!box.width || !box.height) return axisLineBounds;
    return new Bounds(box);
  })();

  let x = (options.positionX || 0) + axisLineBounds.left;
  let y = (options.positionY || 0) + axisLineBounds.top;
  if (!defined(options.positionX)) {
    // If x-direction, positionX is determined by `axisLine` and `titleAnchor`,
    // otherwise, positionX is determined by `orient`, `axisLabel` and `titlePadding`(distance between title and label).
    x = ifX(
      orient,
      axisLineBounds.left + anchorExpr(titleAnchor) * axisLineBounds.width!,
      ifLeft(orient, axisLabelBounds.left, axisLabelBounds.right)! + multi(sign, titlePadding)
    )!;
  }

  if (!defined(options.positionY)) {
    // If x-direction, positionY is determined by `orient`, `axisLabel` and `titlePadding`(distance between title and label),
    // otherwise, positionY is determined by `axisLine` and `titleAnchor`.
    y = ifX(
      orient,
      ifBottom(orient, axisLabelBounds.bottom, axisLabelBounds.top)!! + multi(sign, titlePadding),
      axisLineBounds.top + anchorExpr(titleAnchor) * axisLineBounds.height!
    )!;
  }

  const attrs = {
    // TextStyleProps
    x,
    y,
    ...style,
    textBaseline: style.textBaseline || (ifX(orient, ifTop(orient, 'bottom', 'top')!, 'bottom') as any),
    textAlign:
      style.textAlign ||
      (ifLeft(
        orient,
        // eslint-disable-next-line no-nested-ternary
        titleAnchor === 'start' ? 'end' : titleAnchor === 'end' ? 'start' : 'center',
        titleAnchor
      ) as any),
  };

  // Rotation angle of title shape.
  const angle = rotation ?? ifX(orient, 0, multi(sign, 90))!;

  const textNode = createTempText(selection.node(), { ...attrs, text });
  textNode.setLocalEulerAngles(angle!);
  const bbox = getLocalBBox(textNode);
  const font = getFont(textNode as any);
  textNode.remove();

  // Add layout constraints
  let width = maxLength === Infinity || !defined(maxLength) ? 260 : maxLength;

  const ifHorizontalText = (orient: string, angle: number, a: Function, b: Function) =>
    ifX(orient, a, abs(cos(angle)) === 1 ? a() : b());
  // Do not out of bounds. 需要相对坐标.
  // Bounds only support to limit the title width now.
  let bounds: Bounds | undefined;
  if (options.bounds) {
    const { x1, x2 } = options.bounds;
    bounds = new Bounds({ left: x1, right: x2 });
    const left = bounds.defined('left') ? bounds.left : undefined;
    const right = bounds.defined('right') ? bounds.right : undefined;

    if (left !== undefined && bbox.left < left) {
      x = left;
      ifHorizontalText(orient, angle, () => (attrs.textAlign = 'start'), noop);
      if (right !== undefined && x + bbox.width > right) {
        width = right - left;
      }
    } else if (right !== undefined && bbox.right >= right) {
      // If out of left hand side, change `align` to left, and `x` to the `bounds.left`. Make sure it not out-of right hand side.
      x = right;
      ifHorizontalText(orient, angle, () => (attrs.textAlign = 'end'), noop);
      if (left !== undefined && x < left) {
        x = left;
        ifHorizontalText(orient, angle, () => (attrs.textAlign = 'start'), noop);
        width = right - left;
      }
    }

    if (left !== undefined && right !== undefined) {
      const ratio = abs(cos(angle * DegToRad));
      if (ratio > 10e-16) {
        width = (right - left > 0 ? right - left : 0) / ratio;
      }
    }
  }

  const limitLength = defined(width) ? Math.floor(width!) : undefined;
  return {
    ...TEXT_INHERITABLE_PROPS,
    id: 'axis-title',
    orient,
    // [NOTE]: 不可以传入 G 内置使用的变量 anchor
    titleAnchor,
    limitLength,
    tip: text,
    // TextStyleProps
    ...attrs,
    x,
    y,
    angle,
    transform: `rotate(${angle}deg)`,
    text: defined(limitLength) ? getEllipsisText(text, limitLength!, font, '...') : text,
  };
}
