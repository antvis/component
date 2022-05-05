import { AxisSubTickLineCfg, Point, TickDatum } from './types';
import { getArcTickPoints, getTickPoints } from './axisTick';

type AxisSubTickOptions = AxisSubTickLineCfg & {
  /** End Points of axes. */
  endPoints: Point[];
  /** Orient of axis */
  orient: 'top' | 'bottom' | 'left' | 'right';
  /** Ticks value. */
  ticks: TickDatum[];

  axisType?: string;

  // For arc axis.
  center?: Point;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
};

export function getAxisSubTicks(options: AxisSubTickOptions) {
  const {
    ticks,
    orient,
    endPoints,
    len: subTickLength = 0,
    count: subTickCount = 0,
    axisType,
    center = [0, 0],
    radius = 0,
    startAngle = 0,
    endAngle = 0,
    style,
  } = options;

  return subTickCount <= 0
    ? []
    : Array.from(ticks)
        .map((datum: any, idx) => {
          if (axisType !== 'arc' && idx === ticks.length - 1) {
            return [];
          }

          return Array(subTickCount)
            .fill(null)
            .map((d: any, subIdx) => {
              let [[x, y], [x2, y2]] = [
                [0, 0],
                [0, 0],
              ];
              const step = ((ticks[idx + 1]?.value || 1) - datum.value) / (subTickCount + 1);
              const value = datum.value + step * (subIdx + 1);
              if (axisType === 'arc') {
                const tickAngle = (endAngle - startAngle) * value + startAngle;
                [[x, y], [x2, y2]] = getArcTickPoints(center, radius, tickAngle, orient, subTickLength);
              } else {
                [[x, y], [x2, y2]] = getTickPoints(endPoints, value, orient, subTickLength);
              }
              return {
                visibility: 'visible' as any,
                ...style,
                id: `sub-${datum.id}-${subIdx}`,
                x1: x,
                y1: y,
                x2,
                y2,
              };
            });
        })
        .flat();
}
