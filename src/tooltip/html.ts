import { createDom, modifyCSS } from '@antv/dom-util';
import { Point } from '@antv/g-base/lib/types';
import { deepMix, each, hasKey, substitute } from '@antv/util';
import HtmlComponent from '../abstract/html-component';
import { PointLocationCfg } from '../types';
import { TooltipCfg } from '../types';
import { clearDom, hasClass, regionToBBox } from '../util/util';
import * as CssConst from './css-const';
import TooltipTheme from './html-theme';

import { ILocation } from '../intefaces';
import { getAlignPoint } from '../util/align';

function toPx(number) {
  return `${number}px`;
}

function hasOneKey(obj, keys) {
  let result = false;
  each(keys, (key) => {
    if (hasKey(obj, key)) {
      result = true;
      return false;
    }
  });
  return result;
}

class Tooltip<T extends TooltipCfg = TooltipCfg> extends HtmlComponent implements ILocation<PointLocationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'tooltip',
      type: 'html',
      x: 0,
      y: 0,
      items: [],
      containerTpl: `<div class="${CssConst.CONTAINER_CLASS}"><div class="${CssConst.TITLE_CLASS}"></div><ul class="${CssConst.LIST_CLASS}"></ul></div>`,
      itemTpl: `<li class="${CssConst.LIST_ITEM_CLASS}" data-index={index}>
          <span class="${CssConst.MARKER_CLASS}" style="background-color:{color}"></span>
          <span class="${CssConst.NAME_CLASS}">{name}</span>:
          <span class="${CssConst.VALUE_CLASS}">{value}</span>
        </li>`,
      xCrosshairTpl: `<div class="${CssConst.CROSSHAIR_X}"></div>`,
      yCrosshairTpl: `<div class="${CssConst.CROSSHAIR_Y}"></div>`,
      title: null,
      showTitle: true,
      /**
       * tooltip 限制的区域
       * @type {Region}
       */
      region: null,
      // crosshair 的限制区域
      crosshairsRegion: null,
      // x, y, xy
      crosshairs: null,
      offset: 10,
      position: 'right',
      domStyles: null,
      defaultStyles: TooltipTheme,
    };
    return cfg;
  }

  // tooltip 渲染时，渲染 title，items 和 corosshairs
  public render() {
    this.resetTitle();
    this.renderItems();
    // 绘制完成后，再定位
    this.resetPosition();
    this.resetCrosshairs();
  }

  // 复写清空函数，因为有模板的存在，所以默认的写法不合适
  public clear() {
    // 由于 crosshair 没有在 container 内，所以需要单独清理
    this.clearCrosshairs();
    this.setTitle(''); // 清空标题
    this.clearItemDoms();
  }

  // 更新属性的同时，可能会引起 DOM 的变化，这里对可能引起 DOM 变化的场景做了处理
  public update(cfg: Partial<T>) {
    super.update(cfg);
    // 更新标题
    if (hasOneKey(cfg, ['title', 'showTitle'])) {
      this.resetTitle();
    }
    // 更新内容
    if (hasKey(cfg, 'items')) {
      this.renderItems();
    }

    // 更新 crosshairs
    if (hasKey(cfg, 'crosshairs')) {
      this.resetCrosshairs();
    }
    // 更新样式
    if (hasKey(cfg, 'domStyle')) {
      this.resetStyles();
      this.applyStyles();
    }
    // 更新限制区域
    if (hasOneKey(cfg, ['region', 'crosshairsRegion'])) {
      this.resetCrosshairs(); // crosshair 受限制区域的影响
    }
    // 只要属性发生变化，都调整一些位置
    this.resetPosition();
  }

  public show() {
    const container = this.getContainer();
    if (!container || this.destroyed) {
      // 防止容器不存在或者被销毁时报错
      return;
    }
    this.set('visible', true);
    modifyCSS(container, {
      visibility: 'visible',
    });
  }

  public hide() {
    const container = this.getContainer();
    // relative: https://github.com/antvis/g2/issues/1221
    if (!container || this.destroyed) {
      return;
    }
    this.set('visible', false);
    modifyCSS(container, {
      visibility: 'hidden',
    });
  }

  // 实现 IPointLocation 的接口
  public getLocation() {
    return { x: this.get('x'), y: this.get('y') };
  }
  // 实现 IPointLocation 的接口
  public setLocation(point: Point) {
    this.set('x', point.x);
    this.set('y', point.y);
    this.resetPosition();
  }

  protected initContainer() {
    super.initContainer();
    this.cacheDoms();
    this.resetStyles(); // 初始化样式
    this.applyStyles(); // 应用样式
  }
  // 清理 DOM
  protected removeDom() {
    super.removeDom();
    this.clearCrosshairs();
  }

  // 缓存模板设置的各种 DOM
  private cacheDoms() {
    const container = this.getContainer();
    const titleDom = container.getElementsByClassName(CssConst.TITLE_CLASS)[0];
    const listDom = container.getElementsByClassName(CssConst.LIST_CLASS)[0];
    this.set('titleDom', titleDom);
    this.set('listDom', listDom);
  }
  // 调整位置
  private resetPosition() {
    const x = this.get('x');
    const y = this.get('y');
    const offset = this.get('offset');
    const position = this.get('position');
    const region = this.get('region');
    const container = this.getContainer();
    const bbox = this.getBBox();
    const { width, height } = bbox;
    let limitBox;
    if (region) {
      // 不限制位置
      limitBox = regionToBBox(region);
    }
    const point = getAlignPoint(x, y, offset, width, height, position, limitBox);
    modifyCSS(container, {
      left: toPx(point.x),
      top: toPx(point.y),
    });
  }
  // 重置 title
  private resetTitle() {
    const title = this.get('title');
    const showTitle = this.get('showTitle');
    if (showTitle && title) {
      this.setTitle(title);
    } else {
      this.setTitle('');
    }
  }
  // 设置 title 文本
  private setTitle(text) {
    const titleDom = this.get('titleDom');
    if (titleDom) {
      titleDom.innerText = text;
    }
  }
  // 终止 crosshair
  private resetCrosshairs() {
    const crosshairsRegion = this.get('crosshairsRegion');
    const crosshairs = this.get('crosshairs');
    if (!crosshairsRegion || !crosshairs) {
      // 不显示 crosshair，都移除，没有设定 region 也都移除掉
      this.clearCrosshairs();
    } else {
      const crosshairBox = regionToBBox(crosshairsRegion);
      const xCrosshairDom = this.get('xCrosshairDom');
      const yCrosshairDom = this.get('yCrosshairDom');
      if (crosshairs === 'x') {
        this.resetCrosshair('x', crosshairBox);
        // 仅显示 x 的 crosshair，y 移除
        if (yCrosshairDom) {
          yCrosshairDom.remove();
          this.set('yCrosshairDom', null);
        }
      } else if (crosshairs === 'y') {
        this.resetCrosshair('y', crosshairBox);
        // 仅显示 y 的 crosshair，x 移除
        if (xCrosshairDom) {
          xCrosshairDom.remove();
          this.set('xCrosshairDom', null);
        }
      } else {
        this.resetCrosshair('x', crosshairBox);
        this.resetCrosshair('y', crosshairBox);
      }
    }
  }
  // 设定 crosshair 的位置，需要区分 x,y
  private resetCrosshair(name: string, bbox) {
    const croshairDom = this.checkCrosshair(name);
    const value = this.get(name);
    if (name === 'x') {
      modifyCSS(croshairDom, {
        left: toPx(value),
        top: toPx(bbox.y),
        height: toPx(bbox.height),
      });
    } else {
      modifyCSS(croshairDom, {
        top: toPx(value),
        left: toPx(bbox.x),
        width: toPx(bbox.width),
      });
    }
  }
  // 如果 crosshair 对应的 dom 不存在，则创建
  private checkCrosshair(name: string) {
    const domName = `${name}CrosshairDom`;
    const tplName = `${name}CrosshairTpl`;
    const constName = `CROSSHAIR_${name.toUpperCase()}`;
    const styleName = CssConst[constName];
    let croshairDom = this.get(domName);
    const parent = this.get('parent') as HTMLElement;
    if (!croshairDom) {
      croshairDom = createDom(this.get(tplName)); // 创建
      this.applyStyle(styleName, croshairDom); // 设置初始样式
      parent.appendChild(croshairDom); // 添加到跟 tooltip 同级的目录下
      this.set(domName, croshairDom);
    }
    return croshairDom;
  }
  // 样式需要进行合并，不能单纯的替换，否则使用非常不方便
  private resetStyles() {
    let style = this.get('domStyles');
    const defaultStyles = this.get('defaultStyles');
    if (!style) {
      style = defaultStyles;
    } else {
      style = deepMix({}, defaultStyles, style);
    }
    this.set('domStyles', style);
  }
  // 应用所有的样式
  private applyStyles() {
    const domStyles = this.get('domStyles');
    const container = this.getContainer();
    this.applyChildrenStyles(container, domStyles);
    if (hasClass(container, CssConst.CONTAINER_CLASS)) {
      const containerCss = domStyles[CssConst.CONTAINER_CLASS];
      modifyCSS(container, containerCss);
    }
  }

  private applyChildrenStyles(element, styles) {
    each(styles, (style, name) => {
      const elements = element.getElementsByClassName(name);
      each(elements, (el) => {
        modifyCSS(el, style);
      });
    });
  }
  // 应用到单个 DOM
  private applyStyle(cssName, dom) {
    const domStyles = this.get('domStyles');
    modifyCSS(dom, domStyles[cssName]);
  }

  private renderItems() {
    this.clearItemDoms();
    const items = this.get('items');
    const itemTpl = this.get('itemTpl');
    const listDom = this.get('listDom');
    each(items, (item) => {
      const domStr = substitute(itemTpl, item);
      const itemDom = createDom(domStr);
      listDom.appendChild(itemDom);
    });
    this.applyChildrenStyles(listDom, this.get('domStyles'));
  }

  private clearItemDoms() {
    clearDom(this.get('listDom'));
  }

  private clearCrosshairs() {
    const xCrosshairDom = this.get('xCrosshairDom');
    const yCrosshairDom = this.get('yCrosshairDom');
    xCrosshairDom && xCrosshairDom.remove();
    yCrosshairDom && yCrosshairDom.remove();
    this.set('xCrosshairDom', null);
    this.set('yCrosshairDom', null);
  }
}

export default Tooltip;
