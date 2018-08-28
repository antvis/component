/**
 * @fileOverview The base class of continuous legend
 * @author sima.zhang
 */
const Util = require('../util');
// const Global = require('../../global');
const Legend = require('./base');
const Event = Util.Event;
const Group = Util.Group;
const Slider = require('./slider');
const TRIGGER_WIDTH = 12;

class Continuous extends Legend {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 类型
       * @type {String}
       */
      type: 'continuous-legend',
      /**
       * 子项
       * @type {Array}
       */
      items: null,
      /**
       * 布局方式
       * horizontal 水平
       * vertical 垂直
       * @type {String}
       */
      layout: 'vertical',
      /**
       * 宽度
       * @type {Number}
       */
      width: 20,
      /**
       * 高度
       * @type {Number}
       */
      height: 156,
      /**
       * 标题偏移量
       * @type {Number}
       */
      titleGap: 15,
      /**
       * 默认文本图形属性
       * @type {ATTRS}
       */
      textStyle: {
        fill: '#333',
        textAlign: 'center',
        textBaseline: 'middle',
        fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"' // Global.fontFamily
      },
      /**
       * 连续图例是否可滑动
       * @type {Boolean}
       */
      slidable: true,
      /**
       * 滑块的样式
       * @type {ATTRS}
       */
      triggerAttr: {
        fill: '#4E7CCC' // '#4E7CCC'
      },
      /**
       * slider 的范围
       * @type {array}}
       */
      _range: [ 0, 100 ],
      /**
       * 中间 bar 背景灰色
       * @type {ATTRS}
       */
      middleBackgroundStyle: {
        fill: '#D9D9D9'
      },
      labelOffset: 10 // ToDO: 文本同渐变背景的距离
    });
  }

  _calStartPoint() {
    const start = {
      x: 10,
      y: this.get('titleGap') - TRIGGER_WIDTH
    };
    const titleShape = this.get('titleShape');
    if (titleShape) {
      const titleBox = titleShape.getBBox();
      start.y += titleBox.height;
    }

    return start;
  }

  _beforeRenderUI() {
    const items = this.get('items');
    if (!Util.isArray(items) || Util.isEmpty(items)) {
      return;
    }
    super._beforeRenderUI();
    this.set('firstItem', items[0]);
    this.set('lastItem', items[items.length - 1]);
  }

  _formatItemValue(value) {
    const formatter = this.get('itemFormatter');
    if (formatter) {
      value = formatter.call(this, value);
    }
    return value;
  }

  _renderUI() {
    super._renderUI();
    if (this.get('slidable')) {
      this._renderSlider();
    } else {
      this._renderUnslidable();
    }
  }

  _renderSlider() {
    const minHandleElement = new Group();
    const maxHandleElement = new Group();
    const backgroundElement = new Group();
    const start = this._calStartPoint();
    const slider = this.addGroup(Slider, {
      minHandleElement,
      maxHandleElement,
      backgroundElement,
      layout: this.get('layout'),
      range: this.get('_range'),
      width: this.get('width'),
      height: this.get('height')
    });
    slider.translate(start.x, start.y);
    this.set('slider', slider);

    const shape = this._renderSliderShape();
    shape.attr('clip', slider.get('middleHandleElement'));
    this._renderTrigger();
  }

  // render the slider shape, must be implemented in children class
  _renderSliderShape() {
  }
  // render the slider while slidable === false, must be implemented in children class
  _renderUnslidable() {
  }

  _addMiddleBar(parent, name, attrs) {
    // background of the middle bar
    parent.addShape(name, {
      attrs: Util.mix({}, attrs, this.get('middleBackgroundStyle'))
    });
    // frontground of the middle bar
    return parent.addShape(name, {
      attrs
    });
  }

  _renderTrigger() {
    const min = this.get('firstItem');
    const max = this.get('lastItem');
    const layout = this.get('layout');
    const textStyle = this.get('textStyle');
    const triggerAttr = this.get('triggerAttr');
    // const attrType = this.get('type');

    const minBlockAttr = Util.mix({}, triggerAttr);
    const maxBlockAttr = Util.mix({}, triggerAttr);

    const minTextAttr = Util.mix({
      text: this._formatItemValue(min.value) + ''
    }, textStyle);
    const maxTextAttr = Util.mix({
      text: this._formatItemValue(max.value) + ''
    }, textStyle);
    if (layout === 'vertical') {
      this._addVerticalTrigger('min', minBlockAttr, minTextAttr);
      this._addVerticalTrigger('max', maxBlockAttr, maxTextAttr);
    } else {
      this._addHorizontalTrigger('min', minBlockAttr, minTextAttr);
      this._addHorizontalTrigger('max', maxBlockAttr, maxTextAttr);
    }
  }

  _addVerticalTrigger(type, blockAttr, textAttr) {
    const slider = this.get('slider');
    const trigger = slider.get(type + 'HandleElement');
    const width = this.get('width');
    const button = trigger.addShape('rect', {
      attrs: Util.mix({
        x: (width / 2 - TRIGGER_WIDTH - 2),
        y: type === 'min' ? 0 : TRIGGER_WIDTH - 3 * width / 2,
        width: 2 * TRIGGER_WIDTH + 2,
        height: TRIGGER_WIDTH
      }, blockAttr)
    });
    const text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: width + 8,
        y: type === 'max' ? -4 : 4,
        textAlign: 'start',
        lineHeight: 1,
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

  _addHorizontalTrigger(type, blockAttr, textAttr) {
    const slider = this.get('slider');
    const trigger = slider.get(type + 'HandleElement');
    const button = trigger.addShape('rect', {
      attrs: Util.mix({
        x: type === 'min' ? -TRIGGER_WIDTH : 0,
        y: -TRIGGER_WIDTH - 8,
        width: TRIGGER_WIDTH,
        height: 2 * TRIGGER_WIDTH
      }, blockAttr)
    });
    const text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: type === 'min' ? -TRIGGER_WIDTH - 4 : TRIGGER_WIDTH + 4,
        y: TRIGGER_WIDTH / 2,
        textAlign: type === 'min' ? 'end' : 'start',
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

  _bindUI() {
    if (this.get('slidable')) {
      const slider = this.get('slider');
      slider.on('sliderchange', ev => {
        const range = ev.range;
        const firstItemValue = this.get('firstItem').value;
        const lastItemValue = this.get('lastItem').value;
        const minValue = firstItemValue + (range[0] / 100) * (lastItemValue - firstItemValue);
        const maxValue = firstItemValue + (range[1] / 100) * (lastItemValue - firstItemValue);
        this._updateElement(minValue, maxValue);
        const itemFiltered = new Event('itemfilter', ev, true, true);
        itemFiltered.range = [ minValue, maxValue ];
        this.emit('itemfilter', itemFiltered);
      });
    }
  }

  // update the text of min and max trigger
  _updateElement(min, max) {
    const minTextElement = this.get('minTextElement');
    const maxTextElement = this.get('maxTextElement');
    if (max > 1) { // 对于大于 1 的值，默认显示为整数
      min = parseInt(min, 10);
      max = parseInt(max, 10);
    }
    minTextElement.attr('text', this._formatItemValue(min) + '');
    maxTextElement.attr('text', this._formatItemValue(max) + '');
  }
}

module.exports = Continuous;
