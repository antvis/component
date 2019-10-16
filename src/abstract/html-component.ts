import { ComponentCfg, HtmlComponentCfg } from '../types';
import Component from './component';

abstract class HtmlComponent<T extends ComponentCfg = HtmlComponentCfg> extends Component {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      container: null,
    };
    return cfg;
  }

  /**
   * 显示组件
   */
  public show() {
    const container = this.get('container');
    container.style.display = '';
  }
  /**
   * 隐藏组件
   */
  public hide() {
    const container = this.get('container');
    container.style.display = 'none';
  }

  public destroy() {
    this.removeEvent();
    this.removeDom();
    super.destroy();
  }
  /**
   * @protected
   * 复写 init，主要是初始化 DOM 和事件
   */
  protected init() {
    this.initDom();
    this.initEvent();
  }
  /**
   * @protected
   */
  protected abstract initDom();

  /**
   * @protected
   * 初始化事件
   */
  protected abstract initEvent();

  /**
   * @protected
   * 清理 DOM
   */
  protected abstract removeDom();

  /**
   * @protected
   * 清理事件
   */
  protected abstract removeEvent();
}

export default HtmlComponent;
