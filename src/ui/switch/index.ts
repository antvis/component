import { Rect, Line } from '@antv/g';
import { deepMix, isNil, omit, get, isPlainObject, assign, isFunction } from '@antv/util';
import type { RectStyleProps } from '@antv/g';
import { Tag } from '../tag';
import { GUI } from '../../core/gui';
import { getShapeSpace } from '../../util';
import type { TagCfg } from '../tag/types';
import type { GUIOption } from '../../types';
import type { SwitchCfg, SwitchOptions } from './types';

export type { SwitchCfg, SwitchOptions };

// 开启颜色 默认
const OPTION_COLOR = '#1890FF';
// 关闭颜色 默认
const CLOSE_COLOR = '#00000040';

// 默认tag 样式
const checkedChildrenStyle = {
  backgroundStyle: false,
  textStyle: {
    default: {
      fill: '#fff',
    },
  },
} as TagCfg;

export class Switch extends GUI<Required<SwitchCfg>> {
  /**
   * 组件 switch
   */
  public static tag = 'switch';

  /** 背景 组件 */
  private backgroundShape!: Rect;

  /** 动效 组件 */
  private rectStrokeShape!: Rect;

  /** 控件 组件 */
  private handleShape!: Rect;

  /** 选中时内容 组件 */
  private childrenShape: Tag[] = [];

  /** 轨迹 */
  private pathLineShape!: Line;

  /** sizeStyle */
  private sizeStyle!: RectStyleProps;

  /** 值 */
  private checked!: boolean;

  /** 默认值 */
  private defaultChecked!: boolean;

  /** 动画开启关闭 */
  private animateFlag!: boolean;

  /** 焦点 */
  private nowFocus: boolean = false;

  /** 其他交互开关 */
  private otherOnClick: boolean = true;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<SwitchCfg> = {
    type: Switch.tag,
    style: {
      x: 0,
      y: 0,
      size: 22,
      spacing: 2,
      textSpacing: 8,
      defaultChecked: true,
      style: {
        default: {
          stroke: CLOSE_COLOR,
          fill: CLOSE_COLOR,
        },
        selected: {
          stroke: OPTION_COLOR,
          fill: OPTION_COLOR,
        },
      },
    },
  };

  constructor(options: SwitchOptions) {
    super(deepMix({}, Switch.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.initChecked(); // 初始化checked
    this.initShape(); // 初始化组件
    this.update({}); // 更新组件
    this.bindEvents(); // 添加交互
  }

  // 获取checked
  public getChecked() {
    return this.checked;
  }

  /**
   * 组件的更新
   */
  public update(cfg?: Partial<SwitchCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));

    // 更新开关
    this.updateChecked();

    // 更新 shape attr
    this.updateShape();

    // 如果 修改了 checked 开启动画
    if (this.animateFlag) {
      this.animateSiwtch();
    }
  }

  // 失焦
  public blur() {
    this.nowFocus = false;
    this.clearBackgroundLineWidth();
  }

  // 聚焦
  public focus() {
    this.nowFocus = true;
    this.addBackgroundLineWidth();
  }

  /**
   * 组件的清理
   */
  public clear() {}

  /**
   * 组件的销毁
   */
  public destroy() {
    this.handleShape.destroy();
    this.backgroundShape.destroy();
    this.rectStrokeShape.destroy();
    this.pathLineShape.destroy();
    this.childrenShape[0]?.destroy();
    this.childrenShape[1]?.destroy();
    this.removeChildren(true);
    super.destroy();
  }

  /**
   * 初始化创建
   */
  private initShape() {
    // 初始化创建 背景
    this.backgroundShape = this.createBackgroundShape();

    // 初始化创建 动效
    this.rectStrokeShape = this.createRectStrokeShape();

    // 初始化创建 控件
    this.handleShape = this.createHandleShape();

    this.backgroundShape.appendChild(this.handleShape);

    this.appendChild(this.rectStrokeShape);
    this.appendChild(this.backgroundShape);
  }

  // 初始化checked 和 defaultChecked
  private initChecked() {
    const { defaultChecked, checked } = this.attributes;
    this.defaultChecked = !!(checked || defaultChecked);
    this.checked = !!(isNil(checked) ? defaultChecked : checked);
  }

  // 创建 背景Shape
  private createBackgroundShape() {
    return new Rect({
      name: 'background',
      style: {
        ...Switch.defaultOptions.style,
        ...this.sizeStyle,
        strokeOpacity: 0.2,
      },
    });
  }

  // 创建 动效Shape
  private createRectStrokeShape() {
    return new Rect({
      name: 'rectStroke',
      style: {
        ...Switch.defaultOptions.style,
        ...this.sizeStyle,
        lineWidth: 0,
        fill: '#efefef',
        strokeOpacity: 0.4,
      },
    });
  }

  // 创建 控件Shape
  private createHandleShape() {
    this.pathLineShape = new Line({ name: 'pathLine' });
    // 暂时使用 Rect 为之后的变形动画做准备
    return new Rect({
      name: 'handle',
      style: {
        width: 0,
        height: 0,
        fill: '#fff',
        offsetPath: this.pathLineShape,
      },
    });
  }

  // size 转化为 style
  private updateSizeStyle() {
    const size = Number(this.attributes.size) || (Switch.defaultOptions.style.size as number);
    const { width, height } = get(this.attributes, ['style', this.checked ? 'selected' : 'default']);
    this.sizeStyle = {
      width: width || size * 2,
      height: height || size,
      radius: height ? height / 2 : size / 2,
    };
  }

  // Shape 组件更新
  private updateShape() {
    // 更新 整个的 width height
    this.updateSizeStyle();
    // 创建/更新/销毁 开关显示标签 Shape
    this.updateCheckedChildrenShape();
    // 更新背景 + 动效
    this.updateBackgroundShape();
    // 更新控件
    this.updateHandleShape();
  }

  // 创建/更新/销毁 开关显示标签 Shape
  private updateCheckedChildrenShape() {
    ['checkedChildren', 'unCheckedChildren'].forEach((key, index) => {
      const children = get(this.attributes, key) as TagCfg;

      if (!this.childrenShape[index]) {
        this.childrenShape[index] = new Tag({
          name: key,
          style: checkedChildrenStyle,
        });
      }

      const childrenShape = this.childrenShape[index];
      const textSpacing = Number(this.attributes.textSpacing) || (Switch.defaultOptions.style.textSpacing as number);

      // children 为正常 对象 则更新
      if (isPlainObject(children)) {
        childrenShape.update({ ...omit(children, ['backgroundStyle', 'x']), x: 0 });

        // checked 控制这个有无
        (index === 0 ? this.checked : !this.checked)
          ? this.backgroundShape.appendChild(childrenShape)
          : this.backgroundShape.removeChild(childrenShape, false);

        // 位置 为 开启 textSpacing, 关闭 整体width - 本身 width - textSpacing
        childrenShape.update({
          x: index ? this.getShapeWidth() - getShapeSpace(childrenShape)?.width - textSpacing : textSpacing,
        });
      } else {
        this.backgroundShape.removeChild(childrenShape);
        childrenShape?.clear();
      }
    });
  }

  // 更新背景 + 动效
  private updateBackgroundShape() {
    const { style, disabled } = this.attributes;
    const width = this.getShapeWidth();
    const newAttr = assign({}, this.sizeStyle, { width }, get(style, this.checked ? 'selected' : 'default'));

    this.backgroundShape.attr({
      ...newAttr,
      fillOpacity: disabled ? 0.4 : 1,
      cursor: disabled ? 'no-drop' : 'pointer',
    });

    this.rectStrokeShape.attr(omit(newAttr, ['fill']));
  }

  // 更新控件
  private updateHandleShape() {
    const spacing = Number(this.attributes.spacing) || (Switch.defaultOptions.style.spacing as number);
    const { height, radius } = this.sizeStyle;
    const width = this.getShapeWidth();
    const r = Number(radius) - spacing;

    let updateAttr: RectStyleProps = {
      y: spacing,
      radius: r,
      width: r * 2,
      height: r * 2,
    };

    // 只有第一次的时候 才通过 width 改变 x 的位置, 使得它不会发生 animatyeFlag 时的闪烁
    if (!this.animateFlag) {
      updateAttr = {
        ...updateAttr,
        x: this.defaultChecked ? width - height + spacing : spacing,
      };
    }

    this.handleShape.attr(updateAttr);

    // 更新轨迹
    this.pathLineShape.attr({
      x1: width - height + spacing,
      y1: spacing,
      x2: spacing,
      y2: spacing,
    });
  }

  // 获取背景Shape宽度  在有tag 和 无tag 的情况下是不同的
  private getShapeWidth() {
    const width = Number(get(this.attributes.style, [this.checked ? 'selected' : 'default', 'width']));
    if (width) {
      return width;
    }

    const textSpacing = Number(this.attributes.textSpacing) || (Switch.defaultOptions.style.textSpacing as number);
    const childrenStyle = get(this.attributes, [this.checked ? 'checkedChildren' : 'unCheckedChildren']);
    const childrenShape = this.childrenShape[this.checked ? 0 : 1];
    const childrenWidth = childrenStyle ? getShapeSpace(childrenShape)?.width + textSpacing - this.sizeStyle.height : 0;

    return childrenWidth + this.sizeStyle.width;
  }

  // 更新 checked 如果 没有传入 checked 并且 checked 没有改变则不更新
  private updateChecked() {
    const { checked } = this.attributes;
    this.animateFlag = !(isNil(checked) || this.checked === !!checked);
    // 当不存在 checked 或 checked 没有改变 则不需要更改 checked 和 发生动效
    if (this.animateFlag) this.checked = !!checked;
  }

  /**
   * 添加交互
   * switch 的移入移除的焦点显示
   * switch 的点击切换
   */
  private bindEvents() {
    this.addSwitchMouseenter(); // 移入
    this.addSwitchMouseleave(); // 移出
    this.addSwitchClick(); // 点击
    this.addWindowClick(); // 外部 点击
  }

  // disabled 时 已经外部传入 checked时 禁止交互
  private banEvent(fn: Function) {
    const { disabled, checked } = this.attributes;
    if (disabled || !isNil(checked)) return;
    fn();
  }

  // 移入 switch 交互(去除焦点)
  private addSwitchMouseenter() {
    this.addEventListener('mouseenter', () => {
      this.otherOnClick = false;
      this.banEvent(() => {
        this.clearBackgroundLineWidth();
      });
    });
  }

  // 移出 switch 交互(显示焦点)
  private addSwitchMouseleave() {
    this.addEventListener('mouseleave', () => {
      this.otherOnClick = true;
      this.banEvent(() => {
        if (this.nowFocus) {
          this.addBackgroundLineWidth();
        }
      });
    });
  }

  // 点击 switch 交互
  private addSwitchClick() {
    this.addEventListener('click', (e) => {
      const { onClick, onChange, checked } = this.attributes;
      this.banEvent(() => {
        this.checked = checked || !this.checked;
        this.animateFlag = isNil(checked);
        this.nowFocus = true;
        isFunction(onChange) && onChange(this.checked);
        this.updateShape();
        this.animateSiwtch();
      });
      isFunction(onClick) && onClick(e, this.checked);
    });
  }

  // 移除焦点 交互
  private addWindowClick() {
    window.addEventListener('click', () => {
      if (this.otherOnClick) {
        this.nowFocus = false;
      }
      this.banEvent(() => {
        this.clearBackgroundLineWidth();
      });
    });
  }

  private clearBackgroundLineWidth() {
    this.backgroundShape.attr({
      lineWidth: 0,
    });
  }

  private addBackgroundLineWidth() {
    this.backgroundShape.attr({
      lineWidth: 5,
    });
  }

  /**
   * 变换 背景/控件 + 动画效果 + 动效
   * 触发这个方法的情况 :
   * 1、点击的时候
   * 2、update 改变 checked 的时候 外部控制 开关
   */
  private animateSiwtch() {
    // 点击动效
    this.rectStrokeShape.animate(
      [
        { lineWidth: 0, strokeOpacity: 0.5 },
        { lineWidth: 14, strokeOpacity: 0 },
      ],
      {
        duration: 400,
        easing: 'ease-on',
      }
    );

    // 中间控件 位置变换
    this.handleShape.animate(
      [
        { offsetDistance: this.checked ? 1 : 0 }, // 变换
        { offsetDistance: !this.checked ? 1 : 0 },
      ],
      {
        duration: 100,
        fill: 'forwards',
      }
    );
  }
}
