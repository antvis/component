const Util = require('../util');
const DomUtil = Util.DomUtil;
const G = require('@antv/g');
const MatrixUtil = G.MatrixUtil;
const Tooltip = require('./base');

function constraintPositionInBoundary(x, y, el, viewWidth, viewHeight) {
  const bbox = el.getBBox();
  const width = bbox.width;
  const height = bbox.height;
  const gap = 20;

  if (x + width + gap > viewWidth) {
    x -= width + gap;
    x = x < 0 ? 0 : x;
  } else if (x + gap < 0) {
    x = gap;
  } else {
    x += gap;
  }

  if (y + height + gap > viewHeight) {
    y -= (height + gap);
    y = y < 0 ? 0 : y;
  } else if (y + gap < 0) {
    y = gap;
  } else {
    y += gap;
  }

  return [ x, y ];
}

function constraintPositionInPlot(x, y, el, plotRange, onlyHorizontal) {
  const bbox = el.getBBox();
  const width = bbox.width;
  const height = bbox.height;
  const gap = 20;
  if (x + width > plotRange.tr.x) {
    x -= (width + 2 * gap);
  }

  if (x < plotRange.tl.x) {
    x = plotRange.tl.x;
  }

  if (!onlyHorizontal) {
    if (y + height > plotRange.bl.y) {
      y -= height + 2 * gap;
    }

    if (y < plotRange.tl.y) {
      y = plotRange.tl.y;
    }
  }
  return [ x, y ];
}

class CanvasTooltip extends Tooltip {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * 默认背景板样式
       * @type {Object}
       */
      boardStyle: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: 'rgba(255, 255, 255, 0.9)',
        radius: 4,
        stroke: '#e2e2e2',
        lineWidth: 1
      },
      titleStyle: {
        fontFamily: 'PingFang SC',
        text: '',
        textBaseline: 'top',
        fontSize: 12,
        fill: 'rgb(87, 87, 87)',
        lineHeight: 20,
        padding: 20
      },
      markerStyle: {
        radius: 4
      },
      nameStyle: {
        fontFamily: 'PingFang SC',
        fontSize: 12,
        fill: 'rgb(87, 87, 87)',
        textBaseline: 'middle',
        textAlign: 'start',
        padding: 8
      },
      valueStyle: {
        fontFamily: 'PingFang SC',
        fontSize: 12,
        fill: 'rgb(87, 87, 87)',
        textBaseline: 'middle',
        textAlign: 'start',
        padding: 30
      },
      padding: { top: 20, right: 20, bottom: 20, left: 20 },
      itemGap: 10,
      animationDuration: 200
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
    const padding = self.get('padding');
    const parent = self.get('frontPlot');
    // container
    const container = parent.addGroup();
    self.set('container', container);
    // board
    const board = container.addShape('rect', {
      attrs: Util.mix({}, self.get('boardStyle'))
    });
    self.set('board', board);
    // title
    const titleStyle = self.get('titleStyle');
    if (self.get('showTitle')) {
      const titleShape = container.addShape('text', {
        attrs: Util.mix({
          x: padding.left,
          y: padding.top
        }, titleStyle)
      });
      self.set('titleShape', titleShape);
      titleShape.name = 'tooltip-title';
    }
    const itemsGroup = container.addGroup();
    itemsGroup.move(padding.left, padding.top + titleStyle.lineHeight + titleStyle.padding);
    self.set('itemsGroup', itemsGroup);
  }

  render() {
    const self = this;
    self.clear();
    const container = self.get('container');
    const board = self.get('board');
    const showTitle = self.get('showTitle');
    const titleContent = self.get('titleContent');
    const titleShape = this.get('titleShape');
    const itemsGroup = this.get('itemsGroup');
    const items = self.get('items');
    const padding = self.get('padding');

    if (titleShape && showTitle) {
      titleShape.attr('text', titleContent);
    }

    if (itemsGroup) {
      const itemGap = self.get('itemGap');
      const x = 0;
      let y = 0;
      Util.each(items, item => {
        const itemGroup = self._addItem(item);
        itemGroup.move(x, y);
        itemsGroup.add(itemGroup);
        const itemHeight = itemGroup.getBBox().height;
        y += itemHeight + itemGap;
      });
    }
    // update board based on bbox
    const bbox = container.getBBox();
    const width = bbox.width + padding.right;
    const height = bbox.height + padding.bottom;
    board.attr('width', width);
    board.attr('height', height);
    // align value text to right
    self._alignToRight(width);
  }

  clear() {
    const titleShape = this.get('titleShape');
    const itemsGroup = this.get('itemsGroup');
    titleShape.text = '';
    itemsGroup.clear();
  }

  show() {
    const container = this.get('container');
    super.show();
    container.attr('visible', true);
    container.set('visible', true);
  }

  hide() {
    const container = this.get('container');
    super.hide();
    container.attr('visible', false);
    container.set('visible', false);
  }

  destroy() {
    const container = this.get('container');
    super.destroy();
    container.remove();
  }

  setPosition(x, y) {
    const container = this.get('container');
    const outterNode = this.get('canvas').get('el');
    const viewWidth = DomUtil.getWidth(outterNode);
    const viewHeight = DomUtil.getHeight(outterNode);

    let position;
    position = constraintPositionInBoundary(x, y, container, viewWidth, viewHeight);
    x = position[0];
    y = position[1];

    if (this.get('inPlot')) { // tooltip 必须限制在绘图区域内
      const plotRange = this.get('plotRange');
      position = constraintPositionInPlot(x, y, container, plotRange, this.get('enterable'));
      x = position[0];
      y = position[1];
    }
    const ulMatrix = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
    const mat = MatrixUtil.transform(ulMatrix, [
        [ 't', x, y ]
    ]);
    container.animate({
      matrix: mat
    }, this.get('animationDuration'));
    super.setPosition(x, y);
  }

  _addItem(item) {
    const group = new G.Group();
    // marker
    const markerStyle = this.get('markerStyle');
    const markerAttr = Util.mix({
      symbol: item.marker ? item.marker : 'circle',
      fill: item.color,
      x: markerStyle.radius / 2,
      y: 0
    }, markerStyle);
    group.addShape('marker', {
      attrs: markerAttr
    });
    // name
    const nameStyle = this.get('nameStyle');
    group.addShape('text', {
      attrs: Util.mix({
        x: markerStyle.radius + nameStyle.padding,
        y: 0,
        text: item.name
      }, nameStyle)
    });
    // value
    const valueStyle = this.get('valueStyle');
    group.addShape('text', {
      attrs: Util.mix({
        x: group.getBBox().width + valueStyle.padding,
        y: 0,
        text: item.value
      }, valueStyle)
    });

    return group;
  }

  _alignToRight(width) {
    const itemsGroup = this.get('itemsGroup');
    const groups = itemsGroup.get('children');
    Util.each(groups, g => {
      const children = g.get('children');
      const valueText = children[2];
      const w = valueText.getBBox().width;
      const x = width - w - this.get('padding').right * 2;
      valueText.attr('x', x);
    });
  }


}


module.exports = CanvasTooltip;
