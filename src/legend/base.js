
const Util = require('../util');
const Group = Util.Group;

class Legend extends Group {
  getDefaultCfg() {
    return {
      /**
       * 图例标题配置
       * @type {Object}
       */
      title: null,
      /**
       * 图例项文本格式化
       * @type {Function}
       */
      itemFormatter: null,
      /**
       * 是否使用 html 进行渲染
       * @type {Boolean}
       */
      useHtml: false,
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
      titleGap: 15
    };
  }

  _beforeRenderUI() {
    const group = this.addGroup();
    group.set('viewId', this.get('viewId'));
    this.set('itemsGroup', group);
  }

  _renderUI() {
    this._renderTitle();
  }

  // render the title of the legend
  _renderTitle() {
    const title = this.get('title');
    let titleGap = this.get('titleGap');
    titleGap = titleGap || 0;
    if (title && title.text) {
      const titleShape = this.addShape('text', {
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
    this.clearItems();
    this._renderUI();
  }

  // add an item into the legend
  addItem(item) {
    const items = this.get('items');
    items.push(item);
    this.clearItems();
    this._renderUI();
  }

  // clear all the items of the legend
  clearItems() {
    const itemsGroup = this.get('itemsGroup');
    itemsGroup.clear();
  }

  // return the width of the legend
  getWidth() {
    const bbox = this.getBBox();
    return bbox.width;
  }

  // return the height of the legend
  getHeight() {
    const bbox = this.getBBox();
    return bbox.height;
  }
}

module.exports = Legend;
