import { Text, Rect } from '@antv/g';
import { deepMix, get, min, max } from '@antv/util';
import { Marker } from '../marker';
import { GUI } from '../core/gui';
import { getShapeSpace } from './utils';
import { getStateStyle, getEllipsisText, getFont } from '../../util';
import { NAME_VALUE_RATIO } from './constant';
import type { ShapeCfg, StyleState } from '../../types';
import type { CategoryItemCfg as ItemAttrs, State } from './types';

type CategoryItemCfg = ShapeCfg & {
  attrs: ItemAttrs;
};

export class CategoryItem extends GUI<ItemAttrs> {
  // marker
  private markerShape: Marker;

  // name
  private nameShape: Text;

  // value
  private valueShape: Text;

  // background
  private backgroundShape: Rect;

  private prevState: State;

  constructor({ attrs, ...rest }: CategoryItemCfg) {
    super({ type: 'categoryItem', attrs, ...rest });
    this.init();
  }

  attributeChangedCallback(name: string, value: any) {
    // 更新item
  }

  public init() {
    // render backgroundShape
    this.backgroundShape = new Rect({
      name: 'background',
      attrs: this.getBackgroundAttrs(),
    });
    this.appendChild(this.backgroundShape);
    // render markerShape
    this.markerShape = new Marker({
      name: 'marker',
      attrs: this.getMarkerAttrs(),
    });
    this.backgroundShape.appendChild(this.markerShape);
    // render nameShape
    this.nameShape = new Text({
      name: 'name',
      attrs: this.getNameAttrs(),
    });
    this.backgroundShape.appendChild(this.nameShape);
    // render valueShape
    this.valueShape = new Text({
      name: 'value',
      attrs: this.getValueAttrs(),
    });
    this.backgroundShape.appendChild(this.valueShape);
    this.backgroundShape.toBack();
    this.adjustLayout();
  }

  public getState(): StyleState {
    return get(this.attributes, ['state']).split('-')[0];
  }

  /**
   * 设置图例项状态
   */
  public setState(state: State) {
    this.update({ state });
  }

  public getID() {
    return this.getConfig().identify;
  }

  /**
   * 恢复到上次状态
   * 一般用于onHover事件
   */
  public onHover() {
    const currState = this.getState();
    this.setState(`${currState}-active` as State);
  }

  public onUnHover() {
    const currState = this.getState();
    this.setState(currState.split('-')[0] as StyleState);
  }

  public update(attrs: Partial<ItemAttrs>) {
    const currState = this.getState();
    const { state: newState } = attrs;
    if ('state' in attrs && currState !== newState) {
      // 保存上次状态
      this.prevState = currState;
    }

    this.attr(deepMix({}, this.attributes, attrs));
    // update attrs
    this.markerShape.attr(this.getMarkerAttrs());
    this.nameShape.attr(this.getNameAttrs());
    this.valueShape.attr(this.getValueAttrs());
    this.backgroundShape.attr(this.getBackgroundAttrs());
    // adjustLayout
    this.adjustLayout();
  }

  public clear() {}

  protected getStyle(name: string | string[], state = this.attributes.state) {
    const style = get(this.attributes, name);
    const stateList = state.split('-') as StyleState[];
    return deepMix({}, ...stateList.map((s) => getStateStyle(style, s, true)));
  }

  protected adjustLayout() {
    // icon <-spacing-> name <-spacing-> value
    const { itemWidth, maxItemWidth, itemMarker, itemName: name, itemValue: value } = this.attributes;
    const { content: nameContent, spacing: markerNameSpacing } = name;
    const { content: valueContent, spacing: nameValueSpacing } = value;

    const width = itemWidth || maxItemWidth || Infinity;
    // 计算每个元素的长度

    const { size: markerSize } = itemMarker;
    // 计算图例项高度（不用getShapeSpace获得的原因是文字需要垂直居中，需要使用middle对齐）
    const height = max([markerSize * 2, getShapeSpace(this.nameShape).height, getShapeSpace(this.valueShape).height]);

    // 计算name和value可用宽度
    const availableWidth = width - markerNameSpacing - nameValueSpacing - markerSize * 2;
    // name和value分得的空间
    const availableValueWidth = availableWidth / (NAME_VALUE_RATIO + 1);
    const availableNameWidth = NAME_VALUE_RATIO * availableValueWidth;

    // 得到缩略文本
    const ellipsisName = getEllipsisText(nameContent, availableNameWidth, getFont(this.nameShape));
    const ellipsisValue = getEllipsisText(valueContent, availableValueWidth, getFont(this.valueShape));

    const temp = markerSize * 2 + markerNameSpacing;

    this.nameShape.attr({ text: ellipsisName, x: temp, y: height / 2 });

    const { width: nWidth } = getShapeSpace(this.nameShape);
    this.valueShape.attr({
      text: ellipsisValue,
      x: temp + (itemWidth ? availableNameWidth : nWidth) + nameValueSpacing,
      y: height / 2,
    });

    this.markerShape.attr({
      x: markerSize,
      y: height / 2,
    });

    // 设置背景
    const bWidth = this.getActualWidth();
    this.backgroundShape.attr({
      width: itemWidth === undefined ? bWidth : itemWidth,
      height,
    });
  }

  private getMarkerAttrs() {
    const { itemMarker } = this.attributes;
    const { marker, size: markerSize } = itemMarker;
    return { symbol: marker, size: markerSize, ...this.getStyle(['itemMarker', 'style']) };
  }

  private getNameAttrs() {
    const { itemName } = this.attributes;
    const { content: nameContent } = itemName;
    return { text: nameContent, ...this.getStyle(['itemName', 'style']) };
  }

  private getValueAttrs() {
    const { itemValue } = this.attributes;
    const { content: valueContent } = itemValue;
    return {
      text: valueContent,
      ...this.getStyle(['itemValue', 'style']),
    };
  }

  private getBackgroundAttrs() {
    return { ...this.getStyle('backgroundStyle') };
  }

  private getActualWidth() {
    // 使用 getShapeSpace(this) 来获取当前容器宽度可能会由于文字抖动而导致长度不断增长
    const mBounds = this.markerShape.getBounds();
    const nBounds = this.nameShape.getBounds();
    const vBounds = this.valueShape.getBounds();
    const maxX = max([mBounds.getMax()[0], nBounds.getMax()[0], vBounds.getMax()[0]]);
    const minX = min([mBounds.getMin()[0], nBounds.getMin()[0], vBounds.getMin()[0]]);
    return maxX - minX;
  }
}
