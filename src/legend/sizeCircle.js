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
      type: 'size-circle-legend',
      width: 100,
      height: 200,
      /**
       * 不能滑动时圈的样式
       * @type {ATTRS}
       */
      _unslidableCircleStyle: {
        stroke: '#4E7CCC',
        fill: '#fff',
        fillOpacity: 0
      },
      /**
       * 滑块的样式
       * @type {ATTRS}
       */
      triggerStyle: {
        fill: 'white',
        shadowOffsetX: -2,
        shadowOffsetY: 2,
        shadowBlur: 10,
        shadowColor: '#ccc'
      },
      /**
       * 中间 bar 的前景颜色
       * @type {ATTRS}
       */
      frontMiddleBarStyle: {
        fill: 'rgb(64, 141, 251)'
      }
    });
  }

  // render the slider shape
  _renderSliderShape() {
    const minRadius = MIN_SIZE;
    const slider = this.get('slider');
    const backgroundElement = slider.get('backgroundElement');
    const layout = this.get('layout');
    const width = (layout === 'vertical') ? SLIDER_HEIGHT : this.get('width');
    const height = (layout === 'vertical') ? this.get('height') : SLIDER_HEIGHT;
    const x = minRadius;
    const y = this.get('height') / 2;
    const frontMiddleBarStyle = this.get('frontMiddleBarStyle');
    // background of middle bar
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
    }, frontMiddleBarStyle));
  }

  // triggers while layout === horizontal
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

  // triggers while layout === vertical
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

  // render the triggers
  _renderTrigger() {
    const min = this.get('firstItem');
    const max = this.get('lastItem');
    const layout = this.get('layout');
    const textStyle = this.get('textStyle');
    const triggerStyle = this.get('triggerStyle');
    const minBlockAttr = Util.mix({}, triggerStyle);
    const maxBlockAttr = Util.mix({}, triggerStyle);
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

  // user interactions
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

  // update the triggers
  _updateElement(min, max, minR, maxR) {
    // update the text of the triggers
    super._updateElement(min, max);
    const minTextElement = this.get('minTextElement');
    const maxTextElement = this.get('maxTextElement');
    const minCircleElement = this.get('minButtonElement');
    const maxCircleElement = this.get('maxButtonElement');

    // update the radius of the triggers
    minCircleElement.attr('r', minR);
    maxCircleElement.attr('r', maxR);

    // update the text position of the triggers
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

  // add a circle for slidable === false
  _addCircle(x, y, r, text, maxWidth) {
    const group = this.addGroup();
    const circleStyle = this.get('_unslidableCircleStyle');
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
    if (this.get('layout') === 'vertical') {
      group.addShape('text', {
        attrs: Util.mix({
          x: maxWidth + 15,
          y: y + titleGap,
          text: text === 0 ? '0' : text
        }, textStyle)
      });
    } else {
      group.addShape('text', {
        attrs: Util.mix({
          x,
          y: y + titleGap + maxWidth - 10,
          text: text === 0 ? '0' : text
        }, textStyle)
      });
    }
  }

  // the circles while slidable === false
  _renderUnslidable() {
    const minText = this.get('firstItem').attrValue;
    const maxText = this.get('lastItem').attrValue;
    const minRadius = this.get('firstItem').attrValue < (MIN_SIZE / 2) ? (MIN_SIZE / 2) : this.get('firstItem').attrValue;
    const maxRadius = this.get('lastItem').attrValue > (MAX_SIZE * 2) ? (MAX_SIZE * 2) : this.get('firstItem').attrValue;
    if (this.get('layout') === 'vertical') {
      this._addCircle(maxRadius, maxRadius, minRadius, minText, 2 * maxRadius); // min
      this._addCircle(maxRadius, maxRadius * 2 + CIRCLE_GAP + minRadius, maxRadius, maxText, 2 * maxRadius);  // max
    } else {
      this._addCircle(maxRadius, maxRadius, minRadius, minText, 2 * maxRadius); // min
      this._addCircle(maxRadius * 2 + CIRCLE_GAP + minRadius, maxRadius, maxRadius, maxText, 2 * maxRadius);  // max
    }

  }

}

module.exports = Size;
