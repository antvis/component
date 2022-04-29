import { DisplayObject, Group, Rect, Text } from '@antv/g';
import { GUIOption } from 'types';
import { deepAssign, TEXT_INHERITABLE_PROPS } from '../../util';
import { GUI } from '../../core/gui';
import { FeatureCtor, ToolboxCfg, ToolboxOptions } from './types';
import { download, reset, reload } from './items';

const FEETURE_CLS = 'feature-item';
class Toolbox extends GUI<ToolboxCfg> {
  /**
   * 组件类型
   */
  public static tag = 'toolbox';

  /**
   * 默认参数
   */
  private static defaultOptions: GUIOption<ToolboxCfg> = {
    type: Toolbox.tag,
    style: {
      spacing: 8,
      features: [],
      textStyle: {
        ...TEXT_INHERITABLE_PROPS,
        fill: 'rgba(0,0,0,0.65)',
        textBaseline: 'top',
        textAlign: 'center',
      },
      markerSize: 24,
      markerStyle: {
        default: {
          stroke: '#666',
        },
        active: {
          stroke: '#3471F9',
        },
      },
    },
  };

  protected static features: Map<string, FeatureCtor> = new Map();

  /**
   * 当前激活的 feature
   */
  private activeFeatures: Set<string> = new Set();

  /**
   * 注册菜单项
   */
  public static registerFeatures(name: string, f: FeatureCtor): void {
    Toolbox.features.set(name, f);
  }

  constructor(options: ToolboxOptions) {
    super(deepAssign({}, Toolbox.defaultOptions, options));
    this.init();
    this.layout();
  }

  /**
   * 组件的初始化。添加 Toolbox 的各种操作菜单项
   */
  public init(): void {
    // 获取用户传入的自定义属性
    const { x = 0, y = 0, width, height, features, markerStyle, textStyle = {}, markerSize = 24 } = this.attributes;
    let clipPath = null;
    if (width || height) {
      clipPath = new Rect({
        style: { x, y, width: width ?? Number.MAX_SAFE_INTEGER, height: height ?? Number.MAX_SAFE_INTEGER },
      });
    }
    const container = new Group({ id: 'container', style: { x, y, clipPath } });
    features.forEach((feature) => {
      const markerCtor = Toolbox.features.get(feature);
      if (markerCtor) {
        const marker = markerCtor({ size: markerSize });
        marker.className = FEETURE_CLS;
        const itemContainer = new Rect({ style: { x: 0, y: 0, width: markerSize, height: markerSize } });
        const text = new Text({ style: { x: 0, y: 0, text: feature, ...textStyle, fillOpacity: 0 } });
        // itemContainer 包含 actionItem + text
        itemContainer.appendChild(marker);
        itemContainer.appendChild(text);
        // 设置样式
        Object.entries(markerStyle?.default || {}).forEach(([key, value]) => marker.setAttribute(key, value));
        this.bindEvent(itemContainer, text, feature);
        // 放到 container 中
        container.appendChild(itemContainer);
      }
    });
    this.appendChild(container);
  }

  /**
   * 对元素进行布局
   */
  protected layout() {
    const { spacing = 0 } = this.attributes;

    const container = this.getElementById('container') as Group;
    const features = container.children as Rect[];
    features.reduce((dx, feature) => {
      const bbox = feature.getBoundingClientRect();
      feature.setLocalPosition(dx, 0);
      (feature.getElementsByTagName('text')[0] as Text).translateLocal(bbox.width / 2, bbox.height);
      return dx + bbox.width + spacing;
    }, 0);
  }

  public update() {
    // todo
  }

  public clear() {}

  /**
   * 绑定事件
   */
  private bindEvent(item: DisplayObject, textShape: DisplayObject, name: string) {
    const { markerStyle, textStyle, onClick } = this.attributes;
    const feature = item.firstChild as DisplayObject;
    if (!feature) return;

    item.addEventListener('mouseenter', () => {
      item.setAttribute('cursor', 'pointer');
      textShape.setAttribute('fillOpacity', textStyle?.fillOpacity ?? 1);
    });
    item.addEventListener('mouseleave', () => {
      item.setAttribute('cursor', 'default');
      textShape.setAttribute('fillOpacity', 0);
    });

    if (typeof onClick !== 'function') return;
    item.addEventListener('click', (e: any) => {
      // 设置样式
      const { activeFeatures } = this;
      const defaultStyles = markerStyle?.default || {};
      const activeStyles = markerStyle?.active || {};

      if (!activeFeatures.has(feature.name)) {
        Object.entries(activeStyles).forEach(([key, value]) => feature.setAttribute(key, value));
        activeFeatures.add(feature.name);
      } else {
        Object.entries(defaultStyles).forEach(([key, value]) => feature.setAttribute(key, value));
        activeFeatures.delete(feature.name);
      }

      onClick.call(this, name, e);
    });
  }
}

/**
 * 注册 Toolbox 组件需要的 features 才当
 */
Toolbox.registerFeatures('reset', reset);
Toolbox.registerFeatures('reload', reload);
Toolbox.registerFeatures('download', download);

export { Toolbox };
