const Util = require('../util');
const CatHtml = require('./cat-html');
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
      /**
       * html 容器
       * @type {DOM}
       */
      container: null,
      /**
       * 向上 / 下翻页图标的样式
       * @type {ATTRS}
       */
      caretStyle: {
        width: '15px',
        display: 'inline-block',
        cursor: 'pointer'
      },
      /**
       * 页码文字的样式
       * @type {ATTRS}
       */
      pageNumStyle: {
        display: 'inline-block',
        fontSize: '12px',
        fontFamily: this.fontFamily,
        cursor: 'default'
      },
      /**
       * 翻页块 DOM 的样式
       * @type {ATTRS}
       */
      slipDomStyle: {
        width: 'auto',
        height: 'auto',
        position: 'absolute'
      },
      /**
       * 翻页块 DOM
       * @type {String}
       */
      slipTpl:
        '<div class="' + SLIP_CLASS + '" >' +
          '<img class="caret-up" src = "https://gw.alipayobjects.com/zos/rmsportal/AyRvHCJjiOBzJWErvzWz.png"/>' +
          '<p class="cur-pagenum" style = "display:inline-block;">1</p>' +
          '<p class="next-pagenum" style = "display:inline-block;">/2</p>' +
          '<img class="caret-down" src = "https://gw.alipayobjects.com/zos/rmsportal/LbdlxWIqCtpCbvRDaMgq.png"/>' +
        '</div>',
      /**
       * 翻页块的宽度，用于设置翻页块相对于 legend 的位置
       * @type {Number}
       */
      slipWidth: 65,
      /**
       * legend 内容超出容器的处理方式
       * @type {String}
       */
      legendOverflow: 'unset'
    });
  }

  render() {
    super._renderHTML();
    this._renderFlipPage();
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
      const slipTpl = this.get('slipTpl');
      const slipDom = DomUtil.createDom(slipTpl);
      const caretUpDom = findNodeByClass(slipDom, 'caret-up');
      const caretDownDom = findNodeByClass(slipDom, 'caret-down');
      DomUtil.modifyCSS(caretUpDom, this.get('caretStyle'));
      DomUtil.modifyCSS(caretDownDom, this.get('caretStyle'));
      const curPageNumDom = findNodeByClass(slipDom, 'cur-pagenum');
      const totalPageNumDom = findNodeByClass(slipDom, 'next-pagenum');
      const pageNumStyle = this.get('pageNumStyle');
      DomUtil.modifyCSS(curPageNumDom, Util.mix({}, pageNumStyle, { paddingLeft: '10px' }));
      DomUtil.modifyCSS(totalPageNumDom, Util.mix({}, pageNumStyle, { opacity: 0.3, paddingRight: '10px' }));

      // layout at the center-bottom of the legendWrapper
      let slipWidth = slipDom.offsetWidth;
      if (!slipWidth) slipWidth = this.get('slipWidth');
      let slipLeft = legendWrapper.offsetWidth / 2 - slipWidth / 2;
      slipLeft = (slipLeft + slipWidth) < legendWrapper.offsetWidth ? slipLeft : (legendWrapper.offsetWidth - slipWidth);
      slipLeft = slipLeft > 0 ? slipLeft : 0;
      DomUtil.modifyCSS(slipDom, Util.mix({}, this.get('slipDomStyle'), {
        top: legendWrapper.offsetHeight + 'px',
        left: slipLeft + 'px'
      })
      );

      legendWrapper.style.overflow = this.get('legendOverflow');
      legendWrapper.appendChild(slipDom);
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
      this.set('slipDom', slipDom);
    }
  }
  destroy() {
    super.destroy();
    const slipDom = this.get('slipDom');
    if (slipDom && slipDom.parentNode) {
      slipDom.parentNode.removeChild(slipDom);
    }

  }
}

module.exports = CatPageHtml;
