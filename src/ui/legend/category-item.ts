import { Text, Rect } from '@antv/g';
import { deepMix, get, max } from '@antv/util';
import { GUI } from '../../core/gui';
import { Marker } from '../marker';
import { NAME_VALUE_RATIO } from './constant';
import { getStateStyle, getEllipsisText, getFont, getShapeSpace } from '../../util';
import type { DisplayObjectConfig, StyleState, ShapeAttrs } from '../../types';
import type { CategoryItemCfg as ItemCfg, State } from './types';

export interface ICategoryItemCfg extends ShapeAttrs, Required<ItemCfg> {}

type CategoryItemOptions = DisplayObjectConfig<ICategoryItemCfg>;

export class CategoryItem extends GUI<ICategoryItemCfg> {
  // marker
  private markerShape!: Marker;

  // name
  private nameShape!: Text;

  // value
  private valueShape!: Text;

  // background
  private backgroundShape!: Rect;

  private prevState!: State;

  private get markerShapeCfg() {
    const { itemMarker } = this.attributes;
    const { marker, spacing, size: markerSize } = itemMarker;
    return { x: spacing, symbol: marker, size: markerSize, ...this.getStyle(['itemMarker', 'style']) };
  }

  private get nameShapeCfg() {
    const { itemName } = this.attributes;
    const { content: nameContent } = itemName;
    return { text: nameContent, ...this.getStyle(['itemName', 'style']) };
  }

  private get valueShapeCfg() {
    const { itemValue } = this.attributes;
    const { content: valueContent } = itemValue;
    return {
      text: valueContent,
      ...this.getStyle(['itemValue', 'style']),
    };
  }

  private get backgroundShapeCfg() {
    return { ...this.getStyle('backgroundStyle') };
  }

  private get actualWidth() {
    const { itemName, itemValue } = this.attributes;
    const { width: markerWidth } = getShapeSpace(this.markerShape);
    const { width: nameWidth } = getShapeSpace(this.nameShape);
    const { width: valueWidth } = getShapeSpace(this.valueShape);
    return markerWidth * 2 + nameWidth + valueWidth + itemName.spacing! + itemValue.spacing!;
  }

  constructor({ style, ...rest }: CategoryItemOptions) {
    super({ type: 'categoryItem', style, ...rest });
    this.init();
  }

  public init() {
    // render backgroundShape
    this.backgroundShape = new Rect({
      name: 'background',
      style: this.backgroundShapeCfg,
    });
    this.appendChild(this.backgroundShape);
    // render markerShape
    this.markerShape = new Marker({
      name: 'marker',
      style: this.markerShapeCfg,
    });
    this.backgroundShape.appendChild(this.markerShape);
    // render nameShape
    this.nameShape = new Text({
      name: 'name',
      style: this.nameShapeCfg,
    });
    this.backgroundShape.appendChild(this.nameShape);
    // render valueShape
    this.valueShape = new Text({
      name: 'value',
      style: this.valueShapeCfg,
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
    const { identify } = this.attributes;
    return identify;
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

  public update(cfg: Partial<ICategoryItemCfg>) {
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

  public clear() {}

  protected getStyle(name: string | string[], state = this.attributes.state) {
    const style = get(this.attributes, name);
    const stateList = state.split('-') as StyleState[];
    return deepMix({}, ...stateList.map((s) => getStateStyle(style, s)));
  }

  protected adjustLayout() {
    // icon <-spacing-> name <-spacing-> value
    const { itemWidth, maxItemWidth, itemMarker, itemName: name, itemValue: value } = this.attributes;
    const { content: nameContent, spacing: markerNameSpacing } = name as { content: string; spacing: number };
    const { content: valueContent, spacing: nVSpacing } = value as { content: string; spacing: number };

    /**
     * 是否显示 name 和 value
     */
    const noNameFlag = nameContent === '' || nameContent === undefined;
    const noValueFlag = valueContent === '' || valueContent === undefined;
    const nameValueSpacing = noNameFlag ? 0 : nVSpacing;

    const width = itemWidth || maxItemWidth || Infinity;
    // 计算每个元素的长度

    const { size: markerSize } = itemMarker as { size: number };
    // 计算图例项高度（不用getShapeSpace获得的原因是文字需要垂直居中，需要使用middle对齐）
    const height = max([markerSize * 2, getShapeSpace(this.nameShape).height, getShapeSpace(this.valueShape).height])!;

    // 计算name和value可用宽度
    const availableWidth = width - markerNameSpacing - nameValueSpacing - markerSize * 2;

    // name和value分得的空间
    const availableValueWidth = noValueFlag ? 0 : availableWidth * NAME_VALUE_RATIO;
    const availableNameWidth = noNameFlag ? 0 : availableWidth * (1 - NAME_VALUE_RATIO);

    // 得到缩略文本
    const nameText = noNameFlag ? '' : getEllipsisText(nameContent, availableNameWidth, getFont(this.nameShape));
    const valueText = noValueFlag ? '' : getEllipsisText(valueContent, availableValueWidth, getFont(this.valueShape));

    const temp = markerSize * 2 + markerNameSpacing;

    this.nameShape.attr({ text: nameText, x: temp, y: height / 2, visibility: noNameFlag ? 'hidden' : 'visible' });

    const nameTextWidth = noNameFlag ? 0 : getShapeSpace(this.nameShape).width;
    this.valueShape.attr({
      text: valueText,
      x: temp + (itemWidth ? availableNameWidth : nameTextWidth) + nameValueSpacing,
      y: height / 2,
      visibility: noValueFlag ? 'hidden' : 'visible',
    });

    this.markerShape.attr({
      x: markerSize,
      y: height / 2,
    });

    // 设置背景
    this.backgroundShape.attr({
      width: itemWidth === undefined ? this.actualWidth : itemWidth,
      height,
    });
  }
}
