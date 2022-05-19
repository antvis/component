import { Text, Rect, CustomEvent, Group, ElementEvent } from '@antv/g';
import { deepMix, get } from '@antv/util';
import { GUI } from '../../core/gui';
import {
  getStateStyle,
  getEllipsisText,
  getFont,
  getShapeSpace,
  TEXT_INHERITABLE_PROPS,
  normalPadding,
  measureTextWidth,
} from '../../util';
import type { DisplayObjectConfig, StyleState, ShapeAttrs, MixAttrs, TextProps } from '../../types';
import { Marker } from '../marker';
import { NAME_VALUE_RATIO } from './constant';
import type { State, SymbolCfg } from './types';

export type ItemMarkerCfg = {
  symbol?: SymbolCfg;
  size?: number;
  style?: MixAttrs<ShapeAttrs>;
};

export type ItemNameCfg = {
  content?: string;
  spacing?: number;
  style?: MixAttrs<Partial<TextProps>>;
};

export type ItemValueCfg = {
  content?: string;
  spacing?: number;
  align?: 'left' | 'right';
  style?: MixAttrs<Partial<TextProps>>;
};

export type CategoryItemStyleProps = {
  id: string;
  x?: number;
  y?: number;
  padding?: number | number[];
  itemWidth?: number;
  itemHeight?: number;
  maxItemWidth?: number;
  state?: State;
  itemMarker?: ItemMarkerCfg;
  itemName?: ItemNameCfg;
  itemValue?: ItemValueCfg;
  backgroundStyle?: MixAttrs<ShapeAttrs>;
};

type CategoryItemOptions = DisplayObjectConfig<CategoryItemStyleProps>;

export class CategoryItem extends GUI<CategoryItemStyleProps> {
  public pageIndex = 0;

  private markerShape!: Marker;

  private nameShape!: Text;

  private valueShape!: Text;

  private background!: Rect;

  private container!: Group;

  private prevState!: State;

  public static defaultOptions = {
    style: {
      itemName: {
        style: {
          default: {
            fontSize: 12,
          },
        },
      },
      itemValue: {
        style: {
          default: {
            fontSize: 12,
          },
        },
      },
    },
  };

  constructor(options: CategoryItemOptions) {
    super(deepMix({}, CategoryItem.defaultOptions, options));
    // init.
    this.background = this.appendChild(new Rect({ className: 'legend-item-background', zIndex: -1 }));
    this.container = this.appendChild(new Group());
    this.markerShape = this.container.appendChild(new Marker({ className: 'legend-item-marker' }));
    this.nameShape = this.container.appendChild(new Text({ className: 'legend-item-name' }));
    this.valueShape = this.container.appendChild(new Text({ className: 'legend-item-value' }));
  }

  public getState(): StyleState {
    return (get(this.style, ['state']) || '').split('-')[0] || 'default';
  }

  /**
   * 设置图例项状态
   */
  public setState(state: State) {
    this.update({ state });
  }

  public getID(): string {
    return this.id;
  }

  /**
   * 恢复到上次状态
   * 一般用于onHover事件
   */
  public onHover() {
    const currState = this.getState();
    this.setState(`${currState}-active` as State);
  }

  public offHover() {
    const currState = this.getState();
    this.setState(currState.split('-')[0] as StyleState);
  }

  connectedCallback() {
    this.update({});
    this.bindEvents();
  }

  attributeChangedCallback(name: keyof CategoryItemStyleProps, oldValue: any, newValue: any) {
    if (name === 'state') this.update();
    if (name === 'backgroundStyle') this.applyBackground();
    if (name === 'itemValue') this.applyItemValue();
    if (name === 'itemName') this.applyItemName();
    if (name === 'itemMarker') this.applyMarker();

    if (name === 'padding' || name === 'itemHeight') this.adjust();
    if (name === 'itemWidth') {
      this.adjust();
      this.adjustLayout();
    }
    if (name === 'maxItemWidth') this.adjustLayout();
  }

  /**
   * @deprecated
   */
  public update(cfg: Partial<CategoryItemStyleProps> = {}) {
    const currState = this.getState();
    const { state: newState } = cfg;
    if ('state' in cfg && currState !== newState) {
      // 保存上次状态
      this.prevState = currState;
    }
    this.attr(deepMix({}, this.attributes, cfg));
    // update style
    this.applyMarker();
    this.applyItemName();
    this.applyItemValue();
    this.applyBackground();
    this.adjustLayout();
  }

  public onClick() {
    const state = this.getState();
    if (!['selected', 'selected-active'].includes(state)) this.setState('selected-active');
    else this.setState('default-active');
    const evt = new CustomEvent('stateChange', {
      detail: { value: { id: this.getID(), state: this.getState() } },
    });
    this.dispatchEvent(evt as any);
  }

  private bindEvents() {
    this.addEventListener('mouseleave', this.offHover.bind(this));
    this.addEventListener('mousemove', this.onHover.bind(this));
    this.addEventListener('click', this.onClick.bind(this));

    this.container.addEventListener(ElementEvent.BOUNDS_CHANGED, () => this.adjust());
    this.nameShape.addEventListener(ElementEvent.BOUNDS_CHANGED, () => this.adjustLayout());
    this.valueShape.addEventListener(ElementEvent.BOUNDS_CHANGED, () => this.adjustLayout());
  }

  private adjust() {
    const { padding, itemWidth, itemHeight = 0 } = this.style;
    const [hw, hh] = this.container.getLocalBounds().halfExtents;
    const [top = 0, right = 0, bottom = top, left = right] = normalPadding(padding);
    const height = Math.max(itemHeight, hh * 2);
    this.container.setLocalPosition(left, top + height / 2);
    this.background.style.width = (itemWidth ?? hw * 2) + left + right;
    this.background.style.height = height + top + bottom;
  }

  private getStyle(name: string | string[], state = this.style.state) {
    const style = get(this.style, name);
    const stateList = state ? (state.split('-') as StyleState[]) : [];
    return deepMix({}, getStateStyle(style, 'default'), ...stateList.map((s) => getStateStyle(style, s)));
  }

  // [todo] refactor code later.
  private adjustLayout() {
    // icon <-spacing-> name <-spacing-> value
    const { itemWidth, maxItemWidth, itemMarker, itemName, itemValue } = this.style;

    const _ = (v?: number): number => v || 0;
    const markerSize = _(itemMarker?.size);
    const maxWidth = itemWidth ?? maxItemWidth ?? Number.MAX_VALUE;
    let x = markerSize / 2;

    // 是否显示 name 和 value
    const noNameFlag = !itemName?.content;
    const noValueFlag = !itemValue?.content;
    const nameValueSpacing = noNameFlag ? 0 : _(itemValue?.spacing);
    const availableWidth = maxWidth - markerSize - _(itemName?.spacing) - _(itemValue?.spacing);

    // name和value分得的空间
    const font1 = getFont(this.nameShape);
    const font2 = getFont(this.valueShape);

    const nameWidth = noNameFlag ? 0 : measureTextWidth(itemName.content, font1);
    const valueWidth = noValueFlag ? 0 : measureTextWidth(itemValue.content, font2);
    let nameText;
    let valueText;
    let [width1, width2] = [nameWidth, valueWidth];
    if (nameWidth + valueWidth > availableWidth) {
      [width1, width2] = [availableWidth * NAME_VALUE_RATIO, availableWidth * (1 - NAME_VALUE_RATIO)];
      if (nameWidth > valueWidth) {
        width2 = Math.min(valueWidth, width2);
        width1 = availableWidth - width2;
      } else {
        width1 = Math.min(nameWidth, width1);
        width2 = availableWidth - width1;
      }
      nameText = noNameFlag ? '' : getEllipsisText(itemName.content, width1, font1);
      valueText = noValueFlag ? '' : getEllipsisText(itemValue.content, width2, font2);
    }

    x += markerSize / 2 + (itemName?.spacing || 0);
    this.nameShape.attr({
      text: nameText,
      x,
      visibility: noNameFlag ? 'hidden' : 'visible',
    });

    const nameTextWidth = noNameFlag ? 0 : getShapeSpace(this.nameShape).width;
    x += (itemWidth ? width1 : nameTextWidth) + nameValueSpacing;
    const align = itemValue?.align || 'left';
    this.valueShape.attr({
      text: valueText,
      x: itemWidth && align === 'right' ? itemWidth : x,
      textAlign: itemWidth && align === 'right' ? 'end' : 'start',
      visibility: noValueFlag ? 'hidden' : 'visible',
    });
  }

  private applyMarker() {
    const { itemMarker } = this.style;
    if (!itemMarker) {
      this.markerShape.style.size = 0;
      return;
    }
    const { symbol, size: markerSize = 0 } = itemMarker;
    this.markerShape.attr({ x: markerSize / 2, symbol, size: markerSize, ...this.getStyle(['itemMarker', 'style']) });
  }

  private applyItemName() {
    const { itemName } = this.style;
    if (!itemName) {
      this.nameShape.style.fontSize = 0;
      return;
    }
    const style = this.getStyle(['itemName', 'style']);
    this.nameShape.attr({ ...TEXT_INHERITABLE_PROPS, text: itemName.content || '', ...style, textBaseline: 'middle' });
  }

  private applyItemValue() {
    const { itemValue } = this.style;
    if (!itemValue) {
      this.valueShape.style.fontSize = 0;
      return;
    }
    const style = this.getStyle(['itemValue', 'style']);
    this.valueShape.attr({
      ...TEXT_INHERITABLE_PROPS,
      text: itemValue.content || '',
      ...style,
      textBaseline: 'middle',
    });
  }

  private applyBackground() {
    this.background.attr(this.getStyle('backgroundStyle'));
  }
}
