import { IElement, IGroup } from '@antv/g-base/lib/interfaces';
import { mix, upperFirst } from '@antv/util';
import { ISlider } from '../interfaces';
import { BBox, ContinueLegendCfg } from '../types';
import Theme from '../util/theme';
import { getValueByPercent } from '../util/util';
import LegendBase from './base';
const HANDLER_HEIGHT_RATIO = 1.4;
const HANDLER_TRIANGLE_RATIO = 0.4;

class ContinueLegend extends LegendBase<ContinueLegendCfg> implements ISlider {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'continue',
      min: 0,
      max: 100,
      value: null,
      colors: [],
      track: {},
      rail: {},
      label: {},
      handler: {},
      slidable: true,
      tip: null,
      step: null,
      maxWidth: null,
      maxHeight: null,
      defaultCfg: {
        label: {
          align: 'rail',
          spacing: 5, // 文本和 rail 的间距
          formatter: null,
          style: {
            fontSize: 12,
            fill: Theme.textColor,
            textBaseline: 'middle',
            fontFamily: Theme.fontFamily,
          },
        },
        handler: {
          size: 10, // handler 的默认宽度
          style: {
            fill: '#fff',
            stroke: '#333',
          },
        },
        track: {},
        rail: {
          type: 'color',
          size: 20,
          defaultLength: 100,
          style: {
            fill: '#DCDEE2',
          },
        },
        title: {
          spacing: 5,
          style: {
            fill: Theme.textColor,
            fontSize: 12,
            textAlign: 'start',
            textBaseline: 'top',
          },
        },
      },
    };
  }

  public isSlider() {
    return true;
  }

  // 实现 IList 接口
  public getValue() {
    return this.getCurrentValue();
  }

  public getRange() {
    return {
      min: this.get('min'),
      max: this.get('max'),
    };
  }

  // 改变 range
  public setRange(min, max) {
    this.update({
      min,
      max,
    });
  }

  public setValue(value: number[]) {
    this.set('value', value);
    const group = this.get('group');
    this.resetTrack(group);
    if (this.get('slidable')) {
      this.resetHandlers(group);
    }
  }

  protected initEvent() {
    const group = this.get('group');
    this.bindSliderEvent(group);
    this.bindRailEvent(group);
    this.bindTrackEvent(group);
  }

  protected drawLegendContent(group: IGroup) {
    this.drawRail(group);
    this.drawLabels(group);
    this.fixedElements(group); // 调整各个图形位置，适应宽高的限制
    this.resetTrack(group);
    if (this.get('slidable')) {
      this.resetHandlers(group);
    }
  }

  private bindSliderEvent(group) {
    this.bindHandlersEvent(group);
  }

  private bindHandlersEvent(group) {
    // let startPoint;
    // group.on(`legend-handler-min:dragstart`, ev => {
    //   startPoint = {
    //     x: ev.x,
    //     y: ev.y
    //   };
    // });
    // legend-handler-min:
    group.on('legend-handler-min:drag', (ev) => {
      const minValue = this.getValueByCanvasPoint(ev.x, ev.y);
      const currentValue = this.getCurrentValue();
      let maxValue = currentValue[1];
      if (maxValue < minValue) {
        // 如果小于最小值，则调整最小值
        maxValue = minValue;
      }
      this.setValue([minValue, maxValue]);
    });

    group.on('legend-handler-max:drag', (ev) => {
      const maxValue = this.getValueByCanvasPoint(ev.x, ev.y);
      const currentValue = this.getCurrentValue();
      let minValue = currentValue[0];
      if (minValue > maxValue) {
        // 如果小于最小值，则调整最小值
        minValue = maxValue;
      }
      this.setValue([minValue, maxValue]);
    });

    // group.on(`legend-handler-min:dragend`, ev => {
    //   startPoint = null;
    // });
  }

  private bindRailEvent(group) {}

  private bindTrackEvent(group) {}

  private drawLabels(group: IGroup) {
    this.drawLabel('min', group);
    this.drawLabel('max', group);
  }

  private drawLabel(name, group: IGroup) {
    const labelCfg = this.get('label');
    const style = labelCfg.style;
    const labelAlign = labelCfg.align;
    const value = this.get(name);
    const alignAttrs = this.getLabelAlignAttrs(name, labelAlign);
    const localId = `label-${name}`;
    this.addShape(group, {
      type: 'text',
      id: this.getElementId(localId),
      name: 'legend-label-${name}',
      attrs: {
        x: 0,
        y: 0,
        text: value,
        ...style,
        ...alignAttrs,
      },
    });
  }

  // 获取文本的对齐方式，为了自适应真实操碎了心
  private getLabelAlignAttrs(name, align) {
    const isVertical = this.isVertical();
    let textAlign = 'center';
    let textBaseline = 'middle';
    if (isVertical) {
      // 垂直布局的所有的文本都左对齐
      textAlign = 'start';
      if (align !== 'rail') {
        if (name === 'min') {
          textBaseline = 'top';
        } else {
          textBaseline = 'bottom';
        }
      } else {
        textBaseline = 'top';
      }
    } else {
      if (align !== 'rail') {
        textBaseline = 'top';
        if (name === 'min') {
          textAlign = 'start';
        } else {
          textAlign = 'end';
        }
      } else {
        textAlign = 'start';
        textBaseline = 'middle';
      }
    }
    return {
      textAlign,
      textBaseline,
    };
  }

  private drawRail(group: IGroup) {
    const railCfg = this.get('rail');
    const { size, defaultLength } = railCfg;
    const isVertical = this.isVertical();
    const length = defaultLength;
    const style = railCfg.style;
    this.addShape(group, {
      type: 'rect',
      id: this.getElementId('rail'),
      name: 'legend-rail',
      attrs: {
        x: 0,
        y: 0,
        width: isVertical ? size : length,
        height: isVertical ? length : size,
        ...style,
      },
    });
  }

  // 将传入的颜色转换成渐变色
  private getTrackColor(colors) {
    const count = colors.length;
    if (!count) {
      return null;
    }
    if (count === 1) {
      return colors[0];
    }
    let color; // 最终形态 l(0) 0:colors[0] 0.5:colors[1] 1:colors[2];
    if (this.isVertical()) {
      // 根据方向设置渐变方向
      color = 'l(90)';
    } else {
      color = 'l(0)';
    }
    for (let i = 0; i < count; i++) {
      const percent = i / (count - 1);
      color += ` ${percent}:${colors[i]}`;
    }
    return color;
  }
  private getTrackAttrs(min, max, group?: IGroup) {
    const railBBox = this.getRailBBox(group);
    const startPoint = this.getPointByValue(min, group);
    const endPoint = this.getPointByValue(max, group);
    const trackCfg = this.get('track');
    const colors = this.get('colors');
    let trackAttrs;
    if (this.isVertical()) {
      trackAttrs = {
        x: railBBox.minX,
        y: startPoint.y,
        width: railBBox.width,
        height: endPoint.y - startPoint.y,
      };
    } else {
      trackAttrs = {
        x: startPoint.x,
        y: railBBox.minY,
        width: endPoint.x - startPoint.x,
        height: railBBox.height,
      };
    }
    trackAttrs.fill = this.getTrackColor(colors);
    return mix(trackAttrs, trackCfg.style);
  }

  private resetTrack(group: IGroup) {
    const value = this.getCurrentValue();
    const [min, max] = value;
    const trackId = this.getElementId('track');
    const trackShape = group.findById(trackId);
    const trackAttrs = this.getTrackAttrs(min, max, group);
    if (trackShape) {
      trackShape.attr(trackAttrs);
    } else {
      this.addShape(group, {
        type: 'rect',
        id: trackId,
        name: 'legend-track',
        attrs: trackAttrs,
      });
    }
  }

  private getPointByValue(value, group?: IGroup) {
    const { min, max } = this.getRange();
    const percent = (value - min) / (max - min);
    const bbox = this.getRailBBox(group);
    const isVertcal = this.isVertical();
    const point = { x: 0, y: 0 };
    if (isVertcal) {
      point.x = bbox.minX + bbox.width / 2;
      point.y = getValueByPercent(bbox.minY, bbox.maxY, percent);
    } else {
      point.x = getValueByPercent(bbox.minX, bbox.maxX, percent);
      point.y = bbox.minY + bbox.height / 2;
    }
    return point;
  }
  // 获取滑轨的宽高信息
  private getRailBBox(group?: IGroup): BBox {
    const container = group || (this.get('group') as IGroup);
    const railShape = container.findById(this.getElementId('rail'));
    const bbox = railShape.getBBox();
    return bbox;
  }

  private getRailCanvasBBox(): BBox {
    const container = this.get('group');
    const railShape = container.findById(this.getElementId('rail'));
    const bbox = railShape.getCanvasBBox();
    return bbox;
  }

  // 是否垂直
  private isVertical(): boolean {
    return this.get('layout') === 'vertical';
  }

  // 用于交互时
  private getValueByCanvasPoint(x, y) {
    const { min, max } = this.getRange();
    const bbox = this.getRailCanvasBBox(); // 因为 x, y 是画布坐标
    const isVertcal = this.isVertical();
    const step = this.get('step');
    let percent;
    if (isVertcal) {
      // 垂直时计算 y
      percent = (y - bbox.minY) / bbox.height;
    } else {
      // 水平时计算 x
      percent = (x - bbox.minX) / bbox.width;
    }
    let value = getValueByPercent(min, max, percent);
    if (step) {
      const count = Math.round((value - min) / step);
      value = min + count * step; // 移动到最近的
    }
    if (value > max) {
      value = max;
    }
    if (value < min) {
      value = min;
    }
    return value;
  }

  // 当前选中的范围
  private getCurrentValue(): number[] {
    let value = this.get('value');
    if (!value) {
      // 如果没有定义，取最大范围
      value = [this.get('min'), this.get('max')];
    }
    return value;
  }

  // 重置滑块 handler
  private resetHandlers(group: IGroup) {
    const currentValue = this.getCurrentValue();
    const [min, max] = currentValue;
    this.resetHandler(group, 'min', min);
    this.resetHandler(group, 'max', max);
  }
  // 获取滑块的 path
  private getHandlerPath(handlerCfg, point) {
    const isVertical = this.isVertical();
    const path = [];
    const width = handlerCfg.size;
    const { x, y } = point;
    const height = width * HANDLER_HEIGHT_RATIO;
    const halfWidth = width / 2;
    const oneSixthWidth = width / 6;
    if (isVertical) {
      /**
       * 竖直情况下的滑块 handler，左侧顶点是 x,y
       *  /----|
       *    -- |
       *    -- |
       *  \----|
       */
      const triangleX = x + height * HANDLER_TRIANGLE_RATIO;
      path.push(['M', x, y]);
      path.push(['L', triangleX, y + halfWidth]);
      path.push(['L', x + height, y + halfWidth]);
      path.push(['L', x + height, y - halfWidth]);
      path.push(['L', triangleX, y - halfWidth]);
      path.push(['Z']);
      // 绘制两条横线
      path.push(['M', triangleX, y + oneSixthWidth]);
      path.push(['L', x + height - 2, y + oneSixthWidth]);
      path.push(['M', triangleX, y - oneSixthWidth]);
      path.push(['L', x + height - 2, y - oneSixthWidth]);
    } else {
      /**
       * 水平情况下的滑块，上面顶点处是 x,y
       *  /   \
       * | | | |
       * | | | |
       *  -----
       */
      const triangleY = y + height * HANDLER_TRIANGLE_RATIO;
      path.push(['M', x, y]);
      path.push(['L', x - halfWidth, triangleY]);
      path.push(['L', x - halfWidth, y + height]);
      path.push(['L', x + halfWidth, y + height]);
      path.push(['L', x + halfWidth, triangleY]);
      path.push(['Z']);
      // 绘制两条竖线
      path.push(['M', x - oneSixthWidth, triangleY]);
      path.push(['L', x - oneSixthWidth, y + height - 2]);
      path.push(['M', x + oneSixthWidth, triangleY]);
      path.push(['L', x + oneSixthWidth, y + height - 2]);
    }
    return path;
  }

  // 调整 handler 的位置，如果未存在则绘制
  private resetHandler(group: IGroup, name, value) {
    const point = this.getPointByValue(value, group);
    const handlerCfg = this.get('handler');
    const path = this.getHandlerPath(handlerCfg, point);
    const id = this.getElementId(`handler-${name}`);
    const handlerShape = group.findById(id);
    const isVertical = this.isVertical();
    if (handlerShape) {
      handlerShape.attr('path', path);
    } else {
      this.addShape(group, {
        type: 'path',
        name: `legend-handler-${name}`,
        draggable: true, // 可拖拽
        id,
        attrs: {
          path,
          ...handlerCfg.style,
          cursor: isVertical ? 'ns-resize' : 'ew-resize',
        },
      });
    }
  }

  // 当设置了 maxWidth, maxHeight 时调整 rail 的宽度，
  // 文本的位置
  private fixedElements(group: IGroup) {
    const railShape = group.findById(this.getElementId('rail'));
    const minLabel = group.findById(this.getElementId('label-min'));
    const maxLabel = group.findById(this.getElementId('label-max'));
    const startPoint = this.getDrawPoint();
    if (this.isVertical()) {
      // 横向布局
      this.fixedVertail(minLabel, maxLabel, railShape, startPoint);
    } else {
      // 水平布局
      this.fixedHorizontal(minLabel, maxLabel, railShape, startPoint);
    }
  }

  private fitRailLength(minLabelBBox, maxLabelBBox, railBBox, railShape) {
    const isVertical = this.isVertical();
    const lengthField = isVertical ? 'height' : 'width';
    const labelCfg = this.get('label');
    const labelAlign = labelCfg.align;
    const spacing = labelCfg.spacing;
    const maxLength = this.get(`max${upperFirst(lengthField)}`); // get('maxWidth')
    if (maxLength) {
      const elementsLength =
        labelAlign === 'rail'
          ? railBBox[lengthField] + minLabelBBox[lengthField] + maxLabelBBox[lengthField] + spacing * 2
          : railBBox[lengthField];
      const diff = elementsLength - maxLength;
      if (diff > 0) {
        // 大于限制的长度
        railShape.attr(lengthField, railBBox[lengthField] - diff);
      }
    }
  }

  private fixedHorizontal(minLabel: IElement, maxLabel: IElement, railShape: IElement, startPoint) {
    const labelCfg = this.get('label');
    const labelAlign = labelCfg.align;
    const spacing = labelCfg.spacing;
    let railBBox = railShape.getBBox();
    const minLabelBBox = minLabel.getBBox();
    const maxLabelBBox = maxLabel.getBBox();
    const railHeight = railBBox.height; // 取 rail 的高度，作为高度
    this.fitRailLength(minLabelBBox, maxLabelBBox, railBBox, railShape);
    railBBox = railShape.getBBox();
    if (labelAlign === 'rail') {
      // 沿着 rail 方向
      minLabel.attr({
        x: startPoint.x,
        y: startPoint.y + railHeight / 2,
      });
      railShape.attr({
        x: startPoint.x + minLabelBBox.width + spacing,
        y: startPoint.y,
      });
      maxLabel.attr({
        x: startPoint.x + minLabelBBox.width + railBBox.width + spacing * 2,
        y: startPoint.y + railHeight / 2,
      });
    } else if (labelAlign === 'top') {
      minLabel.attr({
        x: startPoint.x,
        y: startPoint.y,
      });
      maxLabel.attr({
        x: startPoint.x + railBBox.width,
        y: startPoint.y,
      });
      railShape.attr({
        x: startPoint.x,
        y: startPoint.y + minLabelBBox.height + spacing,
      });
    } else {
      railShape.attr({
        x: startPoint.x,
        y: startPoint.y,
      });
      minLabel.attr({
        x: startPoint.x,
        y: startPoint.y + railBBox.height + spacing,
      });
      maxLabel.attr({
        x: startPoint.x + railBBox.width,
        y: startPoint.y + railBBox.height + spacing,
      });
    }
  }

  private fixedVertail(minLabel: IElement, maxLabel: IElement, railShape: IElement, startPoint) {
    const labelCfg = this.get('label');
    const labelAlign = labelCfg.align;
    const spacing = labelCfg.spacing;
    let railBBox = railShape.getBBox();
    const minLabelBBox = minLabel.getBBox();
    const maxLabelBBox = maxLabel.getBBox();
    this.fitRailLength(minLabelBBox, maxLabelBBox, railBBox, railShape);
    railBBox = railShape.getBBox();

    if (labelAlign === 'rail') {
      // 沿着 rail 方向
      minLabel.attr({
        x: startPoint.x,
        y: startPoint.y,
      });
      railShape.attr({
        x: startPoint.x,
        y: startPoint.y + minLabelBBox.height + spacing,
      });
      maxLabel.attr({
        x: startPoint.x,
        y: startPoint.y + minLabelBBox.height + railBBox.height + spacing * 2,
      });
    } else if (labelAlign === 'right') {
      minLabel.attr({
        x: startPoint.x + railBBox.width + spacing,
        y: startPoint.y,
      });
      railShape.attr({
        x: startPoint.x,
        y: startPoint.y,
      });
      maxLabel.attr({
        x: startPoint.x + railBBox.width + spacing,
        y: startPoint.y + railBBox.height,
      });
    } else {
      // left
      const maxLabelWidth = Math.max(minLabelBBox.width, maxLabelBBox.width);
      minLabel.attr({
        x: startPoint.x,
        y: startPoint.y,
      });

      railShape.attr({
        x: startPoint.x + maxLabelWidth + spacing,
        y: startPoint.y,
      });
      maxLabel.attr({
        x: startPoint.x,
        y: startPoint.y + railBBox.height,
      });
    }
  }
}

export default ContinueLegend;
