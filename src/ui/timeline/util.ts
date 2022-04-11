import { AABB, DisplayObject, Rect } from '@antv/g';
import { TickDatum } from '../axis/types';
import { TimeData } from './types';

export const formatter = (number: number, fractionDigits = 1, suffix = 'x') =>
  `${number.toFixed(fractionDigits)}${suffix}`;

export const createTickData = (data: TimeData[], tickInterval = 1) => {
  const tickData = [];
  for (let i = 0; i < data.length; i += tickInterval) {
    const step = 1 / (data.length - 1);
    tickData.push({
      value: step * i,
      text: data[i].date,
      state: 'default',
      id: String(i),
    } as TickDatum);
  }
  return tickData;
};

export function drawBB(shape: DisplayObject | undefined, stroke = 'black', context: any) {
  if (!shape) return;
  const bounding = shape.getBounds() as AABB;
  const { center, halfExtents } = bounding;
  const bounds = new Rect({
    style: {
      stroke,
      lineWidth: 2,
      width: halfExtents[0] * 2,
      height: halfExtents[1] * 2,
    },
  });
  context.appendChild(bounds);
  bounds.setPosition(center[0] - halfExtents[0], center[1] - halfExtents[1]);
}
