const Util = require('../util');
const Category = require('./category');
const DomUtil = Util.DomUtil;
// const Event = Util.Event;
const Group = Util.Group;
// const Global = require('../../global');

const CONTAINER_CLASS = 'g2-legend';
const TITLE_CLASS = 'g2-legend-title';
const LIST_CLASS = 'g2-legend-list';
const ITEM_CLASS = 'g2-legend-list-item';
const TEXT_CLASS = 'g2-legend-text';
const MARKER_CLASS = 'g2-legend-marker';


function findNodeByClass(node, className) {
  return node.getElementsByClassName(className)[0];
}

function getParentNode(node, className) {
  let nodeClass = node.className;
  if (Util.isNil(nodeClass)) {
    return node;
  }
  nodeClass = nodeClass.split(' ');
  if (nodeClass.indexOf(className) > -1) {
    return node;
  }

  if (node.parentNode) {
    if (node.parentNode.className === CONTAINER_CLASS) {
      return node.parentNode;
    }
    return getParentNode(node.parentNode, className);
  }

  return null;
}
function findItem(items, refer) {
  let rst = null;
  const value = (refer instanceof Group) ? refer.get('value') : refer;
  Util.each(items, function(item) {
    if (item.value === value) {
      rst = item;
      return false;
    }
  });
  return rst;
}

class CatHtml extends Category {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * type标识
       * @type {String}
       */
      type: 'category-legend',
      container: null,
      /**
       * 使用html时的外层模板
       * @type {String}
       */
      containerTpl: '<div class="' + CONTAINER_CLASS + '">' +
        '<h4 class="' + TITLE_CLASS + '"></h4>' +
        '<ul class="' + LIST_CLASS + '"></ul>' +
        '</div>',
      /**
       * 默认的图例项 html 模板
       * @type {String}
       */
      _defaultItemTpl: '<li class="' + ITEM_CLASS + ' item-{index} {checked}" data-color="{originColor}" data-value="{originValue}">' +
        '<i class="' + MARKER_CLASS + '" style="background-color:{color};"></i>' +
        '<span class="' + TEXT_CLASS + '">{value}</span></li>',
      /**
       * 用户设置的图例项 html 模板
       * @type {String|Function}
       */
      itemTpl: null,
      /**
       * html style
       * @type {Boolean}
       */
      legendStyle: {},
      textStyle: {
        fill: '#333',
        fontSize: 12,
        textAlign: 'middle',
        textBaseline: 'top',
        fontFamily: '"-apple-system", BlinkMacSystemFont, "Segoe UI", Roboto,"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",SimSun, "sans-serif"' // Global.fontFamily
      },
      /**
       * 当文本太长时是否进行缩略
       * @type {Boolean}
       */
      abridgeText: false,
      /**
       * abridgeText 为 true 时，鼠标放置在 item 上时显示全称的悬浮 div 的 html 模板
       * @type {String}
       */
      tipTpl: '<div class="textTip"></div>',
      /**
       * abridgeText 为 true 时，鼠标放置在 item 上时显示全称的悬浮 div 的样式
       * @type {Object}
       */
      tipStyle: {
        display: 'none',
        fontSize: 12,
        backgroundColor: '#fff',
        position: 'absolute',
        width: 'auto',
        height: '20px',
        padding: '3px',
        boxShadow: '2px 2px 5px #888888'
      }
    });
  }

  _beforeRenderUI() {
    super._beforeRenderUI();
  }

  _renderUI() {
    this._renderHTML();
  }

  _bindUI() {
    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    if (this.get('hoverable')) {
      itemListDom.onmousemove = ev => this._onMousemove(ev);
      itemListDom.onmouseout = ev => this._onMouseleave(ev);
    }
    if (this.get('clickable')) {
      itemListDom.onclick = ev => this._onClick(ev);
    }
  }

  _onMousemove(ev) {
    const items = this.get('items');
    const target = ev.target;
    let targetClass = target.className;
    targetClass = targetClass.split(' ');
    if (targetClass.indexOf(CONTAINER_CLASS) > -1 || targetClass.indexOf(LIST_CLASS) > -1) {
      return;
    }
    const parentDom = getParentNode(target, ITEM_CLASS);
    const domClass = parentDom.className;
    const hoveredItem = findItem(items, parentDom.getAttribute('data-value'));

    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    if (hoveredItem && domClass.includes('checked')) {
      // change the opacity of other items
      Util.each(childNodes, child => {
        const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
        const childItem = findItem(items, child.getAttribute('data-value'));
        if (child !== parentDom && childItem.checked) {
          childMarkerDom && (childMarkerDom.style.opacity = 0.5);
        } else {
          childMarkerDom && (childMarkerDom.style.opacity = 1);
        }
      });
      this.emit('itemhover', {
        item: hoveredItem,
        currentTarget: parentDom,
        checked: hoveredItem.checked
      });
    } else if (!hoveredItem) {

      // restore the opacity of all the items
      Util.each(childNodes, child => {
        const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
        childMarkerDom && (childMarkerDom.style.opacity = 1);
      });

      this.emit('itemunhover', ev);
    }
    return;
  }

  _onMouseleave(ev) {
    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    // restore the opacity of all the items
    Util.each(childNodes, child => {
      const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
      childMarkerDom && (childMarkerDom.style.opacity = 1);
    });
    this.emit('itemunhover', ev);
    return;
  }

  _onClick(ev) {
    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const unCheckedColor = this.get('unCheckColor');
    const items = this.get('items');
    const mode = this.get('selectedMode');
    const childNodes = itemListDom.childNodes;

    const target = ev.target;
    let targetClass = target.className;
    targetClass = targetClass.split(' ');
    if (targetClass.indexOf(CONTAINER_CLASS) > -1 || targetClass.indexOf(LIST_CLASS) > -1) {
      return;
    }
    const parentDom = getParentNode(target, ITEM_CLASS);
    const textDom = findNodeByClass(parentDom, TEXT_CLASS);
    const markerDom = findNodeByClass(parentDom, MARKER_CLASS);
    const clickedItem = findItem(items, parentDom.getAttribute('data-value'));

    if (!clickedItem) {
      return;
    }
    const domClass = parentDom.className;
    const originColor = parentDom.getAttribute('data-color');
    if (mode === 'single') { // 单选模式
      // update checked status
      clickedItem.checked = true;
      // 其他图例项全部置灰
      Util.each(childNodes, child => {
        if (child !== parentDom) {
          const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
          childMarkerDom.style.backgroundColor = unCheckedColor;
          child.className = child.className.replace('checked', 'unChecked');
          child.style.color = unCheckedColor;
          const childItem = findItem(items, child.getAttribute('data-value'));
          childItem.checked = false;
        } else {
          if (textDom) {
            textDom.style.color = this.get('textStyle').fill;
          }
          if (markerDom) {
            markerDom.style.backgroundColor = originColor;
          }
          parentDom.className = domClass.replace('unChecked', 'checked');
        }
      });
    } else { // 混合模式
      const clickedItemChecked = domClass.includes('checked');
      let count = 0;
      Util.each(childNodes, child => {
        if (child.className.includes('checked')) {
          count++;
        }
      });
      if (!this.get('allowAllCanceled') && clickedItemChecked && count === 1) {
        return;
      }
      // 在判断最后一个图例后再更新checked状态，防止点击最后一个图例item时图例样式没有变化但是checked状态改变了 fix #422
      clickedItem.checked = !clickedItem.checked;
      if (clickedItemChecked) {
        if (markerDom) {
          markerDom.style.backgroundColor = unCheckedColor;
        }
        parentDom.className = domClass.replace('checked', 'unChecked');
        parentDom.style.color = unCheckedColor;
      } else {
        if (markerDom) {
          markerDom.style.backgroundColor = originColor;
        }
        parentDom.className = domClass.replace('unChecked', 'checked');
        parentDom.style.color = this.get('textStyle').fill;
      }
    }

    this.emit('itemclick', {
      item: clickedItem,
      currentTarget: parentDom,
      checked: (mode === 'single') ? true : clickedItem.checked
    });
    return;
  }


  activateItem(value) {
    const items = this.get('items');
    const item = findItem(items, value);

    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;

    childNodes.forEach(child => {
      const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
      const childItem = findItem(items, child.getAttribute('data-value'));
      if (childItem !== item && childItem.checked) {
        childMarkerDom.style.opacity = 0.5;
      } else {
        childMarkerDom.style.opacity = 1;
      }
    });
    return;
  }

  unActivateItem() {
    const legendWrapper = this.get('legendWrapper');
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const childNodes = itemListDom.childNodes;
    childNodes.forEach(child => {
      const childMarkerDom = findNodeByClass(child, MARKER_CLASS);
      childMarkerDom.style.opacity = 1;
    });
    return;
  }

  _renderHTML() {
    const canvas = this.get('canvas');
    const outterNode = canvas.get('el').parentNode;
    const title = this.get('title');
    const containerTpl = this.get('containerTpl');
    const legendWrapper = DomUtil.createDom(containerTpl);
    const titleDom = findNodeByClass(legendWrapper, TITLE_CLASS);
    // ul
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);
    const unCheckedColor = this.get('unCheckColor');
    const LEGEND_STYLE = Util.mix({}, {
      CONTAINER_CLASS: {
        height: 'auto',
        width: 'auto',
        position: 'absolute',
        overflowY: 'auto',
        fontSize: '12px',
        fontFamily: this.fontFamily,
        lineHeight: '20px',
        color: '#8C8C8C'
      },
      TITLE_CLASS: {
        marginBottom: this.get('titleGap') + 'px',
        fontSize: '12px',
        color: '#333', // 默认样式
        textBaseline: 'middle',
        fontFamily: this.fontFamily
      },
      LIST_CLASS: {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        textAlign: 'center'
      },
      LIST_ITEM_CLASS: {
        cursor: 'pointer',
        marginBottom: '5px',
        marginRight: '24px'
      },
      MARKER_CLASS: {
        width: '9px',
        height: '9px',
        borderRadius: '50%',
        display: 'inline-block',
        marginRight: '4px',
        verticalAlign: 'middle'
      }
    }, this.get('legendStyle'));

    // fix：IE 9 兼容问题，先加入 legendWrapper
    let container = this.get('container');
    if (/^\#/.test(container)) { // 如果传入 dom 节点的 id
      const id = container.replace('#', '');
      container = document.getElementById(id);
      container.appendChild(legendWrapper);
    } else {
      const position = this.get('position');
      const canvas = this.get('canvas');
      let rangeStyle = {};
      if (position === 'left' || position === 'right') {
        rangeStyle = {
          maxHeight: (this.get('maxLength') || canvas.get('height')) + 'px'
        };
      } else {
        rangeStyle = {
          maxWidth: (this.get('maxLength') || canvas.get('width')) + 'px'
        };
      }

      DomUtil.modifyCSS(legendWrapper, Util.mix({}, LEGEND_STYLE.CONTAINER_CLASS, rangeStyle, this.get(CONTAINER_CLASS)));
      outterNode.appendChild(legendWrapper);
    }

    DomUtil.modifyCSS(itemListDom, Util.mix({}, LEGEND_STYLE.LIST_CLASS, this.get(LIST_CLASS)));

    // render title
    if (titleDom) {
      if (title && title.text) {
        titleDom.innerHTML = title.text;
        DomUtil.modifyCSS(titleDom, Util.mix({}, LEGEND_STYLE.TITLE_CLASS, this.get(TITLE_CLASS), title));
      } else {
        legendWrapper.removeChild(titleDom);
      }
    }

    // 开始渲染图例项
    const items = this.get('items');
    let itemTpl = this.get('_defaultItemTpl');
    const userItemTpl = this.get('itemTpl');
    if (userItemTpl && userItemTpl !== itemTpl) {
      itemTpl = userItemTpl;
    }

    if (this.get('reversed')) {
      items.reverse();
    }

    const position = this.get('position');
    const layout = this.get('layout');
    const itemDisplay = ((position === 'right' || position === 'left') || layout === 'vertical') ? 'block' : 'inline-block';
    const itemStyle = Util.mix({}, LEGEND_STYLE.LIST_ITEM_CLASS, {
      display: itemDisplay
    }, this.get(ITEM_CLASS));
    const markerStyle = Util.mix({}, LEGEND_STYLE.MARKER_CLASS, this.get(MARKER_CLASS));
    Util.each(items, (item, index) => {
      const checked = item.checked;
      const value = this._formatItemValue(item.value);
      const markerColor = item.marker.fill || item.marker.stroke;
      const color = checked ? markerColor : unCheckedColor;
      let domStr;
      if (Util.isFunction(itemTpl)) {
        domStr = itemTpl(value, color, checked, index);
      } else {
        domStr = itemTpl;
      }

      const itemDiv = Util.substitute(domStr, {
        index,
        checked: checked ? 'checked' : 'unChecked',
        value,
        color,
        originColor: markerColor,
        // @2018-07-09 by blue.lb 修复如果legend值中存在双引号"时, 导致的无法点击触发legend正常操作bug
        originValue: item.value.replace(/\"/g, '&quot;')
      });
      // li
      const itemDom = DomUtil.createDom(itemDiv);
      itemDom.style.color = this.get('textStyle').fill;
      const markerDom = findNodeByClass(itemDom, MARKER_CLASS);
      const textDom = findNodeByClass(itemDom, TEXT_CLASS);
      DomUtil.modifyCSS(itemDom, itemStyle);
      markerDom && DomUtil.modifyCSS(markerDom, markerStyle);
      textDom && DomUtil.modifyCSS(textDom, this.get('textStyle'));

      if (!checked) {
        itemDom.style.color = unCheckedColor;
        if (markerDom) {
          markerDom.style.backgroundColor = unCheckedColor;
        }
      }
      itemListDom.appendChild(itemDom);
      if (this.get('abridgeText')) {

        let text = value;
        // const itemWidth = parseFloat(this.get(ITEM_CLASS).width.substr(0, this.get(ITEM_CLASS).width.length - 2));
        const itemWidth = itemDom.offsetWidth;
        let fs = this.get('textStyle').fontSize;
        if (isNaN(fs)) {
          // 6.5pt = 6.5 * 1/72 * 96 = 8.6px
          if (fs.indexOf('pt') !== -1) fs = parseFloat(fs.substr(0, fs.length - 2)) * 1 / 72 * 96;
          else if (fs.indexOf('px') !== -1) fs = parseFloat(fs.substr(0, fs.length - 2));
        }
        const textWidth = fs * text.length;
        const letterNum = Math.floor(itemWidth / fs);
        if (itemWidth < 2 * fs) { // unable to contain '...'
          text = '';
        } else if (itemWidth < textWidth) { // replace the tail as '...
          if (letterNum > 1) text = text.substr(0, letterNum - 1) + '...';
          else text = '...';
        }
        textDom.innerText = text;

        itemDom.addEventListener('mouseover', () => {
          const tipDom = findNodeByClass(legendWrapper, 'textTip');
          tipDom.style.display = 'block';
          tipDom.style.left = itemDom.offsetLeft + itemDom.offsetWidth + 'px';
          tipDom.style.top = itemDom.offsetTop + 15 + 'px';
          tipDom.innerText = value;
        });
        itemDom.addEventListener('mouseout', () => {
          const tipDom = findNodeByClass(legendWrapper, 'textTip');
          tipDom.style.display = 'none';
        });
      }
    });

    // append the tip div, display = block while mouse entering
    if (this.get('abridgeText')) {
      const tipTpl = this.get('tipTpl');
      const tipDom = DomUtil.createDom(tipTpl);
      const tipDomStyle = this.get('tipStyle');
      DomUtil.modifyCSS(tipDom, tipDomStyle);
      legendWrapper.appendChild(tipDom);
      tipDom.addEventListener('mouseover', () => {
        tipDom.style.display = 'none';
      });
    }

    this.set('legendWrapper', legendWrapper);
  }

  _formatItemValue(value) {
    return super._formatItemValue(value);
  }

  getWidth() {
    return DomUtil.getOuterWidth(this.get('legendWrapper'));
  }

  getHeight() {
    return DomUtil.getOuterHeight(this.get('legendWrapper'));
  }

  move(x, y) {
    if (!(/^\#/.test(this.get('container')))) {
      DomUtil.modifyCSS(this.get('legendWrapper'), {
        left: x + 'px',
        top: y + 'px'
      });
      this.set('x', x);
      this.set('y', y);
    } else {
      super.move(x, y);
    }
  }

  remove() {
    const legendWrapper = this.get('legendWrapper');
    if (legendWrapper && legendWrapper.parentNode) {
      legendWrapper.parentNode.removeChild(legendWrapper);
    }
    super.remove(); // must be called
  }
}

module.exports = CatHtml;
