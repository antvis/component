import type { GroupStyleProps, PathStyleProps, TextStyleProps, DisplayObjectConfig, DisplayObject } from '@antv/g';
import { Group } from '@antv/g';
import { GUI } from '../../core/gui';
import type { PrefixedStyle } from '../../types';
import {
  applyStyle,
  classNames,
  select,
  subObject,
  deepAssign,
  type Selection,
  ifShow,
  styleSeparator,
} from '../../util';
import { createComponent } from '../../util/create';
import { HANDLE_DEFAULT_CFG, HANDLE_ICON_DEFAULT_CFG, HANDLE_LABEL_DEFAULT_CFG } from './constant';

export type IconStyleProps = PathStyleProps & {
  size?: number;
  radius?: number;
  shape?: string | (() => DisplayObject);
  orient?: 'horizontal' | 'vertical';
};

export type LabelStyleProps = TextStyleProps;

export interface HandleStyleProps
  extends GroupStyleProps,
    PrefixedStyle<LabelStyleProps, 'label'>,
    PrefixedStyle<IconStyleProps, 'icon'> {
  type?: 'start' | 'end';
  showLabel?: boolean;
  orient?: IconStyleProps['orient'];
}

const CLASS_NAMES = classNames(
  {
    labelGroup: 'label-group',
    label: 'label',
    icon: 'icon',
    iconRect: 'icon-rect',
    iconLine: 'icon-line',
  },
  'handle'
);

const HandleIcon = createComponent<IconStyleProps>({
  render(attributes, container) {
    const { size = 10, radius = size / 4, orient, class: className, ...iconStyle } = attributes;
    // 默认手柄
    const width = size!;
    const height = width * 2.4;

    const rect = select(container)
      .maybeAppendByClassName(CLASS_NAMES.iconRect, 'rect')
      .call(applyStyle, {
        ...iconStyle,
        width,
        height,
        radius,
        x: -width / 2,
        y: -height / 2,
      });

    const x1 = (1 / 3) * width;
    const x2 = (2 / 3) * width;
    const y1 = (1 / 4) * height;
    const y2 = (3 / 4) * height;

    rect
      .maybeAppendByClassName(`${CLASS_NAMES.iconLine}-1`, 'line')
      .call(applyStyle, { x1, x2: x1, y1, y2 })
      .call(applyStyle, iconStyle);
    rect
      .maybeAppendByClassName(`${CLASS_NAMES.iconLine}-2`, 'line')
      .call(applyStyle, { x1: x2, x2, y1, y2 })
      .call(applyStyle, iconStyle);

    rect.node().setOrigin(width / 2, height / 2);
    if (orient === 'vertical') container.setLocalEulerAngles(90);
    else container.setLocalEulerAngles(0);
  },
});

export class Handle extends GUI<HandleStyleProps> {
  private label!: Selection;

  private icon!: Selection;

  constructor(config: DisplayObjectConfig<HandleStyleProps>) {
    super(deepAssign({}, { style: HANDLE_DEFAULT_CFG }, config));
  }

  private renderLabel(container: Group) {
    const { showLabel } = this.attributes;
    const style = subObject(this.attributes, 'label');
    const [labelStyle, groupStyle] = styleSeparator(style, []);

    const labelGroup = select(container)
      .maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g')
      .call(applyStyle, groupStyle);
    ifShow(!!showLabel, labelGroup, (group) => {
      this.label = group
        .maybeAppendByClassName(CLASS_NAMES.label, 'text')
        .call(applyStyle, { ...HANDLE_LABEL_DEFAULT_CFG, ...labelStyle });

      /** avoid trigger event on label */
      this.label.on('mousedown', (e: MouseEvent) => {
        e.stopPropagation();
      });
      this.label.on('touchstart', (e: MouseEvent) => {
        e.stopPropagation();
      });
    });
  }

  private renderIcon(container: Group) {
    const {
      iconShape = () => {
        return new HandleIcon({ style: iconStyle });
      },
      orient,
    } = this.attributes;
    const iconStyle = { orient, ...HANDLE_ICON_DEFAULT_CFG, ...subObject(this.attributes, 'icon') };

    this.icon = select(container).maybeAppendByClassName(CLASS_NAMES.icon, iconShape).update(iconStyle);
  }

  public render(attributes: HandleStyleProps, container: Group) {
    this.renderIcon(container);
    this.renderLabel(container);
  }
}
