import { Group, TextStyleProps, type GroupStyleProps } from '@antv/g';
import type { PrefixedStyle } from '../../../types';
import { applyStyle, createComponent, subObjects, select, classNames, ifShow } from '../../../util';
import { Marker, MarkerStyleProps } from '../../marker';
import { ifHorizontal } from '../utils';

export type HandleStyleProps<T = any> = GroupStyleProps &
  PrefixedStyle<Omit<Partial<MarkerStyleProps>, 'x' | 'y'>, 'marker'> &
  PrefixedStyle<TextStyleProps, 'label'> & {
    orient: 'vertical' | 'horizontal';
    /** spacing between marker and label */
    spacing?: number;
    showLabel?: boolean;
    formatter?: (val: T) => string;
  };

const CLASS_NAMES = classNames(
  {
    marker: 'marker',
    labelGroup: 'labelGroup',
    label: 'label',
  } as const,
  'handle'
);

const DEFAULT_HANDLE_CFG: HandleStyleProps = {
  markerSize: 25,
  markerStroke: '#c5c5c5',
  markerFill: '#fff',
  markerLineWidth: 1,
  labelFontSize: 12,
  labelFill: '#c5c5c5',
  labelText: '',
  orient: 'vertical',
  spacing: 0,
  showLabel: true,
  formatter: (val) => val.toString(),
};

export const Handle = createComponent<HandleStyleProps>(
  {
    render(attribute: HandleStyleProps, container: Group) {
      const {
        orient,
        visibility,
        spacing = 0,
        showLabel,
        formatter,
        markerSymbol = ifHorizontal(orient, 'horizontalHandle', 'verticalHandle'),
      } = attribute as Required<HandleStyleProps>;
      const [{ text, ...labelStyle }, handleStyle] = subObjects(attribute, ['label', 'marker']);
      if (!markerSymbol || visibility === 'hidden') {
        container.querySelector(CLASS_NAMES.marker.class)?.remove();
        container.querySelector(CLASS_NAMES.label.class)?.remove();
        return;
      }

      const style = { symbol: markerSymbol, ...handleStyle };
      const marker = select(container)
        // .maybeAppendByClassName(CLASS_NAMES.marker, () => new Marker({ style }))
        .maybeAppend(CLASS_NAMES.marker.name, () => new Marker({}))
        .update(style);

      const labelGroup = select(container).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g');
      ifShow(showLabel, labelGroup, (group) => {
        const label = group
          .maybeAppendByClassName(CLASS_NAMES.label, 'text')
          .call(applyStyle, { text: formatter(text).toString(), ...labelStyle });

        // adjust layout
        const { width, height } = marker.node().getBBox();
        const [x, y, textAlign, textBaseline] = ifHorizontal(
          orient,
          [0, height + spacing, 'center', 'top'],
          [width + spacing, 0, 'start', 'middle']
        );
        label.node().setLocalPosition(x, y);
        label.style('textAlign', textAlign).style('textBaseline', textBaseline);
      });
    },
  },
  {
    ...DEFAULT_HANDLE_CFG,
  }
);
