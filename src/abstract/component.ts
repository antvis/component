
import { Base } from "@antv/g-base";
import {deepMix, each, isObject} from '@antv/util';


abstract class Component extends Base {

  constructor(cfg) {
    super(cfg);
    this.initCfg();
    this.init();
  }
  /**
   * @protected
   * 默认的配置项
   * @returns {object} 默认的配置项
   */
  public getDefaultCfg() {
    return {
      /**
       * 唯一标定组件的 id
       */
      id: '',
      /**
       * 组件名称， axis, legend, tooltip
       */
      name: '',
      /**
       * 组件的类型，同 name 配合使用可以确定具体组件的类型，例如：
       *  name: 'axis',
       *  type: 'line'
       */
      type: '',
      /**
       * 是否允许动画，不同组件允许动画的内容不同
       * @type {boolean}
       */
      animate: false,
      /**
       * 动画的配置项
       */
      animateCfg: {
        duration: 400,
        easing: 'easeQuadInOut'
      },
      /**
       * 事件对象，可以在配置项中传入事件
       * @example
       * events: {
       *   itemclick: ev => {
       *     
       *   }
       * }
       * // 等效于
       * component.on('itemclick', ev => {
       *   
       * });
       * @type {object}
       */
      events: null,
      /**
       * @protected
       * 配置项生效时的默认值，一些配置项是对象时，防止将一些内置的配置项清空，减少判空判断
       * @example
       * new Axis({
       *   tickLine: {
       *     length: 10 // 此时没有设置 style，内部调用 tickLine.style 时会出问题
       *   }
       * })
       */
      defaultCfg: {},
      /**
       * 是否可见
       * @type {true}
       */
      visible: true
    };
  }

  /**
   * 绘制组件
   */
  public render() {

  }

  /**
   * 显示
   */
  public show() { 

  }

  /**
   * 隐藏
   */
  public hide() {

  }

  /**
   * 清理组件的内容，一般配合 render 使用
   * @example
   * axis.clear();
   * axis.render();
   */
  public clear() {

  }

  /**
   * 更新组件
   * @param {object} cfg 更新属性
   */
  public update(cfg) {
    const defaultCfg = this.get('defaultCfg');
    each(cfg, (value, name) => {
      const originCfg = this.get(name);
      let newCfg = value;
      if (originCfg !== value) { // 判断两者是否相等，主要是进行 null 的判定
        if (isObject(value) && defaultCfg[name]) { // 新设置的属性与默认值进行合并
          newCfg = deepMix({}, defaultCfg[name], value);
        }
        this.set(name, newCfg);
      }
    });
  }

  /**
   * @protected
   * 初始化，用于具体的组件继承
   */
  protected init() {

  }

  // 将组件默认的配置项设置合并到传入的配置项
  private initCfg() {
    const defaultCfg = this.get('defaultCfg');
    each(defaultCfg, (value, name) => {
      const cfg = this.get(name);
      if (isObject(cfg)) {
        const newCfg = deepMix({}, value, cfg);
        this.set(name, newCfg);
      }
    });
  }

}

export default Component;