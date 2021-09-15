import { DISPLAY_OBJECT_EVENT } from '@antv/g';
import type { DisplayObject } from '@antv/g';

type CONFIG = { [key: string]: any };

declare function cfgParser(cfg: CONFIG): CONFIG;

/**
 * @param cfg 布局信息
 */
export function flexLayout(cfg: CONFIG) {
  // 每个节点的 x, w, width, height 信息
  const layoutCfg = cfgParser(cfg);
  return function (target: DisplayObject, propertyKey: keyof DisplayObject, descriptor: PropertyDescriptor) {
    function layout() {
      Object.entries(layoutCfg).forEach(([selector, style]) => {
        target.querySelector(selector)?.attr(style);
      });
      target[propertyKey]();
    }

    // 监听到 ChildInserted, ChildRemoved 事件后进行布局
    target.addEventListener(DISPLAY_OBJECT_EVENT.ChildInserted, layout);
    target.addEventListener(DISPLAY_OBJECT_EVENT.ChildRemoved, layout);
  };
}
