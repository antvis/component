import { vec2 } from '@antv/matrix-util';
import { isFunction } from '@antv/util';
import { StandardAnimationOption } from '../../../animation';
import type { Point } from '../../../types';
import type { RequiredStyleProps } from '../../../core';
import { degToRad, getCallbackValue, Selection, subStyleProps } from '../../../util';
import { Grid } from '../../grid';
import { CLASS_NAMES } from '../constant';
import type { AxisDatum, AxisStyleProps, AxisGridStyleProps } from '../types';
import { getDirectionVector, getValuePos } from './line';
import { filterExec } from './utils';

function getGridVector(value: number, attr: RequiredStyleProps<AxisStyleProps>) {
  return getDirectionVector(value, attr.style.gridDirection, attr);
}

function getGridCenter(attr: RequiredStyleProps<AxisStyleProps>) {
  const { type, gridCenter } = attr.style;
  if (type === 'linear') return gridCenter;
  return gridCenter || attr.style.center;
}

function renderStraight(data: AxisDatum[], attr: RequiredStyleProps<AxisStyleProps>) {
  const { gridLength } = attr.style;
  return data.map(({ value }) => {
    const [x, y] = getValuePos(value, attr);
    const [dx, dy] = vec2.scale([0, 0], getGridVector(value, attr), gridLength);
    return {
      points: [
        [x, y],
        [x + dx, y + dy],
      ],
    };
  });
}

function renderSurround(data: AxisDatum[], attr: RequiredStyleProps<AxisStyleProps>) {
  const controlAngles = attr.style.gridControlAngles;
  const center = getGridCenter(attr);
  if (!center) throw new Error('grid center is not provide');
  if (data.length < 2) throw new Error('Invalid grid data');
  if (!controlAngles || controlAngles.length === 0) throw new Error('Invalid gridControlAngles');

  const [cx, cy] = center;
  return data.map(({ value }) => {
    const [sx, sy] = getValuePos(value, attr);
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
  attr: RequiredStyleProps<AxisStyleProps>,
  animate: StandardAnimationOption
) {
  const gridAttr = subStyleProps<RequiredStyleProps<AxisGridStyleProps>>(attr, 'grid');
  const { type, areaFill } = gridAttr.style;
  const center = getGridCenter(attr);
  const finalData = filterExec(data, attr.gridFilter);
  const gridItems = type === 'segment' ? renderStraight(finalData, attr) : renderSurround(finalData, attr);

  const style = {
    style: {
      ...gridAttr.style,
      center,
      areaFill: isFunction(areaFill)
        ? finalData.map((datum, index) => getCallbackValue(areaFill, [datum, index, finalData]))
        : areaFill,
    },
    animate,
    data: gridItems,
  };

  container.maybeAppendByClassName(CLASS_NAMES.grid, () => new Grid({ style })).update(style);
}
