import { ComponentOptions, GUI, PrefixStyleProps } from '../../core';
import type { DisplayObject, GroupStyleProps, PathStyleProps, TextStyleProps } from '../../shapes';
import { Group } from '../../shapes';
import { classNames, ifShow, select, splitStyle, subStyleProps, type Selection } from '../../util';
import { HANDLE_DEFAULT_CFG, HANDLE_ICON_DEFAULT_CFG, HANDLE_LABEL_DEFAULT_CFG } from './constant';

export type IconStyleProps = PathStyleProps & {
  size?: number;
  radius?: number;
  shape?: string | (() => DisplayObject);
  orientation?: 'horizontal' | 'vertical';
};

export type LabelStyleProps = Partial<TextStyleProps>;

export type HandleStyleProps = GroupStyleProps &
  PrefixStyleProps<LabelStyleProps, 'label'> &
  PrefixStyleProps<IconStyleProps, 'icon'> & {
    orientation?: IconStyleProps['orientation'];
    showLabel?: boolean;
    spacing?: number;
    type?: 'start' | 'end';
  };

export type HandleOptions = ComponentOptions<HandleStyleProps>;

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

class HandleIcon extends GUI<IconStyleProps> {
  render(attributes: Required<IconStyleProps>, container: DisplayObject) {
    const { size = 10, radius = size / 4, orientation, ...iconStyle } = attributes;
    // 默认手柄
    const width = size!;
    const height = width * 2.4;

    const rect = select(container)
      .maybeAppendByClassName(CLASS_NAMES.iconRect, 'rect')
      .styles({
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

    rect.maybeAppendByClassName(`${CLASS_NAMES.iconLine}-1`, 'line').styles({ x1, x2: x1, y1, y2, ...iconStyle });
    rect.maybeAppendByClassName(`${CLASS_NAMES.iconLine}-2`, 'line').styles({ x1: x2, x2, y1, y2, ...iconStyle });

    rect.node().setOrigin(width / 2, height / 2);
    if (orientation === 'vertical') container.setLocalEulerAngles(90);
    else container.setLocalEulerAngles(0);
  }
}

export class Handle extends GUI<HandleStyleProps> {
  private label!: Selection;

  private icon!: Selection;

  constructor(options: HandleOptions) {
    super(options, HANDLE_DEFAULT_CFG);
  }

  private renderLabel(container: Group) {
    const { showLabel } = this.attributes;
    const style = subStyleProps(this.attributes, 'label');
    const [labelStyle, groupStyle] = splitStyle(style, []);

    const labelGroup = select(container).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g').styles(groupStyle);
    ifShow(!!showLabel, labelGroup, (group) => {
      this.label = group
        .maybeAppendByClassName(CLASS_NAMES.label, 'text')
        .styles({ ...HANDLE_LABEL_DEFAULT_CFG, ...labelStyle });

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
    const { orientation } = this.attributes;
    const iconStyle = { orientation, ...HANDLE_ICON_DEFAULT_CFG, ...subStyleProps(this.attributes, 'icon') };
    const {
      iconShape = () => {
        return new HandleIcon({ style: iconStyle });
      },
    } = this.attributes;

    this.icon = select(container).maybeAppendByClassName(CLASS_NAMES.icon, iconShape).update(iconStyle);
  }

  public render(attributes: HandleStyleProps, container: Group) {
    this.renderIcon(container);
    this.renderLabel(container);
  }
}
