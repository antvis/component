import type { DisplayObjectConfig, Group } from '@antv/g';
import { GUI } from '../../core/gui';
import { applyStyle, deepAssign, subObject, subObjects, select, Selection, styleSeparator } from '../../util';
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

  private renderTitle(container: Selection, width: number, height: number) {
    const style = subObject(this.attributes, 'title') as TitleStyleProps;
    const [titleStyle, groupStyle] = styleSeparator(style);
    this.titleGroup = container.maybeAppendByClassName<Group>(CLASS_NAMES.titleGroup, 'g').call(applyStyle, groupStyle);
    this.titleGroup
      .maybeAppendByClassName(
        CLASS_NAMES.title,
        () => new Title({ style: { width, height, ...titleStyle } as TitleStyleProps })
      )
      .call(applyStyle, titleStyle);
  }

  private renderItems(container: Selection, width: number, height: number) {
    const [, style] = subObjects(this.attributes, ['title']);
    const [_itemStyle, groupStyle] = styleSeparator(style);

    // rewrite width and height to available space
    const itemStyle = { ..._itemStyle, width, height };

    this.itemsGroup = container.maybeAppendByClassName<Group>(CLASS_NAMES.itemsGroup, 'g').call(applyStyle, groupStyle);
    this.itemsGroup
      .maybeAppendByClassName(CLASS_NAMES.items, () => new CategoryItems({ style: itemStyle as CategoryStyleProps }))
      .call(applyStyle, groupStyle);

    // cuz itemsStyle has callbackable parameters, so it can not passed by call applyStyle
    Object.entries(itemStyle).forEach(([k, v]) => this.itemsGroup.attr(k, v));
  }

  private adjustLayout() {
    const { x, y } = this.titleGroup.select(CLASS_NAMES.title.class).node<Title>().getAvailableSpace();
    this.itemsGroup.node().setLocalPosition(x, y);
  }

  render(attributes: CategoryStyleProps, container: Group) {
    const { width, height } = attributes;
    const ctn = select(container);
    this.renderTitle(ctn, width, height);

    const { width: availableWidth, height: availableHeight } = (
      this.titleGroup.select(CLASS_NAMES.title.class).node() as Title
    ).getAvailableSpace();

    this.renderItems(ctn, +availableWidth, +availableHeight);

    this.adjustLayout();
  }
}
