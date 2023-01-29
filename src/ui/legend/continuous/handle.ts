import { Group, type DisplayObjectConfig, type GroupStyleProps, type TextStyleProps } from '@antv/g';
import { GUI } from '../../../core/gui';
import type { PrefixedStyle } from '../../../types';
import {
  classNames,
  deepAssign,
  ifShow,
  select,
  subObject,
  superObject,
  TEXT_INHERITABLE_PROPS,
  type Selection,
} from '../../../util';
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
  ...superObject(TEXT_INHERITABLE_PROPS, 'label'),
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
  formatter: (val: any) => val.toString(),
};

export class Handle extends GUI<HandleStyleProps> {
  constructor(config: DisplayObjectConfig<HandleStyleProps>) {
    super(deepAssign({}, { style: DEFAULT_HANDLE_CFG }, config));
  }

  private marker!: Selection;

  render(attributes: HandleStyleProps, container: Group) {
    const markerGroup = select(container).maybeAppendByClassName(CLASS_NAMES.markerGroup, 'g');
    this.renderMarker(markerGroup);

    const labelGroup = select(container).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g');
    this.renderLabel(labelGroup);
  }

  attributeChangedCallback() {
    this.render(this.attributes, this);
  }

  private renderMarker(container: Selection) {
    const { orient, markerSymbol = ifHorizontal(orient, 'horizontalHandle', 'verticalHandle') } = this
      .attributes as Required<HandleStyleProps>;

    ifShow(!!markerSymbol, container, (group) => {
      const handleStyle = subObject(this.attributes, 'marker');
      const markerStyle = { symbol: markerSymbol, ...handleStyle };
      this.marker = group.maybeAppendByClassName(CLASS_NAMES.marker, () => new Marker({})).update(markerStyle);
    });
  }

  private renderLabel(container: Selection) {
    const { orient, spacing = 0, showLabel, formatter } = this.attributes as Required<HandleStyleProps>;
    ifShow(showLabel, container, (group) => {
      const { text, ...labelStyle } = subObject(this.attributes, 'label');
      // adjust layout
      const { width = 0, height = 0 } = group.select(CLASS_NAMES.marker.class)?.node().getBBox() || {};
      const [x, y, textAlign, textBaseline] = ifHorizontal(
        orient,
        [0, height + spacing, 'center', 'top'],
        [width + spacing, 0, 'start', 'middle']
      );

      group
        .maybeAppendByClassName(CLASS_NAMES.label, 'text')
        .styles({ ...labelStyle, x, y, text: formatter(text).toString(), textAlign, textBaseline });
    });
  }
}
