import { Base } from '@antv/g-base';
import { deepMix, each, isObject } from '@antv/util';
import { BaseCfg, ComponentCfg } from '../types';

abstract class Component<T extends ComponentCfg = ComponentCfg> extends Base {
  constructor(cfg: T) {
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
      id: '',
      name: '',
      type: '',
      animate: false,
      animateCfg: {
        duration: 400,
        easing: 'easeQuadInOut',
      },
      events: null,
      defaultCfg: {},
      visible: true,
    };
  }

  /**
   * 清理组件的内容，一般配合 render 使用
   * @example
   * axis.clear();
   * axis.render();
   */
  public clear() {}

  /**
   * 更新组件
   * @param {object} cfg 更新属性
   */
  public update(cfg: Partial<T>) {
    const defaultCfg = this.get('defaultCfg');
    each(cfg, (value, name) => {
      const originCfg = this.get(name);
      let newCfg = value;
      if (originCfg !== value) {
        // 判断两者是否相等，主要是进行 null 的判定
        if (isObject(value) && defaultCfg[name]) {
          // 新设置的属性与默认值进行合并
          newCfg = deepMix({}, defaultCfg[name], value);
        }
        this.set(name, newCfg);
      }
    });
  }

  public abstract getBBox();

  /**
   * 绘制组件
   */
  protected abstract render();

  /**
   * 显示
   */
  protected abstract show();

  /**
   * 隐藏
   */
  protected abstract hide();

  /**
   * @protected
   * 初始化，用于具体的组件继承
   */
  protected init() {}

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
