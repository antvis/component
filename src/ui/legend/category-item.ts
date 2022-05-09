import { Text, Rect, CustomEvent, RectStyleProps, Group } from '@antv/g';
import { deepMix, get, max } from '@antv/util';
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

type CategoryItemStyleProps = {
  id: string;
  x?: number;
  y?: number;
  itemWidth?: number;
  maxItemWidth?: number;
  state?: State;
  itemMarker: ItemMarkerCfg;
  itemName: ItemNameCfg;
  itemValue?: ItemValueCfg;
  background: {
    padding?: number | number[];
    style?: MixAttrs<ShapeAttrs>;
  };
};

type CategoryItemOptions = DisplayObjectConfig<CategoryItemStyleProps>;

export class CategoryItem extends GUI<CategoryItemStyleProps> {
  public pageIndex = 0;

  // marker
  private markerShape!: Marker;

  // name
  private nameShape!: Text;

  // value
  private valueShape!: Text;

  // background
  private backgroundShape!: Rect;

  private container!: Group;

  private prevState!: State;

  private get markerShapeCfg() {
    const { itemMarker } = this.style;
    const { symbol, size: markerSize } = itemMarker;
    return { symbol, size: markerSize, ...this.getStyle(['itemMarker', 'style']) };
  }

  private get nameShapeCfg() {
    const { itemName } = this.style;
    return { fontSize: 12, text: itemName?.content || '', ...this.getStyle(['itemName', 'style']) };
  }

  private get valueShapeCfg() {
    const { itemValue } = this.attributes;
    const { content: valueContent } = itemValue!;
    return {
      fontSize: 12,
      text: valueContent,
      ...this.getStyle(['itemValue', 'style']),
    };
  }

  private get backgroundShapeCfg(): RectStyleProps {
    return this.getStyle('background.style');
  }

  constructor({ style, ...rest }: CategoryItemOptions) {
    super({ style, ...rest });
    this.init();
  }

  public init() {
    // render backgroundShape
    this.backgroundShape = this.appendChild(
      new Rect({
        className: 'legend-item-background',
        zIndex: -1,
        style: this.backgroundShapeCfg,
      })
    );
    this.container = this.appendChild(new Group());
    // render markerShape
    this.markerShape = new Marker({
      className: 'legend-item-marker',
      style: this.markerShapeCfg,
    });
    this.container.appendChild(this.markerShape);
    // render nameShape
    this.nameShape = new Text({
      className: 'legend-item-name',
      style: {
        ...TEXT_INHERITABLE_PROPS,
        ...this.nameShapeCfg,
      },
    });
    this.container.appendChild(this.nameShape);
    // render valueShape
    this.valueShape = new Text({
      className: 'legend-item-value',
      style: {
        ...TEXT_INHERITABLE_PROPS,
        ...this.valueShapeCfg,
      },
    });
    this.container.appendChild(this.valueShape);
    this.adjustLayout();
    this.bindEvents();
  }

  public getState(): StyleState {
    return get(this.style, ['state']).split('-')[0];
  }

  /**
   * 设置图例项状态
   */
  public setState(state: State) {
    this.update({ state });
  }

  public getID(): string {
    return this.style.id;
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

  public update(cfg: Partial<CategoryItemStyleProps>) {
    const currState = this.getState();
    const { state: newState } = cfg;
    if ('state' in cfg && currState !== newState) {
      // 保存上次状态
      this.prevState = currState;
    }

    this.attr(deepMix({}, this.attributes, cfg));
    // update style
    this.markerShape.update(this.markerShapeCfg);
    this.nameShape.attr(this.nameShapeCfg);
    this.valueShape.attr(this.valueShapeCfg);
    this.backgroundShape.attr(this.backgroundShapeCfg);
    // adjustLayout
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

  protected bindEvents() {
    this.addEventListener('mouseleave', this.offHover.bind(this));
    this.addEventListener('mousemove', this.onHover.bind(this));
    this.addEventListener('click', this.onClick.bind(this));
  }

  protected getStyle(name: string | string[], state = this.style.state) {
    const style = get(this.style, name);
    const stateList = state ? (state.split('-') as StyleState[]) : [];
    return deepMix({}, getStateStyle(style, 'default'), ...stateList.map((s) => getStateStyle(style, s)));
  }

  protected adjustLayout() {
    // icon <-spacing-> name <-spacing-> value
    const { itemWidth, maxItemWidth, itemMarker, itemName, itemValue } = this.style;

    const _ = (v?: number): number => v || 0;
    const markerSize = _(itemMarker?.size);
    const maxWidth = Math.min(itemWidth ?? Number.MAX_VALUE, maxItemWidth ?? Number.MAX_VALUE);
    const height = max([markerSize, getShapeSpace(this.nameShape).height, getShapeSpace(this.valueShape).height])!;

    const y = height / 2;
    let x = markerSize / 2;
    this.markerShape.attr({ x, y });

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
      y,
      // 不可修改
      textBaseline: 'middle',
      visibility: noNameFlag ? 'hidden' : 'visible',
    });

    const nameTextWidth = noNameFlag ? 0 : getShapeSpace(this.nameShape).width;
    x += (itemWidth ? width1 : nameTextWidth) + nameValueSpacing;
    const align = itemValue?.align || 'left';
    this.valueShape.attr({
      text: valueText,
      x: itemWidth && align === 'right' ? itemWidth : x,
      y,
      // 不可修改
      textBaseline: 'middle',
      textAlign: itemWidth && align === 'right' ? 'end' : 'start',
      visibility: noValueFlag ? 'hidden' : 'visible',
    });

    // 设置背景
    const [top = 0, right = 0, bottom = top, left = right] = normalPadding(this.style.background?.padding);
    this.container.setLocalPosition(left, top);
    this.backgroundShape.attr({
      x: 0,
      y: 0,
      width: (itemWidth ?? this.container.getBBox().width) + left + right,
      height: this.container.getBBox().height + top + bottom,
    });
  }
}
