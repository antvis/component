import { ExtendDisplayObject, PrefixedStyle } from '@/types';
import type { Padding, Selection } from '@/util';
import {
  applyStyle,
  classNames,
  createComponent,
  filterTransform,
  getStylesFromPrefixed,
  ifShow,
  normalPadding,
  renderExtDo,
  select,
} from '@/util';
import type {
  DisplayObject,
  DisplayObjectConfig,
  GroupStyleProps,
  PathStyleProps,
  RectStyleProps,
  TextStyleProps,
} from '@antv/g';
import { isNumber, isString } from 'lodash';
import { circle } from '../../marker/symbol';

type ItemTextStyle = Omit<TextStyleProps, 'text'>;
type ItemBackgrounStyle = Omit<RectStyleProps, 'width' | 'height'>;

export interface CategoryItemData {
  label?: ExtendDisplayObject;
  value?: ExtendDisplayObject;
}
export type CategoryItemStyle = {
  marker?: string | (() => DisplayObject);
  [key: `marker${string}`]: any;
} & PrefixedStyle<ItemTextStyle, 'label'> &
  PrefixedStyle<ItemTextStyle, 'value'> &
  PrefixedStyle<ItemBackgrounStyle, 'background'>;
export interface CategoryItemCfg extends GroupStyleProps {
  width: number;
  height: number;
  span?: number[];
  spacing?: Padding;
  maxWidth?: number;
}

export type CategoryItemStyleProps = CategoryItemStyle & CategoryItemCfg & CategoryItemData;

export type CategoryItemOptions = DisplayObjectConfig<CategoryItemStyleProps>;

const CLASS_NAMES = classNames(
  {
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

const DEFAULT_CFG: Partial<CategoryItemStyleProps> = {
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

function isShowValue(value: CategoryItemStyleProps['value']) {
  if (!value) return false;
  if (isString(value) || isNumber(value)) return value !== '';
  return value.attr('text') !== '';
}

function getItemLayout(cfg: CategoryItemStyleProps) {
  const { value, width, span = [0.5, 1, 1], spacing = 0 } = cfg;
  const showValue = isShowValue(value);
  const [span1, span2, _span3] = normalPadding(span);
  const span3 = showValue ? _span3 : 0;
  const [spacing1, spacing2] = normalPadding(spacing);
  const basis = span1 + span2 + span3;
  const aWidth = width - spacing1 - spacing2;
  const w1 = (aWidth * span1) / basis;
  const w2 = (aWidth * span2) / basis;
  const w3 = (aWidth * span3) / basis;
  return {
    pos: [w1 / 2, w1 + spacing1, w1 + w2 + spacing1 + spacing2],
    width: [w1, w2, w3],
  };
}

function renderMarker(container: Selection, cfg: CategoryItemStyleProps, style: PathStyleProps) {
  container.maybeAppendByClassName(CLASS_NAMES.marker, cfg.marker!).call(applyStyle, { anchor: '0.5 0.5', ...style });
}

function renderLabel(container: Selection, cfg: CategoryItemStyleProps, style: ItemTextStyle) {
  const { label, height } = cfg;
  container.maybeAppendByClassName(CLASS_NAMES.label, () => renderExtDo(label!)).call(applyStyle, style);
}

function renderValue(container: Selection, cfg: CategoryItemStyleProps, style: ItemTextStyle) {
  const { value } = cfg;
  container.maybeAppendByClassName(CLASS_NAMES.value, () => renderExtDo(value!)).call(applyStyle, style);
}

function renderBackground(container: Selection, cfg: CategoryItemStyleProps, style: ItemBackgrounStyle) {
  const { width, height } = cfg;
  container.style('zIndex', -1);
  container.maybeAppendByClassName(CLASS_NAMES.background, 'rect').call(applyStyle, { width, height, ...style });
}

function adjustLayout(container: Selection, cfg: CategoryItemStyleProps) {
  const { width, height, value } = cfg;
  const h = height / 2;
  const showValue = isShowValue(value);
  const {
    pos: [x1, x2, x3],
    width: [, w2, w3],
  } = getItemLayout(cfg);
  const setTextEllipsisCfg = (el: Selection, w: number) => {
    const node = el.node();
    if (node.nodeName === 'text') {
      el.call(applyStyle, {
        wordWrap: true,
        wordWrapWidth: w,
        maxLines: 1,
        textOverflow: '...',
      });
    }
  };
  container.select(`.${CLASS_NAMES.markerGroup}`).call(applyStyle, { x: x1, y: h });
  const labelGroup = container.select(`.${CLASS_NAMES.labelGroup}`).call(applyStyle, { x: x2, y: h });
  setTextEllipsisCfg(labelGroup.select(`.${CLASS_NAMES.label}`), w2);
  if (showValue) {
    const valueGroup = container.select(`.${CLASS_NAMES.valueGroup}`).call(applyStyle, { x: x3, y: h });
    setTextEllipsisCfg(valueGroup.select(`.${CLASS_NAMES.value}`), w3);
  }
}

export const CategoryItem = createComponent<CategoryItemStyleProps>(
  {
    render(attributes, container) {
      const { width, height, span, spacing, maxWidth, marker, label, value, ...restStyle } =
        filterTransform(attributes);
      const [markerStyle, labelStyle, valueStyle, itemBackgroundStyle] = getStylesFromPrefixed(restStyle, [
        'marker',
        'label',
        'value',
        'background',
      ]);

      const group = select(container);

      /** marker */
      const markerGroup = group.maybeAppendByClassName(CLASS_NAMES.markerGroup, 'g');
      ifShow(
        !!marker,
        markerGroup,
        () => {
          renderMarker(markerGroup, attributes, markerStyle);
        },
        true
      );

      /** label */
      const labelGroup = group.maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g');
      ifShow(
        !!label,
        labelGroup,
        () => {
          renderLabel(labelGroup, attributes, labelStyle);
        },
        true
      );

      /** value */
      const valueGroup = group.maybeAppendByClassName(CLASS_NAMES.valueGroup, 'g');
      ifShow(
        isShowValue(value),
        valueGroup,
        () => {
          renderValue(valueGroup, attributes, valueStyle);
        },
        true
      );

      /** background */
      const backgroundGroup = group.maybeAppendByClassName(CLASS_NAMES.backgroundGroup, 'g');
      renderBackground(backgroundGroup, attributes, itemBackgroundStyle);

      adjustLayout(select(container), attributes);
    },
  },
  {
    ...DEFAULT_CFG,
  }
);
