import type { DisplayObjectConfig, Group } from '@antv/g';
import { GUI } from '../../core/gui';
import { deepAssign, ifShow, select, Selection, styleSeparator, subObject, subObjects } from '../../util';
import { getBBox, Title, type TitleStyleProps } from '../title';
import { CategoryItems } from './category/items';
import { CATEGORY_DEFAULT_OPTIONS, CLASS_NAMES } from './constant';
import type { CategoryOptions, CategoryStyleProps } from './types';

export type { CategoryOptions };

export class Category extends GUI<CategoryStyleProps> {
  constructor(config: DisplayObjectConfig<CategoryStyleProps>) {
    super(deepAssign({}, CATEGORY_DEFAULT_OPTIONS, config));
  }

  private titleGroup!: Selection;

  private itemsGroup!: Selection;

  private items!: Selection<CategoryItems>;

  private renderTitle(container: Selection, width: number, height: number) {
    const { showTitle } = this.attributes;
    const style = subObject(this.attributes, 'title') as TitleStyleProps;
    const [titleStyle, groupStyle] = styleSeparator(style);
    this.titleGroup = container.maybeAppendByClassName<Group>(CLASS_NAMES.titleGroup, 'g').styles(groupStyle);

    ifShow(!!showTitle, this.titleGroup, (group) => {
      const finalTitleStyle = { width, height, ...titleStyle };
      group
        .maybeAppendByClassName(CLASS_NAMES.title, () => new Title({ style: finalTitleStyle as TitleStyleProps }))
        .update(finalTitleStyle);
    });
  }

  private renderItems(container: Selection, bbox: DOMRect) {
    const { x, y, width, height } = bbox;
    const [, style] = subObjects(this.attributes, ['title']);
    const [partialItemStyle, groupStyle] = styleSeparator(style);

    // rewrite width and height to available space
    const itemStyle = { ...partialItemStyle, width, height };

    this.itemsGroup = container
      .maybeAppendByClassName<Group>(CLASS_NAMES.itemsGroup, 'g')
      .styles({ x, y, ...groupStyle });
    this.items = this.itemsGroup
      .maybeAppendByClassName(
        CLASS_NAMES.items,
        () =>
          new CategoryItems({
            style: {
              data: [],
            },
          })
      )
      .update(itemStyle) as Selection<CategoryItems>;

    // cuz itemsStyle has callbackable parameters, so it can not passed by call applyStyle
    Object.entries(itemStyle).forEach(([k, v]) => this.itemsGroup.attr(k, v));
  }

  private adjustLayout() {
    const { showTitle } = this.attributes;
    if (showTitle) {
      const { x, y } = this.titleGroup.select(CLASS_NAMES.title.class).node<Title>().getAvailableSpace();
      this.itemsGroup.node().setLocalPosition(x, y);
    }
  }

  private get availableSpace(): DOMRect {
    const { showTitle, width, height } = this.attributes;
    if (!showTitle) return new DOMRect(0, 0, width!, height!);
    return (this.titleGroup.select(CLASS_NAMES.title.class).node() as Title).getAvailableSpace();
  }

  public getBBox(): DOMRect {
    return getBBox(this.querySelector(CLASS_NAMES.title.class) as Title, this.items.node());
  }

  render(attributes: CategoryStyleProps, container: Group) {
    const { width, height } = attributes;
    const ctn = select(container);

    this.renderTitle(ctn, width!, height!);

    this.renderItems(ctn, this.availableSpace);

    this.adjustLayout();
  }
}
