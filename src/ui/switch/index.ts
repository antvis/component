import type { Group, Rect } from '@antv/g';
import { deepMix, get, isEqual } from '@antv/util';
import { BaseComponent } from '../../util/create';
import { Tag } from '../tag';
import type { GUIOption } from '../../types';
import { SIZE_STYLE } from './constant';
import { maybeAppend, applyStyle } from '../../util';
import type { SwitchStyleProps, SwitchOptions } from './types';

export type { SwitchStyleProps, SwitchOptions };

// 开启颜色 默认
const OPTION_COLOR = '#1890FF';
// 关闭颜色 默认
const CLOSE_COLOR = '#00000040';

function getHandleShapeStyle(shape: Rect, spacing: number = 0, checked: boolean = true) {
  const size = Number(shape.style.height) - spacing * 2;

  return {
    x: checked ? Number(shape.style.width) + Number(shape.style.x) - spacing - size : Number(shape.style.x) + spacing,
    y: Number(shape.style.y) + spacing,
    width: size,
    height: size,
    radius: size / 2,
  };
}

function getTagShapeStyle(
  backgroundStyle: any,
  { width, height }: { width: number; height: number },
  spacing: number = 0,
  checked: boolean = true
) {
  return {
    x: checked
      ? Number(backgroundStyle.x) + spacing
      : Number(backgroundStyle.width) + Number(backgroundStyle.x) - width,
    y: Number(backgroundStyle.y) + (Number(backgroundStyle.height) - height) / 2,
  };
}

export class Switch extends BaseComponent<Required<SwitchStyleProps>> {
  /**
   * 组件 switch
   */
  public static tag = 'switch';

  /**
   *  开关
   */
  private checked!: boolean;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<SwitchStyleProps> = {
    type: Switch.tag,
    style: {
      x: 0,
      y: 0,
      spacing: 2,
      checked: true,
      disabled: false,
    },
  };

  constructor(options: SwitchOptions) {
    super(deepMix({}, Switch.defaultOptions, options));
  }

  public render(attributes: SwitchStyleProps, container: Group) {
    const { size = 'default', spacing, disabled, checked, unCheckedChildren, checkedChildren } = attributes;

    const group = maybeAppend(container, '.switch-content', 'g').attr('className', 'switch-content').node();
    const bounds = group.getLocalBounds();

    const { sizeStyle, tagStyle } = get(SIZE_STYLE, size, SIZE_STYLE.default);

    // 其他统一属性
    const cursor = disabled ? 'no-drop' : 'pointer';
    const color = checked ? OPTION_COLOR : CLOSE_COLOR;

    // 背景位置大小配置
    let backgroundStyle = sizeStyle;

    // Tag 配置, 创建
    const tagCfg = checked ? checkedChildren : unCheckedChildren;
    if (checkedChildren || unCheckedChildren) {
      maybeAppend(group, '.switch-tag', () => new Tag({}))
        .attr('className', 'switch-tag')
        .call((selection) => {
          const tagShape = selection.node() as Tag;
          tagShape.update(
            deepMix(
              {
                cursor,
                backgroundStyle: null,
                text: false,
                marker: false,
              },
              tagStyle,
              tagCfg
            )
          );

          // 增加 整体宽度 需要对 tag 提前渲染获得 width 然后通过 width 计算 x 的位置
          const { max, min } = tagShape?.getLocalBounds();
          const width = max[0] - min[0] + sizeStyle.radius;
          const height = max[1] - min[1];

          // 计算获得背景宽度
          const backgroundWidth = Math.max(width + sizeStyle.height + 2, sizeStyle.width);

          backgroundStyle = {
            ...sizeStyle,
            width: backgroundWidth,
          };

          tagShape.update(
            getTagShapeStyle(
              {
                x: bounds.min[0],
                y: bounds.min[1],
                width: backgroundWidth,
                height: backgroundStyle.height,
              },
              { width, height },
              backgroundStyle.radius,
              checked
            )
          );
        });
    }

    // 背景 组件
    const backgroundShape = maybeAppend(group, '.switch-background', 'rect')
      .attr('className', 'switch-background')
      .style('zIndex', (group.style.zIndex || 0) - 1)
      .style('x', bounds.min[0])
      .style('y', bounds.min[1])
      .style('fill', color)
      .style('cursor', cursor)
      .style('fillOpacity', disabled ? 0.4 : 1)
      .call(applyStyle, backgroundStyle)
      .node() as Rect;

    // 背景阴影动效 组件
    const backgroundStrokeShape = maybeAppend(group, '.switch-background-stroke', 'rect')
      .attr('className', 'switch-background-stroke')
      .style('zIndex', (group.style.zIndex || 0) - 2)
      .style('x', bounds.min[0])
      .style('y', bounds.min[1])
      .style('stroke', color)
      .style('lineWidth', 0)
      .call(applyStyle, backgroundStyle)
      .node() as Rect;

    // 控件 组件
    maybeAppend(group, '.switch-handle', 'rect')
      .attr('className', 'switch-handle')
      .style('fill', '#fff')
      .style('cursor', cursor)
      .call((selection) => {
        const handleShape = selection.node() as Rect;

        // 动画添加 通过获取 开启 和 关闭的 x 来实现动画效果
        const newHandleShapeStyle = getHandleShapeStyle(backgroundShape as any, spacing, checked);
        const oldHandleShapeStyle = getHandleShapeStyle(backgroundShape as any, spacing, !checked);
        if (handleShape.attr('x') && !isEqual(newHandleShapeStyle, oldHandleShapeStyle) && this.checked !== checked) {
          // 调整控件 和 tag 位置
          handleShape.attr(oldHandleShapeStyle);

          // 清理之前的动画
          handleShape.getAnimations()[0]?.cancel();
          backgroundStrokeShape.getAnimations()[0]?.cancel();

          // 控件组建变化添加动画 动画为 原 x -> 新 x
          handleShape.animate([{ x: oldHandleShapeStyle.x }, { x: newHandleShapeStyle.x }], {
            duration: 120,
            fill: 'both',
          });

          // 动效组件变化添加动画 动画为 由内向外的 渐淡扩散
          backgroundStrokeShape.animate(
            [
              { lineWidth: 0, strokeOpacity: 0.5 },
              { lineWidth: 14, strokeOpacity: 0 },
            ],
            {
              duration: 400,
              easing: 'ease-on',
            }
          );
        } else {
          handleShape.attr(newHandleShapeStyle);
        }
      });

    this.checked = !!checked;
  }
}
