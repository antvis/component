/**
 * @fileOverview The class of the gradient color legend
 * @author sima.zhang
 */
const { ColorUtil } = require('@antv/attr/lib'); // TODO：ColorUtil 包需要从 attr 包中抽离
const Util = require('../util');
const Continuous = require('./continuous');

class Color extends Continuous {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 类型
       * @type {String}
       */
      type: 'color-legend',
      /**
       * 布局方式
       * horizontal 水平
       * vertical 垂直
       * @type {String}
       */
      layout: 'vertical',
      labelOffset: 15,
      lineStyle: {
        lineWidth: 1,
        stroke: '#fff'
      },
      /**
       * 两头 trigger 的样式
       * @type {object}
       */
      triggerAttr: {
        fill: '#fff',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
        shadowColor: '#ccc',
        radius: 3
      },
      /**
       * 同一分段是否使用相同颜色而不使用渐变色，在 slidable = false 时生效
       * @type {boolean}
       */
      isSegment: false
    });
  }

  _renderSliderShape() {
    const slider = this.get('slider');
    const backgroundElement = slider.get('backgroundElement');
    const width = this.get('width');
    const height = this.get('height');
    const layout = this.get('layout');
    const items = this.get('items');
    let fill = '';
    let rgbColor;

    if (layout === 'vertical') {
      fill += 'l (90) ';
      Util.each(items, function(v) {
        rgbColor = ColorUtil.toRGB(v.attrValue);
        fill += (1 - v.percentage) + ':' + rgbColor + ' ';
      });
    } else {
      fill += 'l (0) ';
      Util.each(items, function(v) {
        rgbColor = ColorUtil.toRGB(v.attrValue);
        fill += v.percentage + ':' + rgbColor + ' ';
      });
    }
    return this._addMiddleBar(backgroundElement, 'Rect', {
      x: 0,
      y: 0,
      width,
      height,
      fill,
      strokeOpacity: 0
    });
  }

  _renderUnslidable() {
    const titleShape = this.get('titleShape');
    let titleGap = this.get('titleGap');
    titleGap = titleShape ? titleShape.getBBox().height + titleGap : titleGap;
    const width = this.get('width');
    const height = this.get('height');
    const layout = this.get('layout');
    const items = this.get('items');
    let fill = '';
    let rgbColor;

    const path = [];
    const bgGroup = this.addGroup();
    const isize = items.length;

    // sliderable = false 时的前景渐变色条
    if (layout === 'vertical') {
      fill += 'l (90) ';
      for (let i = 0; i < isize; i += 1) {
        if (i !== 0 && (i !== isize - 1)) {
          path.push([ 'M', 0, height - items[i].percentage * height ]);
          path.push([ 'L', width, height - items[i].percentage * height ]);
        }
        rgbColor = ColorUtil.toRGB(items[i].attrValue);
        fill += (1 - items[i].percentage) + ':' + rgbColor + ' ';
        if (this.get('isSegment') && i > 0) {
          const preRgbColor = ColorUtil.toRGB(items[i - 1].attrValue);
          fill += (1 - items[i].percentage) + ':' + preRgbColor + ' ';
        }
        bgGroup.addShape('text', {
          attrs: Util.mix({}, {
            x: width + this.get('labelOffset') / 2,
            y: height - items[i].percentage * height,
            text: this._formatItemValue(items[i].value) + '' // 以字符串格式展示
          }, this.get('textStyle'), {
            textAlign: 'start'
          })
        });
      }
    } else {
      fill += 'l (0) ';
      for (let i = 0; i < isize; i += 1) {
        if (i !== 0 && (i !== isize - 1)) {
          path.push([ 'M', items[i].percentage * width, 0 ]);
          path.push([ 'L', items[i].percentage * width, height ]);
        }
        rgbColor = ColorUtil.toRGB(items[i].attrValue);
        if (this.get('isSegment') && i > 0) {
          const preRgbColor = ColorUtil.toRGB(items[i - 1].attrValue);
          fill += items[i].percentage + ':' + preRgbColor + ' ';
        }
        fill += items[i].percentage + ':' + rgbColor + ' ';
        bgGroup.addShape('text', {
          attrs: Util.mix({}, {
            x: items[i].percentage * width,
            y: height + this.get('labelOffset'),
            text: this._formatItemValue(items[i].value) + '' // 以字符串格式展示
          }, this.get('textStyle'))
        });
      }
    }
    bgGroup.addShape('rect', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        fill,
        strokeOpacity: 0
      }
    });

    // bgGroup.addShape('path', {
    //   attrs: Util.mix({
    //     path
    //   }, this.get('lineStyle'))
    // });

    bgGroup.move(0, titleGap);
  }
}

module.exports = Color;
