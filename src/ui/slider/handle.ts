import { ComponentOptions, Component, PrefixStyleProps } from '../../core';
import type { DisplayObject, GroupStyleProps, PathStyleProps, TextStyleProps } from '../../shapes';
import { Group } from '../../shapes';
import type { Selection } from '../../util';
import { classNames, ifShow, select, splitStyle, subStyleProps } from '../../util';
import { HANDLE_DEFAULT_CFG, HANDLE_ICON_DEFAULT_CFG, HANDLE_LABEL_DEFAULT_CFG } from './constant';

export type HandleType = 'start' | 'end';

export type IconStyleProps = PathStyleProps & {
  size?: number;
  radius?: number;
  shape?: string | ((type: HandleType) => DisplayObject);
  orientation?: 'horizontal' | 'vertical';
};

export type LabelStyleProps = Partial<TextStyleProps>;

export type HandleStyleProps = GroupStyleProps &
  PrefixStyleProps<LabelStyleProps, 'label'> &
  PrefixStyleProps<IconStyleProps, 'icon'> & {
    orientation?: IconStyleProps['orientation'];
    showLabel?: boolean;
    spacing?: number;
    type?: HandleType;
  };

export type HandleOptions = ComponentOptions<HandleStyleProps>;

const CLASS_NAMES = classNames(
  {
    labelGroup: 'label-group',
    label: 'label',
    iconGroup: 'icon-group',
    icon: 'icon',
    iconRect: 'icon-rect',
    iconLine: 'icon-line',
  },
  'handle'
);

class HandleIcon extends Component<IconStyleProps> {
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

export class Handle extends Component<HandleStyleProps> {
  private label!: Selection;

  private icon!: Selection;

  constructor(options: HandleOptions) {
    super(options, HANDLE_DEFAULT_CFG);
  }

  private renderLabel(container: Group) {
    const { showLabel } = this.attributes;
    const { transform, ...style } = subStyleProps(this.attributes, 'label');
    const [labelStyle, groupStyle] = splitStyle(style, []);

    const labelGroup = select(container).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g').styles(groupStyle);

    // @ts-ignore
    const { text, ...rest } = { ...HANDLE_LABEL_DEFAULT_CFG, ...labelStyle };
    ifShow(!!showLabel, labelGroup, (group) => {
      this.label = group.maybeAppendByClassName(CLASS_NAMES.label, 'text').styles({
        ...rest,
        transform,
        text: `${text}`,
      });

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
    const { orientation, type } = this.attributes;
    const iconStyle = { orientation, ...HANDLE_ICON_DEFAULT_CFG, ...subStyleProps(this.attributes, 'icon') };
    const { iconShape = () => new HandleIcon({ style: iconStyle }) } = this.attributes;
    const iconGroup = select(container).maybeAppendByClassName(CLASS_NAMES.iconGroup, 'g');
    iconGroup
      .selectAll(CLASS_NAMES.icon.class)
      .data([iconShape])
      .join(
        (enter) =>
          enter
            .append(typeof iconShape === 'string' ? iconShape : () => iconShape(type))
            .attr('className', CLASS_NAMES.icon.name),
        (update) => update.update(iconStyle),
        (exit) => exit.remove()
      );
  }

  public render(attributes: HandleStyleProps, container: Group) {
    this.renderIcon(container);
    this.renderLabel(container);
  }
}
