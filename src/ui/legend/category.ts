import type { DisplayObjectConfig, Group } from '@antv/g';
import { GUI } from '../../core/gui';
import {
  applyStyle,
  deepAssign,
  getStyleFromPrefixed,
  getStylesFromPrefixed,
  select,
  Selection,
  styleSeparator,
} from '../../util';
import type { TitleStyleProps } from '../title';
import { Title } from '../title';
import { CategoryItems } from './category/items';
import { CATEGORY_DEFAULT_OPTIONS, CLASS_NAMES } from './constant';
import type { CategoryOptions, CategoryStyleProps } from './types';

export type { CategoryOptions };

export class Category extends GUI<CategoryStyleProps> {
  constructor(config: DisplayObjectConfig<CategoryStyleProps>) {
    super(deepAssign({}, { style: CATEGORY_DEFAULT_OPTIONS }, config));
  }

  private titleGroup!: Selection;

  private itemsGroup!: Selection;

  private get isShapeSet() {
    const { width, height } = this.attributes;
    return !!width && !!height;
  }

  private renderTitle(container: Selection, width: number, height: number) {
    const style = getStyleFromPrefixed(this.attributes, 'title') as TitleStyleProps;
    const [titleStyle, groupStyle] = styleSeparator(style);
    this.titleGroup = container.maybeAppendByClassName<Group>(CLASS_NAMES.titleGroup, 'g').call(applyStyle, groupStyle);
    this.titleGroup
      .maybeAppendByClassName(
        CLASS_NAMES.title,
        () => new Title({ style: { width, height, ...titleStyle } as TitleStyleProps })
      )
      .call(applyStyle, titleStyle);
  }

  private renderItems(container: Selection) {
    const [, style] = getStylesFromPrefixed(this.attributes, ['title']);
    const [itemStyle, groupStyle] = styleSeparator(style);

    this.itemsGroup = container.maybeAppendByClassName<Group>(CLASS_NAMES.itemsGroup, 'g').call(applyStyle, groupStyle);
    this.itemsGroup
      .maybeAppendByClassName(CLASS_NAMES.items, () => new CategoryItems({ style: itemStyle as CategoryStyleProps }))
      .call(applyStyle, groupStyle);

    // cuz itemsStyle has callbackable parameters, so it can not passed by call applyStyle
    Object.entries(itemStyle).forEach(([k, v]) => this.itemsGroup.attr(k, v));
  }

  private adjustLayout() {
    const {
      x,
      y,
      width: w,
      height: h,
    } = this.titleGroup.select(CLASS_NAMES.title.class).node<Title>().getAvailableSpace();
    this.itemsGroup.node().setLocalPosition(x, y);
    this.isShapeSet && this.itemsGroup.attr('width', w).attr('height', h);
  }

  render(attributes: CategoryStyleProps, container: Group) {
    const ctn = select(container);
    this.renderItems(ctn);

    // once width and height are not provided, use the actual shape of items to set title
    const { width: itemsWidth, height: itemsHeight } = this.itemsGroup.node().getBBox();
    const { width = itemsWidth, height = itemsHeight } = attributes;

    this.renderTitle(ctn, width, height);
    this.adjustLayout();
  }
}
