import { Rect, Path, PathStyleProps, AABB } from '@antv/g';
import { deepMix, isFunction, isNil, isUndefined } from '@antv/util';
import type { RectStyleProps } from '@antv/g';
import { Text, TextCfg } from '../text';
import { GUI } from '../../core/gui';
import type { GUIOption } from '../../types';
import type { CheckboxCfg, CheckboxOptions } from './types';
import { LABEL_TEXT_STYLE, CHECKBOX_RECT_STYLE } from './constant';

export type { CheckboxCfg, CheckboxOptions };

export class Checkbox extends GUI<Required<CheckboxCfg>> {
  /**
   * 组件 switch
   */
  public static tag = 'checkbox';

  /**  checkbox 的背景方框组件 */
  private checkboxBackgroundShape!: Rect;

  /** checkbox checked 时的✅ */
  private checkedShape!: Path;

  /** label 组件 */
  private labelShape!: Text | undefined;

  /** 值 */
  private checked!: boolean;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<CheckboxCfg> = {
    type: Checkbox.tag,
    style: {
      x: 0,
      y: 0,
      label: {
        text: '',
        textStyle: LABEL_TEXT_STYLE,
        spacing: 4,
      },
      defaultChecked: false,
      style: {
        default: CHECKBOX_RECT_STYLE.default,
        selected: CHECKBOX_RECT_STYLE.selected,
        active: CHECKBOX_RECT_STYLE.active,
        disabled: CHECKBOX_RECT_STYLE.disabled,
      },
      disabled: false,
    },
  };

  constructor(options: CheckboxOptions) {
    super(deepMix({}, Checkbox.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.initChecked(); // 初始化 checked
    this.initShape(); // 初始化组件
    this.bindEvents(); // 添加交互
    this.labelShape && this.verticalCenter(); // 垂直居中
  }

  /**
   * 组件的更新
   */
  public update(cfg?: Partial<CheckboxCfg>) {
    this.attr(deepMix({}, this.attributes, cfg));
    this.updateShape();
    this.labelShape && this.verticalCenter(); // 垂直居中
  }

  /**
   * 组件的清理
   */
  public clear() {}

  /**
   * 组件的销毁
   */
  public destroy() {
    this.checkedShape.destroy();
    this.checkboxBackgroundShape.destroy();
    this.labelShape && this.labelShape.destroy();
    super.destroy();
  }

  public get label() {
    return this.labelShape;
  }

  public get checkbox() {
    return this.checkboxBackgroundShape;
  }

  /**
   * 初始化创建
   */
  private initShape() {
    // 初始化创建 checkbox 背景小方块
    this.checkboxBackgroundShape = this.createCheckboxBackgroundShape();
    this.checkedShape = this.createCheckedShape();
    if (!isNil(this.getAttribute('label')) && !isUndefined(this.getAttribute('label')))
      this.labelShape = this.createLabelShape();

    this.checkboxBackgroundShape.appendChild(this.checkedShape);
    this.labelShape && this.checkboxBackgroundShape.appendChild(this.labelShape);
    this.appendChild(this.checkboxBackgroundShape);
  }

  private createCheckboxBackgroundShape(): Rect {
    const { x, y, style, checked, disabled } = this.attributes;
    let styles = style.default;

    if (disabled) {
      styles = style.disabled;
    } else if (checked) {
      styles = style.selected;
    }

    return new Rect({
      style: { ...(styles as RectStyleProps), x, y },
    });
  }

  private createLabelShape(): Text {
    const {
      disabled,
      label: { text, spacing, textStyle },
    } = this.attributes;
    const { width } = this.checkboxBackgroundShape.attributes;
    return new Text({
      name: 'label',
      style: {
        ...(textStyle as TextCfg),
        text,
        x: (width as number) + (spacing as number),
        fontColor: disabled ? 'rgba(0,0,0,0.25)' : (textStyle?.stroke as string),
      },
    });
  }

  private createCheckedShape(): Path {
    const { disabled, checked } = this.attributes;
    const CHECKED_SHAPE_PATH = [
      ['M', 3, 6],
      ['L', '5', '8.5'],
      ['L', '8.5', '4'],
    ] as any;

    const CHECKED_SHAPE_STYLE = {
      path: CHECKED_SHAPE_PATH,
      stroke: disabled ? 'rgba(0,0,0,0.25)' : '#ffffff',
    } as PathStyleProps;

    const checkedShape = new Path({ style: CHECKED_SHAPE_STYLE });
    !checked && checkedShape.setAttribute('visibility', 'hidden');
    return checkedShape;
  }

  // 初始化 checked 和 defaultChecked
  private initChecked() {
    const { defaultChecked, checked } = this.attributes;
    this.checked = !!(isNil(checked) ? defaultChecked : checked);
    this.setAttribute('checked', this.checked);
  }

  // Shape 组件更新
  private updateShape() {
    this.updateCheckboxShape();
    this.updateCheckedShape();
    // 当label传入不存在时,销毁labelShape
    if (isUndefined(this.getAttribute('label')) || isNil(this.getAttribute('label'))) {
      this.labelShape && this.labelShape.destroy();
      this.labelShape = undefined;
    } else if (this.labelShape) {
      // 当label存在时，根据labelshape存在与否决定创建或更新
      this.updateLabelShape();
    } else {
      this.createLabelShape();
    }
    if (this.getAttribute('disabled')) {
      this.removeEvents();
    }
  }

  private updateCheckedShape() {
    const { disabled, checked } = this.attributes;
    this.checkedShape.setAttribute('stroke', disabled ? 'rgba(0,0,0,0.25)' : '#ffffff');
    this.checkedShape.setAttribute('visibility', checked ? 'visible' : 'hidden');
  }

  private updateLabelShape() {
    const {
      disabled,
      label: { text, spacing, textStyle },
    } = this.attributes;
    const { width } = this.checkboxBackgroundShape.attributes;
    this.labelShape!.setAttribute('text', text as string);
    this.labelShape!.setAttribute('x', (width as number) + (spacing as number));
    Object.entries(textStyle || {}).forEach(([key, value]) =>
      this.labelShape!.setAttribute(key as keyof TextCfg, value as any)
    );
    if (disabled) {
      this.labelShape!.update({ fontColor: 'rgba(0,0,0,0.25)' });
    }
  }

  private updateCheckboxShape() {
    const { style, checked, disabled } = this.attributes;
    this.checked = checked;
    const { selected: selectedStyle, default: defaultStyle, disabled: disabledStyle } = style;
    if (disabled) {
      Object.entries(disabledStyle || {}).forEach(([key, value]) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, value as any);
      });
      return;
    }
    if (checked) {
      Object.entries(selectedStyle || {}).forEach(([key, value]) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, value as any);
      });
      this.checkedShape.setAttribute('visibility', 'visible');
    } else {
      Object.entries(defaultStyle || {}).forEach(([key, value]) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, value as any);
      });
      this.checkedShape.setAttribute('visibility', 'hidden');
    }
  }

  private bindEvents(): void {
    if (this.attributes.disabled) return;
    this.addClick();
    this.addHover();
  }

  private removeEvents() {
    this.checkboxBackgroundShape.removeAllEventListeners();
  }

  private addHover() {
    this.checkboxBackgroundShape.addEventListener('mouseenter', () => {
      if (this.checked) return;
      const {
        style: { active: activeStyle },
      } = this.attributes;
      Object.entries(activeStyle || {}).forEach(([key, value]) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, value as any);
      });
    });
    this.checkboxBackgroundShape.addEventListener('mouseleave', () => {
      if (this.checked) return;
      const {
        style: { default: defaultStyle },
      } = this.attributes;
      Object.entries(defaultStyle || {}).forEach(([key, value]) => {
        this.checkboxBackgroundShape.setAttribute(key as keyof RectStyleProps, value as any);
      });
    });
  }

  private addClick() {
    this.checkboxBackgroundShape.addEventListener('click', () => {
      const { onChange } = this.attributes;
      this.checked = !this.checked;
      this.setAttribute('checked', this.checked);
      this.updateShape();
      isFunction(onChange) && onChange(this.checked);
    });
  }

  private verticalCenter() {
    const { height } = this.checkboxBackgroundShape.attributes;
    const { lineHeight: labelHeight } = this.labelShape!.attributes;
    this.labelShape!.setAttribute('y', ((height as number) - (labelHeight as number)) / 2);
  }

  public get labelBounds() {
    return this.labelShape?.getBounds() as AABB;
  }

  public get checkboxBounds() {
    return this.checkboxBackgroundShape.getBounds() as AABB;
  }
}
