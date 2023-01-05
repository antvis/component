import { deepMix, assign } from '@antv/util';
import type { Group, Rect } from '@antv/g';
import { maybeAppend } from '../../util';
import { GUI } from '../../core/gui';
import type { GUIOption } from '../../types';
import type { CheckboxStyleProps, CheckboxOptions } from './types';

import { LABEL_TEXT_STYLE, CHECKBOX_RECT_STYLE, CHECKED_SHAPE_STYLE } from './constant';

export type { CheckboxStyleProps, CheckboxOptions };

function getLablePosition(shape: Rect, spacing?: number) {
  const bounds = shape.getLocalBounds();

  return {
    x: bounds.halfExtents[0] ? bounds.max[0] + (spacing || 0) : (shape.style.x as number),
    y: bounds.halfExtents[1] ? (bounds.min[1] + bounds.max[1]) / 2 : (shape.style.y as number),
  };
}

export class Checkbox extends GUI<Required<CheckboxStyleProps>> {
  /**
   * 组件 checkbox
   */
  public static tag = 'checkbox';

  /**  checkbox 的背景方框组件 */
  private checkboxBoxShape!: Rect;

  /** 值 */
  private checked!: boolean;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<CheckboxStyleProps> = {
    style: {
      x: 0,
      y: 0,
      label: {
        text: '',
        ...LABEL_TEXT_STYLE,
      },
      spacing: 4,
      checked: false,
    },
  };

  constructor(options: CheckboxOptions) {
    super(deepMix({}, Checkbox.defaultOptions, options));
  }

  public render(attributes: CheckboxStyleProps, container: Group) {
    const { label, boxStyle, checkedStyle, checked, spacing } = attributes;
    this.checked = !!checked;
    const group = maybeAppend(container, '.checkbox-content', 'g').attr('className', 'checkbox-content').node();

    const checkboxBoxStyle = assign(
      {} as any,
      this.checked ? CHECKBOX_RECT_STYLE.selected : CHECKBOX_RECT_STYLE.default,
      boxStyle
    );
    const checkboxBoxCheckedStyle = assign({} as any, CHECKED_SHAPE_STYLE, checkedStyle);

    this.checkboxBoxShape = maybeAppend(group, '.checkbox-box', 'rect')
      .styles({
        className: 'checkbox-box',
        zIndex: (group.style.zIndex || 0) - 1,
        ...checkboxBoxStyle,
      })
      .node();

    maybeAppend(this.checkboxBoxShape, '.checkbox-checked', 'path').styles({
      className: 'checkbox-box-checked',
      stroke: '#fff',
      ...checkboxBoxCheckedStyle,
    });

    const { x, y } = getLablePosition(this.checkboxBoxShape, Number(spacing));

    maybeAppend(group, '.checkbox-label', 'text').styles({
      className: 'checkbox-label',
      x,
      y,
      ...label,
    });
  }
}
