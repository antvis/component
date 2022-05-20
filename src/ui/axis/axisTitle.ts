import { multi, TEXT_INHERITABLE_PROPS } from '../../util';
import { getSign, ifX } from './utils';
import { AxisTitleCfg } from './types';

type Bounds = { min: [number, number]; max: [number, number] };

function inferTitleStyle(bounds: Bounds, position: string, titleAnchor: string, titlePadding = 0) {
  const halfExtents = [(bounds.max[0] - bounds.min[0]) / 2, (bounds.max[1] - bounds.min[1]) / 2];
  const yPos: any = { start: bounds.min[1], end: bounds.max[1], center: bounds.min[1] + halfExtents[1] };
  const xPos: any = { start: bounds.min[0], end: bounds.max[0], center: bounds.min[0] + halfExtents[0] };
  if (position === 'left') {
    const align: any = { start: 'end', end: 'start', center: 'center' };
    return {
      x: bounds.min[0] - +titlePadding,
      y: yPos[titleAnchor],
      textAlign: align[titleAnchor],
      textBaseline: 'bottom',
    };
  }
  if (position === 'right') {
    const align: any = { start: 'start', end: 'end', center: 'center' };
    return {
      x: bounds.max[0] + +titlePadding,
      y: yPos[titleAnchor],
      textAlign: align[titleAnchor],
      textBaseline: 'bottom',
    };
  }
  if (position === 'top') {
    return {
      x: xPos[titleAnchor],
      y: bounds.min[1] - +titlePadding,
      textAlign: titleAnchor,
      textBaseline: 'bottom',
    };
  }
  return {
    x: xPos[titleAnchor],
    y: bounds.max[1] + +titlePadding,
    textAlign: titleAnchor,
    textBaseline: 'top',
  };
}

export function getAxisTitleStyle(options: AxisTitleCfg, bounds: Bounds, position: string) {
  const { content = '', rotate, titleAnchor = 'start', titlePadding, style = {} } = options;

  const text = content || '';

  const sign = getSign(position, -1, 1);
  const angle = rotate ?? ifX(position, 0, multi(sign, 90))!;
  const { x, y, textAlign, textBaseline } = inferTitleStyle(bounds, position, titleAnchor, titlePadding);

  return {
    ...TEXT_INHERITABLE_PROPS,
    x,
    y,
    tip: content,
    text,
    transform: `rotate(${angle}deg)`,
    textAlign: textAlign as any,
    textBaseline: textBaseline as any,
    ...style,
  };
}
