import { Circle, DisplayObject, Group, GroupStyleProps, PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import { GUI, type ComponentOptions } from '../../../core';
import { ExtendDisplayObject, PrefixObject } from '../../../types';
import {
  classNames,
  ellipsisIt,
  ifShow,
  parseSeriesAttr,
  renderExtDo,
  scaleToPixel,
  select,
  Selection,
  SeriesAttr,
  subStyleProps,
} from '../../../util';

type ItemMarkerStyle = { size?: number } & PathStyleProps;
type ItemTextStyle = Omit<TextStyleProps, 'text'>;
type ItemBackgroundStyle = Omit<RectStyleProps, 'width' | 'height'>;

export type CategoryItemStyleProps = GroupStyleProps &
  PrefixObject<ItemMarkerStyle, 'marker'> &
  PrefixObject<ItemTextStyle, 'label'> &
  PrefixObject<ItemTextStyle, 'value'> &
  PrefixObject<ItemBackgroundStyle, 'background'> & {
    labelText?: ExtendDisplayObject;
    marker?: string | (() => DisplayObject);
    /** spacing between marker, label and value */
    spacing?: SeriesAttr;
    span?: SeriesAttr;
    valueText?: ExtendDisplayObject;
    // if width and height not specific, set it to actual space occurred
    width?: number;
  };

export type CategoryItemOptions = ComponentOptions<CategoryItemStyleProps>;

const CLASS_NAMES = classNames(
  {
    layout: 'flex',
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

export class CategoryItem extends GUI<CategoryItemStyleProps> {
  constructor(options: CategoryItemOptions) {
    super(options, {
      span: [1, 1],
      marker: () => new Circle({ style: { r: 6 } }),
      markerSize: 10,
      labelFill: '#646464',
      valueFill: '#646464',
      labelFontSize: 12,
      valueFontSize: 12,
      labelTextBaseline: 'middle',
      valueTextBaseline: 'middle',
    });
  }

  private markerGroup!: Selection<Group>;

  private labelGroup!: Selection<Group>;

  private valueGroup!: Selection<Group>;

  private background!: Selection<Group>;

  private get showValue() {
    const { valueText } = this.attributes;
    if (!valueText) return false;
    if (typeof valueText === 'string' || typeof valueText === 'number') return valueText !== '';
    if (typeof valueText === 'function') return true;
    return valueText.attr('text') !== '';
  }

  private get actualSpace() {
    const label = this.labelGroup;
    const value = this.valueGroup;
    const { markerSize } = this.attributes;
    const { width: labelWidth, height: labelHeight } = label.node().getBBox();
    const { width: valueWidth, height: valueHeight } = value.node().getBBox();
    return {
      markerWidth: markerSize,
      labelWidth,
      valueWidth,
      height: Math.max(markerSize, labelHeight, valueHeight),
    };
  }

  private get span() {
    const { span } = this.attributes;
    if (!span) return [1, 1];
    const [span1, innerSpan] = parseSeriesAttr(span!);
    const span2 = this.showValue ? innerSpan : 0;
    const basis = span1 + span2;
    return [span1 / basis, span2 / basis];
  }

  private get shape() {
    const { markerSize, width: fullWidth } = this.attributes;
    const actualSpace = this.actualSpace;
    const { markerWidth, height } = actualSpace;
    let { labelWidth, valueWidth } = this.actualSpace;
    const [spacing1, spacing2] = this.spacing;

    if (fullWidth) {
      const width = fullWidth - markerSize! - spacing1 - spacing2;
      const [span1, span2] = this.span;
      [labelWidth, valueWidth] = [span1 * width, span2 * width];
    }

    const width = markerWidth + labelWidth + valueWidth + spacing1 + spacing2;
    return { width, height, markerWidth, labelWidth, valueWidth };
  }

  private get spacing() {
    const { spacing } = this.attributes;
    if (!spacing) return [0, 0];
    const [spacing1, spacing2] = parseSeriesAttr(spacing);
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
    const { marker, markerSize } = this.attributes;
    const style = subStyleProps(this.attributes, 'marker');
    this.markerGroup = container.maybeAppendByClassName(CLASS_NAMES.markerGroup, 'g').style('zIndex', 0);
    ifShow(!!marker, this.markerGroup, () => {
      this.markerGroup.maybeAppendByClassName(CLASS_NAMES.marker, marker!).styles(style);
      scaleToPixel(this.markerGroup.node(), markerSize!, true);
    });
  }

  private renderLabel(container: Selection) {
    const { text: label, ...style } = subStyleProps(this.attributes, 'label');
    this.labelGroup = container.maybeAppendByClassName<Group>(CLASS_NAMES.labelGroup, 'g').style('zIndex', 0);
    this.labelGroup.maybeAppendByClassName(CLASS_NAMES.label, () => renderExtDo(label)).styles(style);
  }

  private renderValue(container: Selection) {
    const { text: value, ...style } = subStyleProps(this.attributes, 'value');
    this.valueGroup = container.maybeAppendByClassName(CLASS_NAMES.valueGroup, 'g').style('zIndex', 0);
    ifShow(this.showValue, this.valueGroup, () => {
      this.valueGroup.maybeAppendByClassName(CLASS_NAMES.value, () => renderExtDo(value)).styles(style);
    });
  }

  private renderBackground(container: Selection) {
    const { width, height } = this.shape;
    const style = subStyleProps(this.attributes, 'background');
    this.background = container.maybeAppendByClassName(CLASS_NAMES.backgroundGroup, 'g').style('zIndex', -1);
    this.background.maybeAppendByClassName(CLASS_NAMES.background, 'rect').styles({ width, height, ...style });
  }

  private adjustLayout() {
    const {
      layout: {
        labelWidth,
        valueWidth,
        height,
        position: [markerX, labelX, valueX],
      },
    } = this;

    const halfHeight = height / 2;
    this.markerGroup.styles({ x: markerX, y: halfHeight });
    this.labelGroup.styles({ x: labelX, y: halfHeight });

    ellipsisIt(this.labelGroup.select(CLASS_NAMES.label.class).node(), labelWidth);
    if (this.showValue) {
      this.valueGroup.styles({ x: valueX, y: halfHeight });
      ellipsisIt(this.valueGroup.select(CLASS_NAMES.value.class).node(), valueWidth);
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
