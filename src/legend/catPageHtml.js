const Util = require('../util');
const CatHtml = require('./catHtml');
const DomUtil = Util.DomUtil;

const LIST_CLASS = 'g2-legend-list';
const CONTAINER_CLASS = 'g2-legend';
const SLIP_CLASS = 'g2-slip';

function findNodeByClass(node, className) {
  return node.getElementsByClassName(className)[0];
}

class CatPageHtml extends CatHtml {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return Util.mix({}, cfg, {
      /**
       * type标识
       * @type {String}
       */
      type: 'category-page-legend',
      container: null
    });
  }

  _beforeRenderUI() {
    super._beforeRenderUI();
  }

  _renderUI() {
    super._renderHTML();
    this._renderFlipPage();
  }

  _bindUI() {
    super._bindUI();
  }
  _renderFlipPage() {
    const legendWrapper = document.getElementsByClassName(CONTAINER_CLASS)[0];
    // ul
    const itemListDom = findNodeByClass(legendWrapper, LIST_CLASS);

    const position = this.get('position');
    const layout = this.get('layout');
    const itemDisplay = ((position === 'right' || position === 'left') || layout === 'vertical') ? 'block' : 'inline-block';

    // 翻页
    if (legendWrapper.scrollHeight > legendWrapper.offsetHeight) {
      // append a slip div
      const slipTpl = '<div class="' + SLIP_CLASS + '" >' +
      '<img class="caret-up" src = "https://gw.alipayobjects.com/zos/rmsportal/AyRvHCJjiOBzJWErvzWz.png"/>' +
      '<p class="cur-pagenum" style = "display:inline-block;">1</p>' +
      '<p class="next-pagenum" style = "display:inline-block;">/2</p>' +
      '<img class="caret-down" src = "https://gw.alipayobjects.com/zos/rmsportal/LbdlxWIqCtpCbvRDaMgq.png"/>' +
      '</div>';
      const slipDom = DomUtil.createDom(slipTpl);
      const caretUpDom = findNodeByClass(slipDom, 'caret-up');
      const caretDownDom = findNodeByClass(slipDom, 'caret-down');
      const caretStyle = {
        width: '15px',
        display: 'inline-block',
        cursor: 'pointer'
      };
      DomUtil.modifyCSS(caretUpDom, caretStyle);
      DomUtil.modifyCSS(caretDownDom, caretStyle);
      const curPageNumDom = findNodeByClass(slipDom, 'cur-pagenum');
      const totalPageNumDom = findNodeByClass(slipDom, 'next-pagenum');
      const pageNumStyle = {
        display: 'inline-block',
        fontSize: '12px',
        fontFamily: this.fontFamily,
        cursor: 'default'
      };
      DomUtil.modifyCSS(curPageNumDom, Util.mix({}, pageNumStyle, { paddingLeft: '10px' }));
      DomUtil.modifyCSS(totalPageNumDom, Util.mix({}, pageNumStyle, { opacity: 0.3, paddingRight: '10px' }));

      let slipLeft = legendWrapper.offsetWidth / 2 - 45;
      slipLeft = slipLeft > 0 ? slipLeft : 0;
      DomUtil.modifyCSS(slipDom, {
        width: 'auto',
        height: 'auto',
        position: 'absolute',
        top: legendWrapper.offsetHeight + 10 + 'px',
        left: slipLeft + 'px'
      });

      legendWrapper.parentNode.appendChild(slipDom);
      const li = itemListDom.childNodes;
      let curHeight = 0;
      // find the total page number
      let pages = 1;
      let blockLi = [];
      for (let i = 0; i < li.length; i++) {
        li[i].style.display = itemDisplay;
        curHeight = li[i].offsetTop + li[i].offsetHeight;
        if (curHeight >= legendWrapper.offsetHeight) {
          pages++;
          blockLi.forEach(bl => {
            bl.style.display = 'none';
          });
          blockLi = [];
        }
        blockLi.push(li[i]);
      }
      totalPageNumDom.innerText = ('/' + pages);
      // initialize the page
      li.forEach(l => {
        l.style.display = itemDisplay;
        curHeight = l.offsetTop + l.offsetHeight;
        if (curHeight > legendWrapper.offsetHeight) {
          l.style.display = 'none';
        }
      });
      // down button listener
      caretUpDom.addEventListener('click', () => {
        // it is the 1st page
        if (li[0].style.display === itemDisplay) return;
        // otherwise
        let firstDisplayItemIdx = -1;
        li.forEach((l, i) => {
          if (l.style.display === itemDisplay) {
            firstDisplayItemIdx = firstDisplayItemIdx === -1 ? i : firstDisplayItemIdx;
            l.style.display = 'none';
          }
        });
        for (let i = firstDisplayItemIdx - 1; i >= 0; i--) {
          li[i].style.display = itemDisplay;
          curHeight = li[firstDisplayItemIdx - 1].offsetTop + li[firstDisplayItemIdx - 1].offsetHeight;
          li[i].style.display = 'none';
          if (curHeight < legendWrapper.offsetHeight) {
            li[i].style.display = itemDisplay;
          } else break;
        }
        // change the page number
        curPageNumDom.innerText = (Number.parseInt(curPageNumDom.innerText, 10) - 1);
      });

      // up button listener
      caretDownDom.addEventListener('click', () => {
        // it is the last page
        if (li[li.length - 1].style.display === itemDisplay) return;
        // otherwise
        let lastDisplayItemIdx = -1;
        li.forEach((l, i) => {
          if (l.style.display === itemDisplay) {
            lastDisplayItemIdx = i;
            l.style.display = 'none';
          }
        });
        for (let i = lastDisplayItemIdx + 1; i < li.length; i++) {
          li[i].style.display = itemDisplay;
          curHeight = li[i].offsetTop + li[i].offsetHeight;
          li[i].style.display = 'none';
          if (curHeight < legendWrapper.offsetHeight) li[i].style.display = itemDisplay;
          else break;
        }
        // change the page number
        curPageNumDom.innerText = (Number.parseInt(curPageNumDom.innerText, 10) + 1);
      });
    }
  }

  _formatItemValue(value) {
    return super._formatItemValue(value);
  }

  getWidth() {
    return super.getWidth();
  }

  getHeight() {
    return super.getHeight();
  }

  move(x, y) {
    super.move(x, y);
  }

  remove() {
    super.remove();
  }
}

module.exports = CatPageHtml;
