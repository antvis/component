import { Component } from '../../core';
import type { Group, Rect } from '../../shapes';
import { maybeAppend, subStyleProps } from '../../util';
import type { CheckboxOptions, CheckboxStyleProps } from './types';

import { CHECKBOX_RECT_STYLE, CHECKED_SHAPE_STYLE, LABEL_TEXT_STYLE } from './constant';

export type { CheckboxOptions };

export class Checkbox extends Component<CheckboxStyleProps> {
  public static tag = 'checkbox';

  private checkboxBoxShape!: Rect;

  private checked!: boolean;

  constructor(options: CheckboxOptions) {
    super(options, {
      labelText: '',
      spacing: 4,
      checked: false,
      ...LABEL_TEXT_STYLE,
    });
  }

  public render(attributes: Required<CheckboxStyleProps>, container: Group) {
    const { checked, spacing } = attributes;
    this.checked = !!checked;

    const group = maybeAppend(container, '.checkbox-content', 'g').attr('className', 'checkbox-content').node();

    const boxStyle = subStyleProps(attributes, 'box');
    const checkedStyle = subStyleProps(attributes, 'checked');
    const labelStyle = subStyleProps(attributes, 'label');

    const checkboxStyle = {
      ...(this.checked ? CHECKBOX_RECT_STYLE.selected : CHECKBOX_RECT_STYLE.default),
      ...boxStyle,
    };

    const checkboxBoxCheckedStyle = { ...CHECKED_SHAPE_STYLE, ...checkedStyle };

    // Create the box first
    this.checkboxBoxShape = maybeAppend(group, '.checkbox-box', 'rect')
      .styles({
        className: 'checkbox-box',
        ...checkboxStyle,
      })
      .node();

    // Only draw the checkmark if checked
    if (this.checked) {
      maybeAppend(group, '.checkbox-box-checked', 'path').styles({
        className: 'checkbox-box-checked',
        stroke: '#fff',
        ...CHECKED_SHAPE_STYLE,
        ...checkboxBoxCheckedStyle,
        zIndex: 9, // Ensure it's drawn above the box
      });
    }

    const { x, y } = this.getLabelPosition(this.checkboxBoxShape, Number(spacing));
    maybeAppend(group, '.checkbox-label', 'text').styles({
      className: 'checkbox-label',
      x,
      y,
      ...labelStyle,
    });
  }

  private getLabelPosition(shape: Rect, spacing?: number) {
    // getLocalBounds might differ slightly between rendering backends.
    // Make sure the shape is rendered before calling this if needed.
    const bounds = shape.getLocalBounds();
    return {
      x: bounds.halfExtents[0] ? bounds.max[0] + (spacing || 0) : (shape.style.x as number),
      y: bounds.halfExtents[1] ? (bounds.min[1] + bounds.max[1]) / 2 : (shape.style.y as number),
    };
  }
}
