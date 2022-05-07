import { DisplayObject, Group, Text, TextStyleProps, CustomEvent } from '@antv/g';
import { get, min, isFunction, deepMix } from '@antv/util';
import { applyStyle, deepAssign, defined, getShapeSpace, select, Selection, TEXT_INHERITABLE_PROPS } from '../../util';
import { GUI } from '../../core/gui';
import type { StyleState as State } from '../../types';
import { CategoryItem, ICategoryItemCfg } from './category-item';
import type { CategoryCfg, CategoryOptions } from './types';
import { CATEGORY_DEFAULT_OPTIONS } from './constant';
import { Pagination, PaginationStyleProps } from './pagination';

// 找到node节点所在的CategoryItem节点
function getParentItem(node: DisplayObject) {
  let item = node;
  try {
    while (item.config.type !== 'categoryItem') {
      item = item.parentNode as DisplayObject;
    }
    if (item.config.type === 'categoryItem') return item as CategoryItem;
  } catch (e) {
    return null;
  }
  return null;
}

export class Category extends GUI<CategoryCfg> {
  public static defaultOptions = {
    type: Category.tag,
    ...CATEGORY_DEFAULT_OPTIONS,
  };

  constructor(options: CategoryOptions) {
    super(deepAssign({}, Category.defaultOptions, options));
    this.init();
  }

  protected selection!: Selection;

  protected itemsGroup!: Group;

  public init() {
    this.selection = select(this);
    this.itemsGroup = this.appendChild(new Group({ className: 'legend-items-group' }));
    this.update();
    this.bindEvents();
  }

  public update(cfg: Partial<CategoryCfg> = {}) {
    this.attr(deepAssign({}, Category.defaultOptions.style, this.attributes, cfg));
    // 还原
    this.itemsGroup.setLocalPosition(0, 0);

    this.drawTitle();
    this.drawItems();
    this.drawPageNavigator();
    this.adjustLayout();
  }

  protected bindEvents() {
    this.itemsGroup.addEventListener('stateChange', () => this.dispatchItemsChange());
  }

  private titleShape!: Text;

  protected drawTitle() {
    const style = this.getTitleAttrs();
    if (!style && this.titleShape) this.titleShape.remove();
    else if (!this.titleShape) {
      this.titleShape = this.appendChild(new Text({ className: 'legend-title', style }));
    } else {
      applyStyle(this.titleShape, style);
    }
  }

  protected idItem: Map<string, CategoryItem> = new Map();

  protected drawItems() {
    const data = this.getItemsAttrs();
    const items = select(this.itemsGroup)
      .selectAll('.legend-item')
      .data(data)
      .join(
        (enter) => enter.append((datum) => new CategoryItem({ className: 'legend-item', style: datum })),
        (update) => update.each((shape, datum) => shape.update(datum)),
        (exit) => exit.remove()
      )
      .nodes() as CategoryItem[];

    this.idItem = new Map(items.map((item) => [item.getID(), item]));
  }

  protected paginator!: Pagination;

  protected drawPageNavigator() {
    const style = this.getPaginationAttrs();
    if (!style && this.paginator) this.paginator.remove();
    else if (!this.paginator) {
      this.paginator = this.appendChild(new Pagination({ className: 'legend-page-navigator', style }));
    } else {
      this.paginator.update(style);
    }
  }

  protected getTitleAttrs(): TextStyleProps {
    let { title } = this.attributes;
    if (!title) title = { content: '', formatter: () => '' };
    const { content, style = {}, formatter } = title!;

    return {
      ...TEXT_INHERITABLE_PROPS,
      textBaseline: 'top',
      ...style,
      x: 0,
      y: 0,
      text: formatter!(content!),
    };
  }

  protected getItemsAttrs(): ICategoryItemCfg[] {
    return this.itemsShapeCfg;
  }

  protected getPaginationAttrs(): PaginationStyleProps {
    const { orient, pageNavigator } = this.style;
    const { pageWidth = Number.MAX_VALUE, pageHeight = Number.MAX_VALUE, pageNum = 1 } = this;

    let position = pageNavigator && pageNavigator.button?.position;
    if (!position) position = orient === 'horizontal' ? 'right' : 'bottom';

    return deepMix(
      {},
      {
        x: 0,
        y: 0,
        orient: orient as any,
        pageNum,
        pageWidth,
        pageHeight,
        view: this.itemsGroup,
        button: {
          position,
        },
      },
      pageNavigator
    );
  }

  // ======== 之前的代码
  private get itemsShapeCfg(): ICategoryItemCfg[] {
    const {
      items: _items,
      itemWidth,
      maxWidth = Number.MAX_VALUE,
      maxItemWidth = Number.MAX_VALUE,
      itemMarker,
      itemName,
      itemValue,
      itemBackgroundStyle,
      reverse,
    } = this.style;
    const {
      itemMarker: defaultMarker,
      itemName: defaultName,
      itemValue: defaultValue,
      backgroundStyle: defaultBackgroundStyle,
    } = get(CATEGORY_DEFAULT_OPTIONS, ['style']);
    const cfg: ICategoryItemCfg[] = [];
    const items = _items.slice();
    if (reverse) items.reverse();

    items.forEach((item, idx) => {
      const { state = 'default', name: nameContent = '', value: valueContent = '', id = `legend-item-${idx}` } = item;
      cfg.push({
        x: 0,
        y: 0,
        id,
        state,
        itemWidth,
        maxItemWidth: min([maxItemWidth, maxWidth])!,
        itemMarker: isFunction(itemMarker) ? deepMix({}, defaultMarker, itemMarker(item, idx, items)) : itemMarker,
        itemName: (() => {
          const { formatter, style, spacing } = deepMix(
            {},
            defaultName,
            isFunction(itemName) ? itemName(item, idx, items) : itemName
          );
          return {
            style,
            spacing,
            content: formatter!(nameContent),
          };
        })(),
        itemValue: (() => {
          const { formatter, style, spacing } = deepMix(
            {},
            defaultValue,
            isFunction(itemValue) ? itemValue(item, idx, items) : itemValue
          );
          return {
            style,
            spacing,
            content: formatter!(valueContent),
          } as ICategoryItemCfg['itemValue'];
        })(),
        backgroundStyle: isFunction(itemBackgroundStyle)
          ? deepMix({}, defaultBackgroundStyle, itemBackgroundStyle(item, idx, items))
          : itemBackgroundStyle,
      });
    });
    return cfg;
  }

  public getItem(id: string): CategoryItem | undefined {
    return this.idItem.get(id);
  }

  /**
   * 设置某个item的状态
   * 会改变其样式
   */
  public setItemState(id: string, state: State) {
    this.getItem(id)?.setState(state);
  }

  /**
   * 获得items状态列表
   */
  public getItemsStates(): { id: string; state: State }[] {
    return Array.from(this.idItem.entries()).map(([id, item]) => ({ id, state: item.getState() }));
  }

  /** 分页相关配置 */
  private pageWidth: number | undefined;

  private pageHeight: number | undefined;

  private pageNum: number = 1;

  /**
   * 重置分页配置
   */
  private resetPageCfg() {
    this.pageWidth = undefined;
    this.pageHeight = undefined;
    this.pageNum = 1;
  }

  /**
   * 计算图例布局
   * https://www.yuque.com/antv/zb50wl/gzc4sg
   */
  private adjustLayout() {
    const { orient } = this.style;
    this.resetPageCfg();
    if (orient === 'horizontal') this.adjustHorizontal();
    else this.adjustVertical();

    const { padding } = this.style;
    const p = (Array.isArray(padding) ? padding : [padding]) as number[];
    let top = p[0];
    const left = p[1] ?? top;
    if (this.titleShape) {
      top += this.titleShape.getBBox().height + (this.style.title?.spacing || 0);
    }
    this.itemsGroup.setLocalPosition(left, top);
    if (this.paginator) {
      this.paginator.update({
        orient,
        x: left,
        y: top,
        pageHeight: this.pageHeight ?? Number.MAX_VALUE,
        pageWidth: this.pageWidth ?? Number.MAX_VALUE,
        pageNum: this.pageNum || 1,
      });
    }
  }

  private get itemHeight(): number {
    const item = Array.from(this.idItem.values())[0];
    return item ? getShapeSpace(item).height : 0;
  }

  private adjustHorizontal() {
    if (this.idItem.size <= 1) return;

    const items = Array.from(this.idItem.values());
    const { maxWidth, spacing: [offsetX] = [0, 0], autoWrap } = this.style;

    // Do not need paginate.
    if (!defined(maxWidth) || maxWidth === Infinity) {
      items.reduce((x, item) => {
        const { width } = getShapeSpace(item);
        item.setLocalPosition(x, 0);
        return x + width + offsetX;
      }, 0);
      return;
    }

    this.pageNum = 1;
    this.pageWidth = maxWidth;
    const position = this.getPaginationAttrs().button?.position || 'right';
    if (['left', 'right', 'left-right'].includes(position as any)) {
      const paginationWidth = this.paginator?.getBBox().width;
      this.pageWidth! -= paginationWidth;
    }

    if (!autoWrap) {
      this.pageHeight = this.itemHeight;
      items.reduce((x, item) => {
        const { width } = getShapeSpace(item);
        if (x + width > this.pageWidth! * this.pageNum) {
          x = this.pageWidth! * this.pageNum;
          this.pageNum += 1;
        }
        item.setLocalPosition(x, 0);
        return x + width;
      }, 0);

      return;
    }

    const maxRows = this.style.maxRows || Number.MAX_VALUE;
    let row = 1;
    let x = 0;
    let y = 0;
    this.pageHeight = this.itemHeight!;
    items.forEach((item) => {
      const { width, height } = getShapeSpace(item);
      if (x + width > this.pageWidth! * this.pageNum) {
        if (row === maxRows) {
          x = this.pageWidth! * this.pageNum;
          this.pageNum += 1;
          row = 1;
        } else {
          row += 1;
          x = this.pageWidth! * (this.pageNum - 1);
        }
        y = (row - 1) * this.itemHeight!;
        this.pageHeight = Math.max(this.pageHeight!, y + height);
      }
      item.setLocalPosition(x, y);
      x += width;
    });
  }

  private adjustVertical() {
    if (this.idItem.size <= 1) return;

    const items = Array.from(this.idItem.values());

    const { maxHeight, spacing: [offsetX, offsetY] = [0, 0], autoWrap } = this.style;
    // Do not need paginate.
    if (!defined(maxHeight) || maxHeight === Infinity) {
      items.reduce((y, item) => {
        const { height } = getShapeSpace(item);
        item.setLocalPosition(0, y);
        return y + height + offsetY;
      }, 0);
      return;
    }

    this.pageNum = 1;
    this.pageHeight = maxHeight;
    const position = this.getPaginationAttrs().button?.position || 'right';
    if (['top', 'bottom', 'top-bottom'].includes(position as any)) {
      const paginationH = this.paginator?.getBBox().height;
      this.pageHeight! -= paginationH;
    }

    this.pageHeight = Math.max(this.pageHeight!, this.itemHeight!);
    // [todo] autoWrap in vertical direction.
    let itemWidth = 0;
    items.reduce((y, item) => {
      const { width, height } = getShapeSpace(item);
      if (y + height > this.pageHeight! * this.pageNum) {
        y = this.pageHeight! * this.pageNum;
        this.pageNum += 1;
      }
      item.setLocalPosition(0, y);
      itemWidth = Math.max(itemWidth, width);
      return y + height;
    }, 0);
    this.pageWidth = Math.min(
      this.style.maxWidth ?? Number.MAX_VALUE,
      this.style.maxItemWidth ?? Number.MAX_VALUE,
      itemWidth
    );
  }

  private dispatchItemsChange() {
    const evt = new CustomEvent('valueChanged', {
      detail: {
        value: this.getItemsStates(),
      },
    });
    this.dispatchEvent(evt as any);
  }
}
