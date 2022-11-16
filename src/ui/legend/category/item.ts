import type {
  DisplayObject,
  DisplayObjectConfig,
  Group,
  GroupStyleProps,
  RectStyleProps,
  TextStyleProps,
} from '@antv/g';
import { isNumber, isString } from '@antv/util';
import { GUI } from '../../../core/gui';
import { ExtendDisplayObject, PrefixedStyle } from '../../../types';
import {
  applyStyle,
  classNames,
  deepAssign,
  ellipsisIt,
  subObject,
  ifShow,
  normalPadding,
  Padding,
  renderExtDo,
  select,
  Selection,
} from '../../../util';
import { circle } from '../../marker/symbol';

type ItemTextStyle = Omit<TextStyleProps, 'text'>;
type ItemBackgroundStyle = Omit<RectStyleProps, 'width' | 'height'>;

export interface CategoryItemData {
  label?: ExtendDisplayObject;
  value?: ExtendDisplayObject;
}
export type CategoryItemStyle = {
  marker?: string | (() => DisplayObject);
  [key: `marker${string}`]: any;
} & PrefixedStyle<ItemTextStyle, 'label'> &
  PrefixedStyle<ItemTextStyle, 'value'> &
  PrefixedStyle<ItemBackgroundStyle, 'background'>;

export type CategoryItemCfg = Omit<GroupStyleProps, 'width' | 'height'> & {
  layout?: 'fixed' | 'fit';
  /** spacing between marker, label and value */
  spacing?: Padding;
  // if width and height not specific, set it to actual space occurred
  width?: number;
  height?: number;
  /** space allocation of marker, label and value */
  span?: Padding;
};

export type CategoryItemStyleProps = CategoryItemStyle & CategoryItemCfg & CategoryItemData;

export type CategoryItemOptions = DisplayObjectConfig<CategoryItemStyleProps>;

type RI = Required<CategoryItemStyleProps>;

const CLASS_NAMES = classNames(
  {
    layout: 'fit',
    markerGroup: 'marker-group',
    marker: 'marker',
    labelGroup: 'label-group',
    label: 'label',
    valueGroup: 'value-group',
    value: 'value',
    backgroundGroup: 'background-group',
    background: 'background',
  },
  'legend-category-item'
);

const DEFAULT_ITEM_CFG: Partial<CategoryItemStyleProps> = {
  span: [0.5, 1, 1],
  marker: 'path',
  markerD: circle(6, 6, 6),
  markerFill: '#d3d2d3',
  labelFill: '#646464',
  valueFill: '#646464',
  labelFontSize: 12,
  valueFontSize: 12,
  labelFontFamily: 'sans-serif',
  valueFontFamily: 'sans-serif',
  labelTextAlign: 'start',
  valueTextAlign: 'start',
  labelTextBaseline: 'middle',
  valueTextBaseline: 'middle',
};

export class CategoryItem extends GUI<CategoryItemStyleProps> {
  constructor(config: DisplayObjectConfig<CategoryItemStyleProps>) {
    super(deepAssign({}, { style: DEFAULT_ITEM_CFG }, config));
  }

  private markerGroup!: Selection<Group>;

  private labelGroup!: Selection<Group>;

  private valueGroup!: Selection<Group>;

  private background!: Selection<Group>;

  private get showValue() {
    const { value } = this.attributes;
    if (!value) return false;
    if (isString(value) || isNumber(value)) return value !== '';
    return value.attr('text') !== '';
  }

  private get actualSpace() {
    const marker = this.markerGroup;
    const label = this.labelGroup;
    const value = this.valueGroup;
    const { width: markerWidth, height: markerHeight } = marker.node().getBBox();
    const { width: labelWidth, height: labelHeight } = label.node().getBBox();
    const { width: valueWidth, height: valueHeight } = value.node().getBBox();
    return {
      markerWidth,
      labelWidth,
      valueWidth,
      height: Math.max(markerHeight, labelHeight, valueHeight),
    };
  }

  private get span() {
    const { attributes } = this;
    if (!('span' in attributes)) return [1, 1, 1];
    const { span } = attributes;
    const [span1, span2, _span3] = normalPadding(span!);
    const span3 = this.showValue ? _span3 : 0;
    const basis = span1 + span2 + span3;
    return [span1 / basis, span2 / basis, span3 / basis];
  }

  private get shape() {
    const { attributes } = this;
    let { markerWidth, labelWidth, valueWidth, height } = this.actualSpace;

    if (attributes.layout === 'fixed' && attributes.width) {
      const { width: w } = attributes;
      const [span1, span2, span3] = this.span;
      [markerWidth, labelWidth, valueWidth] = [span1 * w, span2 * w, span3 * w];
    }
    if (attributes.height) height = attributes.height;

    const [spacing1, spacing2] = this.spacing;
    const width = markerWidth + labelWidth + valueWidth + spacing1 + spacing2;
    return { width, height, markerWidth, labelWidth, valueWidth };
  }

  private get spacing() {
    const { spacing } = this.attributes;
    if (!spacing) return [0, 0];
    const [spacing1, spacing2] = normalPadding(spacing);
    if (this.showValue) return [spacing1, spacing2];
    return [spacing1, 0];
  }

  private get layout() {
    const { markerWidth, labelWidth, valueWidth, width, height } = this.shape;
    const [spacing1, spacing2] = this.spacing;
    return {
      height,
      width,
      markerWidth,
      labelWidth,
      valueWidth,
      position: [markerWidth / 2, markerWidth + spacing1, markerWidth + labelWidth + spacing1 + spacing2],
    };
  }

  private renderMarker(container: Selection) {
    const { marker } = this.attributes;
    const style = subObject(this.attributes, 'marker');
    this.markerGroup = container.maybeAppendByClassName(CLASS_NAMES.markerGroup, 'g');
    ifShow(!!marker, this.markerGroup, () => {
      this.markerGroup
        .maybeAppendByClassName(CLASS_NAMES.marker, marker!)
        .call(applyStyle, { anchor: '0.5 0.5', ...style });
    });
  }

  private renderLabel(container: Selection) {
    const { label } = this.attributes;
    const style = subObject(this.attributes, 'label');
    this.labelGroup = container.maybeAppendByClassName<Group>(CLASS_NAMES.labelGroup, 'g');
    this.labelGroup.maybeAppendByClassName(CLASS_NAMES.label, () => renderExtDo(label!)).call(applyStyle, style);
  }

  private renderValue(container: Selection) {
    const { value } = this.attributes;
    const style = subObject(this.attributes, 'value');
    this.valueGroup = container.maybeAppendByClassName(CLASS_NAMES.valueGroup, 'g');
    ifShow(this.showValue, this.valueGroup, () => {
      this.valueGroup.maybeAppendByClassName(CLASS_NAMES.value, () => renderExtDo(value!)).call(applyStyle, style);
    });
  }

  private renderBackground(container: Selection) {
    const { width, height } = this.shape;
    const style = subObject(this.attributes, 'background');
    this.background = container.maybeAppendByClassName(CLASS_NAMES.backgroundGroup, 'g').style('zIndex', -1);
    this.background
      .maybeAppendByClassName(CLASS_NAMES.background, 'rect')
      .call(applyStyle, { width, height, ...style });
  }

  private adjustLayout() {
    const {
      layout: {
        markerWidth,
        labelWidth,
        valueWidth,
        width,
        height,
        position: [markerX, labelX, valueX],
      },
    } = this;

    const halfHeight = height / 2;
    this.markerGroup.call(applyStyle, { x: markerX, y: halfHeight });
    this.labelGroup.call(applyStyle, { x: labelX, y: halfHeight });
    ellipsisIt(this.labelGroup.select(CLASS_NAMES.label.class), labelWidth);
    if (this.showValue) {
      this.valueGroup.call(applyStyle, { x: valueX, y: halfHeight });
      ellipsisIt(this.valueGroup.select(CLASS_NAMES.value.class), valueWidth);
    }
  }

  public render(attributes: CategoryItemStyleProps, container: Group) {
    const ctn = select(container);
    this.renderMarker(ctn);
    this.renderLabel(ctn);
    this.renderValue(ctn);
    this.renderBackground(ctn);
    this.adjustLayout();
  }
}
