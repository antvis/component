
const Util = require('../util');
const Component = require('../component');

class Legend extends Component {
  getDefaultCfg() {
    return {
      /**
       * Group 容器
       * @type {Number}
       */
      container: null,
      /**
       * 图例标题配置
       * @type {Object}
       */
      title: null,
      /**
       * 图例项文本格式化
       * @type {Function}
       */
      formatter: null,
      /**
       * useHtml 为 true 时生效，用于自动定位
       * @type {[type]}
       */
      autoPosition: true,
      /**
       * 图例是否绘制在绘图区域内
       * @type {Boolean}
       */
      inPlot: false,
      /**
       * 鼠标 hover 到图例上的默认交互是否开启
       * @type {Boolean}
       */
      hoverable: true,
      /**
       * TODO：rename
       * 图例标题距离图例项的距离
       * @type {Number}
       */
      titleGap: 15,
      /**
       * legend 相对于 container 的位置
       * @type {Array}
       */
      position: [ 0, 0 ],
      /**
       * legend 在 position 位置上的偏移量
       * @type {Array}
       */
      offset: [ 0, 0 ]
    };
  }
  constructor(cfg) {
    super(cfg);
    this._init();
    this.beforeRender();
    this.render();
    this._adjustPositionOffset();
    this._bindEvents();
  }

  _init() {
    let group = this.get('group');
    const container = this.get('container');
    this.set('canvas', container.get('canvas'));
    const position = this.get('position');
    if (!group) group = container.addGroup({ x: 0 - position[0], y: 0 - position[1] });
    this.set('group', group);
  }

  _adjustPositionOffset() {
    const position = this.get('position');
    const offset = this.get('offset');
    const canvas = this.get('canvas');
    const bbox = this.get('group').getBBox();
    const legendWidth = bbox.maxX - bbox.minX;
    const legendHeight = bbox.maxY - bbox.minY;
    this.move(-bbox.minX + position[0] + offset[0], -bbox.minY + position[1] + offset[1]);
    canvas.changeSize(legendWidth + 2 * (position[0] + offset[0]), legendHeight + 2 * (position[1]) + offset[1]);
  }

  beforeRender() {
    const group = this.get('group');
    const itemsGroup = group.addGroup();
    this.set('itemsGroup', itemsGroup);
  }

  render() {
    this._renderTitle();
  }

  // render the title of the legend
  _renderTitle() {
    const title = this.get('title');
    let titleGap = this.get('titleGap');
    titleGap = titleGap || 0;
    if (title && title.text) {
      const group = this.get('group');
      const titleShape = group.addShape('text', {
        attrs: Util.mix({
          x: 0,
          y: 0 - titleGap,
          fill: '#333',
          textBaseline: 'middle',
          fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"' // viewTheme.fontFamily
        }, title)
      });
      titleShape.name = 'legend-title';
      this.get('appendInfo') && titleShape.setSilent('appendInfo', this.get('appendInfo'));
      this.set('titleShape', titleShape);
    }
  }

  // return the count of checked items
  getCheckedCount() {
    const itemsGroup = this.get('itemsGroup');
    const items = itemsGroup.get('children');
    const checkedArr = Util.filter(items, function(item) {
      return item.get('checked');
    });
    return checkedArr.length;
  }

  // set items for the legend
  setItems(items) {
    this.set('items', items);
    this.clear();
    this.render();
  }

  // add an item into the legend
  addItem(item) {
    const items = this.get('items');
    items.push(item);
    this.clear();
    this.render();
  }

  // clear all the items of the legend
  clear() {
    const itemsGroup = this.get('itemsGroup');
    itemsGroup.clear();
    const group = this.get('group');
    group.clear();
    this.beforeRender();
  }

  // destroy the legend
  destroy() {
    const group = this.get('group');
    group.destroy();
    this._attrs = {};
    this.removeAllListeners();
    this.destroyed = true;
  }

  // return the width of the legend
  getWidth() {
    const bbox = this.get('group').getBBox();
    return bbox.width;
  }

  // return the height of the legend
  getHeight() {
    const bbox = this.get('group').getBBox();
    return bbox.height;
  }

  move(x, y) {
    this.get('group').move(x, y);
  }

  draw() {
    this.get('canvas').draw();
  }
}

module.exports = Legend;
