import { DisplayObjectConfig } from '@antv/g';
import { getStylesFromPrefixed, ifShow, sampling, select, filterTransform, createComponent } from '../../util';
import { AXIS_BASE_DEFAULT_CFG, CLASS_NAMES } from './constant';
import { renderGrid } from './guides/axisGrid';
import { renderLabels } from './guides/axisLabels';
import { renderAxisLine } from './guides/axisLine';
import { renderTicks } from './guides/axisTicks';
import { renderTitle } from './guides/axisTitle';
import type { ArcAxisStyleProps, AxisStyleProps, LinearAxisStyleProps } from './types';

export type AxisOptions = DisplayObjectConfig<AxisStyleProps>;

type RA = Required<AxisStyleProps>;

export const Axis = createComponent<AxisStyleProps>(
  {
    render(attributes, container) {
      const {
        type,
        data: _data,
        dataThreshold = 100,
        crossSize,
        animation,
        title,
        titleSpacing,
        titleAlign,
        truncRange,
        truncShape,
        showLine,
        lineExtension,
        lineArrow,
        lineArrowOffset,
        lineArrowSize,
        showTick,
        tickDirection,
        tickLength,
        tickFilter,
        tickFormatter,
        showLabel,
        labelAlign,
        labelDirection,
        labelSpacing,
        labelFilter,
        labelFormatter,
        labelTransforms,
        showGrid,
        gridFilter,
        gridLength,
        ...restCfg
      } = filterTransform(attributes) as RA;

      const restStyle = (() => {
        if (type === 'linear') {
          const { startPos, endPos, ...rest } = restCfg as LinearAxisStyleProps;
          return rest;
        }
        const { angleRange, radius, center, ...rest } = restCfg as ArcAxisStyleProps;
        return rest;
      })();

      const [titleStyle, lineStyle, tickStyle, labelStyle, gridStyle] = getStylesFromPrefixed(restStyle, [
        'title',
        'line',
        'tick',
        'label',
        'grid',
      ]);

      const data = sampling(_data, dataThreshold).filter(({ value }) => {
        if (truncRange && value > truncRange[0] && value < truncRange[1]) return false;
        return true;
      });
      /** grid */
      const axisGridGroup = select(container).maybeAppendByClassName(CLASS_NAMES.gridGroup, 'g');
      ifShow(showGrid!, axisGridGroup, () => renderGrid(axisGridGroup, data, attributes, gridStyle), true);
      /** main group */
      const axisMainGroup = select(container).maybeAppendByClassName(CLASS_NAMES.mainGroup, 'g');

      /** line */
      const axisLineGroup = axisMainGroup.maybeAppendByClassName(CLASS_NAMES.lineGroup, 'g');
      ifShow(
        showLine!,
        axisLineGroup,
        () => {
          renderAxisLine(axisLineGroup, attributes, lineStyle);
        },
        true
      );
      /** tick */
      const axisTickGroup = axisMainGroup.maybeAppendByClassName(CLASS_NAMES.tickGroup, 'g');
      ifShow(
        showTick!,
        axisTickGroup,
        () => {
          renderTicks(axisTickGroup, data, attributes, tickStyle);
        },
        true
      );
      /** label */
      const axisLabelGroup = axisMainGroup.maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g');
      ifShow(
        showLabel!,
        axisLabelGroup,
        () => {
          renderLabels(axisLabelGroup, data, attributes, labelStyle);
        },
        true
      );
      /** title */
      renderTitle(select(container), attributes, titleStyle);
    },
  },
  {
    ...AXIS_BASE_DEFAULT_CFG.style,
  }
);
