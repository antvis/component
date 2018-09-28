const Util = require('../util');
const DomUtil = Util.DomUtil;
const Component = require('../component');
const positionAdjust = require('./utils/position-adjust');
const spirialAdjust = require('./utils/spiral-adjust');

const LAYOUTS = {
  scatter: positionAdjust,
  map: spirialAdjust,
  treemap: canLabelFill
};

function canLabelFill(labels, shapes) {
  let labelBBox,
    shapeBBox;
  const toBeRemoved = [];
  for (let i = 0; i < labels.length; i++) {
    labelBBox = labels[i].getBBox();
    shapeBBox = shapes[i].getBBox();
    if (labelBBox.width * labelBBox.height > shapeBBox.width * shapeBBox.height) {
      toBeRemoved.push(labels[i]);
    }
  }
  for (let i = 0; i < toBeRemoved.length; i++) {
    toBeRemoved[i].remove();
  }
}

class Label extends Component {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      name: 'label',
      /**
       * label类型
       * @type {(String)}
       */
      type: 'default',
      /**
       * 默认文本样式
       * @type {Array}
       */
      textStyle: null,
      /**
       * 文本显示格式化回调函数
       * @type {Function}
       */
      formatter: null,
      /**
       * 显示的文本集合
       * @type {Array}
       */
      items: null,
      /**
       * 是否使用html渲染label
       * @type {String}
       */
      useHtml: false,
      /**
       * html 渲染时用的容器的模板，必须存在 class = "g-labels"
       * @type {String}
       */
      containerTpl: '<div class="g-labels" style="position:absolute;top:0;left:0;"></div>',
      /**
       * html 渲染时单个 label 的模板，必须存在 class = "g-label"
       * @type {String}
       */
      itemTpl: '<div class="g-label" style="position:absolute;">{text}</div>',
      /**
       * label牵引线定义
       * @type {String || Object}
       */
      labelLine: false,
      /**
       * label牵引线容器
       * @type Object
       */
      lineGroup: null,
      /**
       * 需添加label的shape
       * @type Object
       */
      shapes: null
    });
  }

  /*
   * 清空label容器
   */
  clear() {
    const group = this.get('group');
    const container = this.get('container');
    if (group && !group.get('destroyed')) {
      group.clear();
    }
    if (container) {
      container.innerHTML = '';
    }
    super.clear();
  }

  /**
   * 销毁group
   */
  destroy() {
    const group = this.get('group');
    const container = this.get('container');
    if (!group.destroy) {
      group.destroy();
    }
    if (container) {
      container.innerHTML = '';
    }
  }

  /**
   * label绘制全过程
   */
  render() {
    this.clear();
    this._init();
    this.beforeDraw();
    this.draw();
    this.afterDraw();
  }

  _dryDraw() {
    const self = this;
    const items = self.get('items');
    const children = self.getLabels();
    const count = children.length;
    Util.each(items, (item, index) => {
      if (index < count) {
        const label = children[index];
        self.changeLabel(label, item);
      } else {
        const labelShape = self._addLabel(item);
        if (labelShape) {
          labelShape._id = item._id;
          labelShape.set('coord', item.coord);
        }
      }
    });
    for (let i = count - 1; i >= items.length; i--) {
      children[i].remove();
    }
    self._adjustLabels();
    if (self.get('labelLine') || (items && items.length && items[0].labelLine)) {
      self.drawLines();
    }
  }

  /**
   * 更新label
   * 1. 将items与group中的children对比，更新/新增/删除labels
   * 2. labels布局优化
   * 3. 画label连接线
   * 4. 绘制到画布
   */
  draw() {
    this._dryDraw();
    this.get('canvas').draw();
  }

  /*
   * 更新label
   * oldLabel shape或label dom
   * newLabel label data
   * index items中的下标
   */
  changeLabel(oldLabel, newLabel) {
    if (!oldLabel) {
      return;
    }
    if (this.get('useHtml')) {
      const node = this._createDom(newLabel);
      oldLabel.innerHTML = node.innerHTML;
      this._setCustomPosition(newLabel, oldLabel);
    } else {
      oldLabel._id = newLabel._id;
      oldLabel.attr('text', newLabel.text);
      if (oldLabel.attr('x') !== newLabel.x || oldLabel.attr('y') !== newLabel.y) {
        const rotate = oldLabel.get('attrs').rotate;
        if (rotate) {
          oldLabel.rotateAtStart(-rotate);
          oldLabel.attr(newLabel);
          oldLabel.rotateAtStart(rotate);
        } else {
          oldLabel.attr(newLabel);
        }
      }
    }
  }

  /**
   * 显示label
   */
  show() {
    const group = this.get('group');
    const container = this.get('container');
    if (group) {
      group.show();
    }
    if (container) {
      container.style.opacity = 1;
    }
  }
  /**
   * 隐藏label
   */
  hide() {
    const group = this.get('group');
    const container = this.get('container');
    if (group) {
      group.hide();
    }
    if (container) {
      container.style.opacity = 0;
    }
  }

  /**
   * 画label连接线
   */
  drawLines() {
    const self = this;
    const lineStyle = self.get('labelLine');
    if (typeof lineStyle === 'boolean') {
      self.set('labelLine', {});
    }
    let lineGroup = self.get('lineGroup');
    if (!lineGroup || lineGroup.get('destroyed')) {
      lineGroup = self.get('group').addGroup({
        elCls: 'x-line-group'
      });
      self.set('lineGroup', lineGroup);
    } else {
      lineGroup.clear();
    }
    Util.each(self.get('items'), label => {
      self.lineToLabel(label, lineGroup);
    });
  }
  lineToLabel(label, lineGroup) {
    const self = this;
    const lineStyle = label.labelLine || self.get('labelLine');
    let path = lineStyle.path;
    if (path && Util.isFunction(lineStyle.path)) {
      path = lineStyle.path(label);
    }
    if (!path) {
      const start = {
        x: label.x - label._offset.x,
        y: label.y - label._offset.y
      };
      path = [
        [ 'M', start.x, start.y ],
        [ 'L', label.x, label.y ]
      ];
    }
    const lineShape = lineGroup.addShape('path', {
      attrs: Util.mix({
        path,
        fill: null,
        stroke: label.color || '#000'
      }, lineStyle)
    });
    // label 对应线的动画关闭
    lineShape.name = 'labelLine';
    // generate labelLine id according to label id
    lineShape._id = label._id && label._id.replace('glabel', 'glabelline');
    lineShape.set('coord', self.get('coord'));
  }

  // 根据type对label布局
  _adjustLabels() {
    const self = this;
    const type = self.get('type');
    const labels = self.getLabels();
    const shapes = self.get('shapes');
    const layout = LAYOUTS[type];
    if (type === 'default' || !layout) {
      return;
    }
    layout(labels, shapes);
  }

  /**
   * 获取当前所有label实例
   * @return {Array} 当前label实例
   */
  getLabels() {
    const container = this.get('container');
    if (container) {
      return Util.toArray(container.childNodes);
    }
    return this.get('group').get('children');
  }

  // 先计算label的所有配置项，然后生成label实例
  _addLabel(item, index) {
    const cfg = this._getLabelCfg(item, index);
    return this._createText(cfg);
  }
  _getLabelCfg(item, index) {
    let textStyle = this.get('textStyle') || {};
    const formatter = this.get('formatter');
    const htmlTemplate = this.get('htmlTemplate');
    // 如果是 geom.label(fields, () => {...}) 形式定义的label,mix自定义样式后直接画
    if (item._offset && item.textStyle) {
      item.textStyle = Util.mix({}, textStyle, item.textStyle);
      return item;
    }

    if (!Util.isObject(item)) {
      const tmp = item;
      item = {};
      item.text = tmp;
    }

    if (Util.isFunction(textStyle)) {
      textStyle = textStyle(item.text, item, index);
    }

    if (formatter) {
      item.text = formatter(item.text, item, index);
    }

    if (Util.isFunction(htmlTemplate)) {
      item.text = htmlTemplate(item.text, item, index);
    }

    if (Util.isNil(item.text)) {
      item.text = '';
    }

    item.text = item.text + ''; // ? 为什么转换为字符串
    const cfg = Util.mix({}, item, textStyle, {
      x: item.x || 0,
      y: item.y || 0
    });

    return cfg;
  }
  /**
   * label初始化，主要针对html容器
   */
  _init() {
    if (!this.get('group')) {
      const group = this.get('canvas').addGroup({ id: 'label-group' });
      this.set('group', group);
    }
  }
  initHtmlContainer() {
    let container = this.get('container');
    if (!container) {
      const containerTpl = this.get('containerTpl');
      const wrapper = this.get('canvas').get('el').parentNode;
      container = DomUtil.createDom(containerTpl);
      wrapper.style.position = 'relative';
      wrapper.appendChild(container);
      this.set('container', container);
    } else if (Util.isString(container)) {
      container = document.getElementById(container);
      if (container) {
        this.set('container', container);
      }
    }
    return container;
  }
  // 分html dom和G shape两种情况生成label实例
  _createText(cfg) {
    let container = this.get('container');
    let labelShape;
    if (cfg.useHtml) {
      if (!container) {
        container = this.initHtmlContainer();
      }
      const node = this._createDom(cfg);
      container.appendChild(node);
      this._setCustomPosition(cfg, node);
    } else {
      const origin = cfg.point;
      const group = this.get('group');
      delete cfg.point; // 临时解决，否则影响动画
      const rotate = cfg.rotate;
      if (cfg.textStyle) {
        cfg = Util.mix({
          x: cfg.x,
          y: cfg.y,
          textAlign: cfg.textAlign,
          text: cfg.text
        }, cfg.textStyle);
      }
      labelShape = group.addShape('text', {
        attrs: cfg
      });
      if (rotate) {
        labelShape.transform([
          [ 't', -cfg.x, -cfg.y ],
          [ 'r', rotate ],
          [ 't', cfg.x, cfg.y ]
        ]);
      }
      labelShape.setSilent('origin', origin || cfg);
      labelShape.name = 'label'; // 用于事件标注
      this.get('appendInfo') && labelShape.setSilent('appendInfo', this.get('appendInfo'));
      return labelShape;
    }
  }
  _createDom(cfg) {
    const itemTpl = this.get('itemTpl');
    const str = Util.substitute(itemTpl, { text: cfg.text });
    return DomUtil.createDom(str);
  }
  // 根据文本对齐方式确定dom位置
  _setCustomPosition(cfg, htmlDom) {
    const textAlign = cfg.textAlign || 'left';
    let top = cfg.y;
    let left = cfg.x;
    const width = DomUtil.getOuterWidth(htmlDom);
    const height = DomUtil.getOuterHeight(htmlDom);

    top = top - height / 2;
    if (textAlign === 'center') {
      left = left - width / 2;
    } else if (textAlign === 'right') {
      left = left - width;
    }

    htmlDom.style.top = parseInt(top, 10) + 'px';
    htmlDom.style.left = parseInt(left, 10) + 'px';
  }
}

module.exports = Label;
