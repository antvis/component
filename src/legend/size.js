/**
 * @fileOverview The class of the size legend
 * @author sima.zhang
 * @author ye liu
 */
const Util = require('../util');
// const Global = require('../../global');
const Continuous = require('./continuous');
const SLIDER_HEIGHT = 2;
const CIRCLE_GAP = 8;
const MAX_SIZE = 15;
const MIN_SIZE = 5;

class Size extends Continuous {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 类型
       * @type {String}
       */
      type: 'size-legend',
      width: 100,
      height: 200,
      _circleStyle: {
        stroke: '#4E7CCC',
        fill: '#fff',
        fillOpacity: 0
      },
      textStyle: {
        fill: '#333',
        textAlign: 'start',
        textBaseline: 'middle',
        fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"'// Global.fontFamily
      },
      inRange: {
        fill: 'white',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
        shadowColor: '#ccc'
      },
      inRangeSlider: {
        fill: 'rgb(64, 141, 251)'
      },
      backgroundCircle: {
        stroke: '#ccc',
        fill: 'white',
        lineWidth: 2
      }
    });
  }

  _renderSliderShape() {
    const minRadius = MIN_SIZE;
    // const maxRadius = MAX_SIZE;
    const slider = this.get('slider');
    const backgroundElement = slider.get('backgroundElement');
    const layout = this.get('layout');
    const width = (layout === 'vertical') ? SLIDER_HEIGHT : this.get('width');
    const height = (layout === 'vertical') ? this.get('height') : SLIDER_HEIGHT;
    const x = minRadius;
    const y = this.get('height') / 2;
    const inRangeSlider = this.get('inRangeSlider');

    // background bar
    const points = (layout === 'vertical') ? [
      [ 0, 0 ],
      [ width, 0 ],
      [ width, height ],
      [ 0, height ]
    ] : [
      [ 0, y + height ],
      [ 0, y - height ],
      [ x + width - 4, y - height ],
      [ x + width - 4, y + height ]
    ];
    return this._addMiddleBar(backgroundElement, 'Polygon', Util.mix({
      points
    }, inRangeSlider));
  }


  _addHorizontalTrigger(type, blockAttr, textAttr, radius) {
    const slider = this.get('slider');
    const trigger = slider.get(type + 'HandleElement');
    const y = -this.get('height') / 2;
    const button = trigger.addShape('circle', {
      attrs: Util.mix({
        x: 0,
        y,
        r: radius
      }, blockAttr)
    });
    const text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: 0,
        y: y + radius + 10,
        textAlign: 'center',
        textBaseline: 'middle'
      })
    });
    const layout = this.get('layout');
    const trigerCursor = layout === 'vertical' ? 'ns-resize' : 'ew-resize';
    button.attr('cursor', trigerCursor);
    text.attr('cursor', trigerCursor);
    this.set(type + 'ButtonElement', button);
    this.set(type + 'TextElement', text);
  }

  _addVerticalTrigger(type, blockAttr, textAttr, radius) {
    const slider = this.get('slider');
    const trigger = slider.get(type + 'HandleElement');
    const button = trigger.addShape('circle', {
      attrs: Util.mix({
        x: 0,
        y: 0,
        r: radius
      }, blockAttr)
    });
    const text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: radius + 10,
        y: 0,
        textAlign: 'start',
        textBaseline: 'middle'
      })
    });
    const layout = this.get('layout');
    const trigerCursor = layout === 'vertical' ? 'ns-resize' : 'ew-resize';
    button.attr('cursor', trigerCursor);
    text.attr('cursor', trigerCursor);
    this.set(type + 'ButtonElement', button);
    this.set(type + 'TextElement', text);
  }

  _renderTrigger() {
    const min = this.get('firstItem');
    const max = this.get('lastItem');
    const layout = this.get('layout');
    const textStyle = this.get('textStyle');
    const inRange = this.get('inRange');
    const minBlockAttr = Util.mix({}, inRange);
    const maxBlockAttr = Util.mix({}, inRange);
    const minRadius = MIN_SIZE;
    const maxRadius = MAX_SIZE;

    const minTextAttr = Util.mix({
      text: this._formatItemValue(min.value) + ''
    }, textStyle);
    const maxTextAttr = Util.mix({
      text: this._formatItemValue(max.value) + ''
    }, textStyle);
    if (layout === 'vertical') {
      this._addVerticalTrigger('min', minBlockAttr, minTextAttr, minRadius);
      this._addVerticalTrigger('max', maxBlockAttr, maxTextAttr, maxRadius);
    } else {
      this._addHorizontalTrigger('min', minBlockAttr, minTextAttr, minRadius);
      this._addHorizontalTrigger('max', maxBlockAttr, maxTextAttr, maxRadius);
    }
  }

  _bindUI() {
    if (this.get('slidable')) {
      const slider = this.get('slider');
      slider.on('sliderchange', ev => {
        const range = ev.range;
        const firstItemValue = this.get('firstItem').value;
        const lastItemValue = this.get('lastItem').value;
        const minValue = firstItemValue + (range[0] / 100) * (lastItemValue - firstItemValue);
        const maxValue = firstItemValue + (range[1] / 100) * (lastItemValue - firstItemValue);
        const minRadius = MIN_SIZE + (range[0] / 100) * (MAX_SIZE - MIN_SIZE);
        const maxRadius = MIN_SIZE + (range[1] / 100) * (MAX_SIZE - MIN_SIZE);
        this._updateElement(minValue, maxValue, minRadius, maxRadius);
        const itemFiltered = new Event('itemfilter', ev, true, true);
        itemFiltered.range = [ minValue, maxValue ];
        this.emit('itemfilter', itemFiltered);
      });
    }
  }

  _updateElement(min, max, minR, maxR) {
    const minTextElement = this.get('minTextElement');
    const maxTextElement = this.get('maxTextElement');
    const minCircleElement = this.get('minButtonElement');
    const maxCircleElement = this.get('maxButtonElement');
    if (max > 1) { // 对于大于 1 的值，默认显示为整数
      min = parseInt(min, 10);
      max = parseInt(max, 10);
    }
    minTextElement.attr('text', this._formatItemValue(min) + '');
    maxTextElement.attr('text', this._formatItemValue(max) + '');
    minCircleElement.attr('r', minR);
    maxCircleElement.attr('r', maxR);

    const layout = this.get('layout');
    if (layout === 'vertical') {
      minTextElement.attr('x', minR + 10);
      maxTextElement.attr('x', maxR + 10);
    } else {
      const y = -this.get('height') / 2;
      minTextElement.attr('y', y + minR + 10);
      maxTextElement.attr('y', y + maxR + 10);
    }
  }

  // not slidable
  _addCircle(x, y, r, text, maxWidth) {
    const group = this.addGroup();
    const circleStyle = this.get('_circleStyle');
    const textStyle = this.get('textStyle');
    const titleShape = this.get('titleShape');
    let titleGap = this.get('titleGap');

    if (titleShape) {
      titleGap += titleShape.getBBox().height;
    }

    group.addShape('circle', {
      attrs: Util.mix({
        x,
        y: y + titleGap,
        r: r === 0 ? 1 : r
      }, circleStyle)
    });
    group.addShape('text', {
      attrs: Util.mix({
        x: maxWidth + 5,
        y: y + titleGap,
        text: text === 0 ? '0' : text
      }, textStyle)
    });
  }

// slidable = false 时绘制三个圈
  _renderUnslidable() {
    const minRadius = this.get('firstItem').attrValue;
    const maxRadius = this.get('lastItem').attrValue;
    const medianRadius = (minRadius + maxRadius) / 2;
    this._addCircle(maxRadius, maxRadius, maxRadius, medianRadius, 2 * maxRadius);
    this._addCircle(maxRadius, maxRadius * 2 + CIRCLE_GAP + medianRadius, medianRadius, (minRadius + medianRadius) / 2, 2 * maxRadius);
    this._addCircle(maxRadius, (maxRadius + CIRCLE_GAP + medianRadius) * 2 + minRadius, minRadius, minRadius, 2 * maxRadius);
  }

}

module.exports = Size;
