import { Group, type GroupStyleProps, type TextStyleProps } from '@antv/g';
import { GUI, type ComponentOptions, type PrefixStyleProps, type RequiredStyleProps } from '../../../core';
import type { MergeMultiple, PrefixObject } from '../../../types';
import {
  classNames,
  ifShow,
  select,
  subStyleProps,
  superObject,
  TEXT_INHERITABLE_PROPS,
  type Selection,
} from '../../../util';
import { Marker, MarkerStyleProps } from '../../marker';
import { ifHorizontal } from '../utils';

export type HandleStyleProps<T = any> = MergeMultiple<
  [
    PrefixStyleProps<Omit<MarkerStyleProps, 'x' | 'y'>, 'marker'>,
    {
      showLabel?: boolean;
      formatter?: (val: T) => string;
      style: GroupStyleProps &
        PrefixObject<TextStyleProps, 'label'> & {
          orientation: 'vertical' | 'horizontal';
          /** spacing between marker and label */
          spacing?: number;
        };
    }
  ]
>;

export type HandleType = 'start' | 'end';

const CLASS_NAMES = classNames(
  {
    markerGroup: 'marker-group',
    marker: 'marker',
    labelGroup: 'label-group',
    label: 'label',
  } as const,
  'handle'
);

// todo @xiaoiver, 配置 TEXT_INHERITABLE_PROPS 后文本包围盒依旧不准确
export const DEFAULT_HANDLE_CFG: HandleStyleProps = {
  showLabel: true,
  formatter: (val: any) => val.toString(),
  style: {
    ...superObject(TEXT_INHERITABLE_PROPS, 'label'),
    markerSize: 25,
    markerStroke: '#c5c5c5',
    markerFill: '#fff',
    markerLineWidth: 1,
    labelFontSize: 12,
    labelFill: '#c5c5c5',
    labelText: '',
    orientation: 'vertical',
    spacing: 0,
  },
};

export class Handle extends GUI<RequiredStyleProps<HandleStyleProps>> {
  constructor(options: ComponentOptions<HandleStyleProps>) {
    super(options, DEFAULT_HANDLE_CFG);
  }

  private marker!: Selection;

  render(attributes: RequiredStyleProps<HandleStyleProps>, container: Group) {
    const markerGroup = select(container).maybeAppendByClassName(CLASS_NAMES.markerGroup, 'g');
    this.renderMarker(markerGroup);

    const labelGroup = select(container).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g');
    this.renderLabel(labelGroup);
  }

  private renderMarker(container: Selection) {
    const {
      style: { orientation, markerSymbol = ifHorizontal(orientation, 'horizontalHandle', 'verticalHandle') },
    } = this.attributes;

    ifShow(!!markerSymbol, container, (group) => {
      const { style: handleStyle } = subStyleProps(this.attributes, 'marker');
      const markerStyle = { style: { symbol: markerSymbol, ...handleStyle } };
      this.marker = group
        .maybeAppendByClassName(CLASS_NAMES.marker, () => new Marker({ style: markerStyle }))
        .update(markerStyle);
    });
  }

  private renderLabel(container: Selection) {
    const {
      style: { orientation, spacing = 0 },
      showLabel,
      formatter,
    } = this.attributes;

    ifShow(showLabel, container, (group) => {
      const { text, ...labelStyle } = subStyleProps(this.attributes, 'label').style;

      // adjust layout
      const { width = 0, height = 0 } = group.select(CLASS_NAMES.marker.class)?.node().getBBox() || {};
      const [x, y, textAlign, textBaseline] = ifHorizontal(
        orientation,
        [0, height + spacing, 'center', 'top'],
        [width + spacing, 0, 'start', 'middle']
      );

      group
        .maybeAppendByClassName(CLASS_NAMES.label, 'text')
        .styles({ ...labelStyle, x, y, text: formatter(text).toString(), textAlign, textBaseline });
    });
  }
}
