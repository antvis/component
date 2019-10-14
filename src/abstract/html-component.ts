import Component from './component';

abstract class HtmlComponent extends Component {
  public getDefaultCfg() { 
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      /**
       * 组件的 DOM 容器
       * @type {HTMLElement|string}
       */
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
  protected initDom() {

  }

  /**
   * @protected
   * 初始化事件
   */
  protected initEvent() {
    
  }

  /**
   * @protected
   * 清理 DOM
   */
  protected removeDom() {

  }

  /**
   * @protected
   * 清理事件
   */
  protected removeEvent() {

  }

}

export default HtmlComponent;