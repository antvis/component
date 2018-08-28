const Tooltip = require('./base');
const Util = require('../util');
const DomUtil = Util.DomUtil;
const TooltipTheme = require('./theme');

const CONTAINER_CLASS = 'g2-tooltip';
const TITLE_CLASS = 'g2-tooltip-title';
const LIST_CLASS = 'g2-tooltip-list';
const MARKER_CLASS = 'g2-tooltip-marker';
const VALUE_CLASS = 'g2-tooltip-value';
const LIST_ITEM_CLASS = 'g2-tooltip-list-item';

const GAP = 20;

function find(dom, cls) {
  return dom.getElementsByClassName(cls)[0];
}

function constraintPositionInBoundary(x, y, el, viewWidth, viewHeight) {
  const width = el.clientWidth;
  const height = el.clientHeight;

  if (x + width + GAP > viewWidth) {
    x -= width + GAP;
    x = x < 0 ? 0 : x;
  } else if (x + GAP < 0) {
    x = GAP;
  } else {
    x += GAP;
  }

  if (y + height + GAP > viewHeight) {
    y -= (height + GAP);
    y = y < 0 ? 0 : y;
  } else if (y + GAP < 0) {
    y = GAP;
  } else {
    y += GAP;
  }

  return [ x, y ];
}

function constraintPositionInPlot(x, y, el, plotRange, onlyHorizontal) {
  const width = el.clientWidth;
  const height = el.clientHeight;
  if (x + width > plotRange.tr.x) {
    x -= (width + 2 * GAP);
  }

  if (x < plotRange.tl.x) {
    x = plotRange.tl.x;
  }

  if (!onlyHorizontal) {
    if (y + height > plotRange.bl.y) {
      y -= height + 2 * GAP;
    }

    if (y < plotRange.tl.y) {
      y = plotRange.tl.y;
    }
  }
  return [ x, y ];
}

class HtmlTooltip extends Tooltip {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
    /**
       * tooltip 容器模板
       * @type {String}
    */
      containerTpl: ' <div class="' + CONTAINER_CLASS + '"> '
      + '<div class="' + TITLE_CLASS + '"></div>'
      + '<ul class="' + LIST_CLASS + '"></ul>'
      + '</div>',
    /**
     * tooltip 列表项模板
     * @type {String}
     */
      itemTpl: '<li data-index={index}>'
    + '<span style="background-color:{color};" class=' + MARKER_CLASS + '></span>'
    + '{name}<span class=' + VALUE_CLASS + '>{value}</span></li>',
      /**
       * tooltip 内容跟随鼠标移动
       * @type {Boolean}
       */
      follow: true,
      /**
       * 是否允许鼠标停留在 tooltip 上，默认不允许
       * @type {Boolean}
       */
      enterable: false
    });
  }

  constructor(cfg) {
    super(cfg);
    this._init_();
    if (this.get('items')) {
      this.render();
    }
  }

  _init_() {
    const self = this;
    self.style = self.get('viewTheme') || TooltipTheme;
    const containerTpl = self.get('containerTpl');
    let container;
    if (/^\#/.test(containerTpl)) { // 如果传入 dom 节点的 id
      const id = containerTpl.replace('#', '');
      container = document.getElementById(id);
    } else {
      const outterNode = self.get('canvas').get('el').parentNode;
      container = DomUtil.createDom(containerTpl);
      DomUtil.modifyCSS(container, self.style[CONTAINER_CLASS]);
      outterNode.appendChild(container);
      outterNode.style.position = 'relative';
    }
    self.set('container', container);
  }

  render() {
    const self = this;
    const showTitle = self.get('showTitle');
    const titleContent = self.get('titleContent');
    const container = self.get('container');
    const titleDom = find(container, TITLE_CLASS);
    const listDom = find(container, LIST_CLASS);
    const items = self.get('items');
    self.clear();

    if (titleDom && showTitle) {
      DomUtil.modifyCSS(titleDom, self.style[TITLE_CLASS]);
      titleDom.innerHTML = titleContent;
    }

    if (listDom) {
      DomUtil.modifyCSS(listDom, self.style[LIST_CLASS]);
      Util.each(items, (item, index) => {
        listDom.appendChild(self._addItem(item, index));
      });
    }
  }


  clear() {
    const container = this.get('container');
    const titleDom = find(container, TITLE_CLASS);
    const listDom = find(container, LIST_CLASS);
    if (titleDom) {
      titleDom.innerHTML = '';
    }
    if (listDom) {
      listDom.innerHTML = '';
    }
  }

  show() {
    const container = this.get('container');
    super.show();
    container.style.visibility = 'visible';
  }

  hide() {
    const container = this.get('container');
    container.style.visibility = 'hidden';
    super.hide();
  }

  destroy() {
    const self = this;
    const container = self.get('container');
    const containerTpl = self.get('containerTpl');
    if (container && !(/^\#/.test(containerTpl))) {
      container.parentNode.removeChild(container);
    }
    super.destroy();
  }

  _addItem(item, index) {
    const itemTpl = this.get('itemTpl'); // TODO: 有可能是个回调函数
    const itemDiv = Util.substitute(itemTpl, Util.mix({
      index
    }, item));
    const itemDOM = DomUtil.createDom(itemDiv);
    DomUtil.modifyCSS(itemDOM, this.style[LIST_ITEM_CLASS]);
    const markerDom = find(itemDOM, MARKER_CLASS);
    if (markerDom) {
      DomUtil.modifyCSS(markerDom, this.style[MARKER_CLASS]);
    }
    const valueDom = find(itemDOM, VALUE_CLASS);
    if (valueDom) {
      DomUtil.modifyCSS(valueDom, this.style[VALUE_CLASS]);
    }
    return itemDOM;
  }

  setPosition(x, y) {
    const container = this.get('container');
    const outterNode = this.get('canvas').get('el');
    const viewWidth = DomUtil.getWidth(outterNode);
    const viewHeight = DomUtil.getHeight(outterNode);

    let position;
    const prePosition = this.get('prePosition') || { x: 0, y: 0 };
    if (this.get('enterable')) {
      y = y - container.clientHeight / 2;
      position = [ x, y ];
      if (prePosition && x - prePosition.x > 0) { // 留 1px 防止鼠标点击事件无法在画布上触发
        x -= (container.clientWidth + 1);
      } else {
        x += 1;
      }
    } else {
      position = constraintPositionInBoundary(x, y, container, viewWidth, viewHeight);
      x = position[0];
      y = position[1];
    }

    if (this.get('inPlot')) { // tooltip 必须限制在绘图区域内
      const plotRange = this.get('plotRange');
      position = constraintPositionInPlot(x, y, container, plotRange, this.get('enterable'));
      x = position[0];
      y = position[1];
    }
    this.set('prePosition', position); // 记录上次的位置
    const follow = this.get('follow');
    container.style.left = follow ? (x + 'px') : 0;
    container.style.top = follow ? (y + 'px') : 0;
    super.setPosition(x, y);
  }


}

module.exports = HtmlTooltip;
