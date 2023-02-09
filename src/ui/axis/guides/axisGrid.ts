import { vec2 } from '@antv/matrix-util';
import { isFunction } from '@antv/util';
import { StandardAnimationOption } from '../../../animation';
import type { Point } from '../../../types';
import { degToRad, getCallbackValue, Selection } from '../../../util';
import { Grid } from '../../grid';
import { CLASS_NAMES } from '../constant';
import type { AxisDatum, AxisStyleProps } from '../types';
import { getDirectionVector, getValuePos } from './axisLine';
import { filterExec } from './utils';

function getGridVector(value: number, cfg: AxisStyleProps) {
  return getDirectionVector(value, cfg.gridDirection!, cfg);
}

function getGridCenter(cfg: AxisStyleProps) {
  const { type, gridCenter } = cfg;
  if (type === 'linear') return gridCenter;
  return gridCenter || cfg.center;
}

function renderStraight(data: AxisDatum[], cfg: AxisStyleProps) {
  const { gridLength = 0 } = cfg;
  return data.map(({ value }) => {
    const [x, y] = getValuePos(value, cfg);
    const [dx, dy] = vec2.scale([0, 0], getGridVector(value, cfg), gridLength);
    return {
      points: [
        [x, y],
        [x + dx, y + dy],
      ],
    };
  });
}

function renderSurround(data: AxisDatum[], cfg: AxisStyleProps, style: any) {
  const { controlAngles } = style;
  const center = getGridCenter(cfg);
  if (!center) throw new Error('grid center is not provide');
  if (data.length < 2) throw new Error('Invalid grid data');
  if (!controlAngles || controlAngles.length === 0) throw new Error('Invalid gridControlAngles');

  const [cx, cy] = center;
  return data.map(({ value }) => {
    const [sx, sy] = getValuePos(value, cfg);
    const [dx, dy] = [sx - cx, sy - cy];
    const points: Point[] = [];
    controlAngles.forEach((angle: number) => {
      const angleInRad = degToRad(angle);
      const [cosa, sina] = [Math.cos(angleInRad), Math.sin(angleInRad)];
      const x = dx * cosa - dy * sina + cx;
      const y = dx * sina + dy * cosa + cy;
      points.push([x, y]);
    });

    return { points };
  });
}

export function renderGrid(
  container: Selection,
  data: AxisDatum[],
  cfg: AxisStyleProps,
  style: any,
  animate: StandardAnimationOption
) {
  const { type, closed, areaFill, connect } = style;
  const center = getGridCenter(cfg);
  const finalData = filterExec(data, cfg.gridFilter);
  const gridItems = type === 'segment' ? renderStraight(finalData, cfg) : renderSurround(finalData, cfg, style);
  container
    .maybeAppendByClassName(CLASS_NAMES.grid, () => new Grid({}))
    .update({
      type,
      animate,
      connect,
      closed,
      center,
      ...style,
      items: gridItems,
      areaFill: isFunction(areaFill)
        ? finalData.map((datum, index) => getCallbackValue(areaFill, [datum, index, finalData]))
        : areaFill,
    });
}
