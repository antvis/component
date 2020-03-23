import { createDom } from '@antv/dom-util';
import { isNil, isString } from '@antv/util';
import { BBox, ComponentCfg, HtmlComponentCfg } from '../types';
import { clearDom, createBBox } from '../util/util';
import Component from './component';

abstract class HtmlComponent<T extends ComponentCfg = HtmlComponentCfg> extends Component<T> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      container: null,
      containerTpl: '<div></div>',
      updateAutoRender: true,
      parent: null,
    };
    return cfg;
  }

  public getContainer(): HTMLElement {
    return this.get('container') as HTMLElement;
  }

  /**
   * 显示组件
   */
  public show() {
    const container = this.get('container');
    container.style.display = '';
    this.set('visible', true);
  }
  /**
   * 隐藏组件
   */
  public hide() {
    const container = this.get('container');
    container.style.display = 'none';
    this.set('visible', false);
  }
  /**
   * 是否允许捕捉事件
   * @param capture 事件捕捉
   */
  public setCapture(capture) {
    const container = this.getContainer();
    const value = capture ? 'auto' : 'none';
    container.style.pointerEvents = value;
    this.set('capture', capture);
  }
  public getBBox(): BBox {
    const container = this.getContainer();
    const x = parseFloat(container.style.left) || 0;
    const y = parseFloat(container.style.top) || 0;
    return createBBox(x, y, container.clientWidth, container.clientHeight);
  }

  public clear() {
    const container = this.get('container');
    clearDom(container);
  }

  public destroy() {
    this.removeEvent();
    this.removeDom();
    super.destroy();
  }

  /**
   * 复写 init，主要是初始化 DOM 和事件
   */
  public init() {
    super.init();
    this.initContainer();
    this.initEvent();
    this.initCapture();
    this.initVisible();
  }

  protected initCapture() {
    this.setCapture(this.get('capture'));
  }
  protected initVisible() {
    if (!this.get('visible')) {
      // 设置初始显示状态
      this.hide();
    } else {
      this.show();
    }
  }

  protected initContainer() {
    let container = this.get('container');
    if (isNil(container)) {
      // 未指定 container 则创建
      container = this.createDom();
      let parent = this.get('parent');
      if (isString(parent)) {
        parent = document.getElementById(parent);
        this.set('parent', parent);
      }
      parent.appendChild(container);
      this.set('container', container);
    } else if (isString(container)) {
      // 用户传入的 id, 作为 container
      container = document.getElementById(container);
      this.set('container', container);
    } // else container 是 DOM
    if (!this.get('parent')) {
      this.set('parent', container.parentNode);
    }
  }

  /**
   * @protected
   */
  protected createDom() {
    const containerTpl = this.get('containerTpl');
    return createDom(containerTpl);
  }

  /**
   * @protected
   * 初始化事件
   */
  protected initEvent() {}

  /**
   * @protected
   * 清理 DOM
   */
  protected removeDom() {
    const container = this.get('container');
    container && container.parentNode.removeChild(container);
  }

  /**
   * @protected
   * 清理事件
   */
  protected removeEvent() {}
}

export default HtmlComponent;
