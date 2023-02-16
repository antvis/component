import type { DisplayObject, GroupStyleProps, PathStyleProps, TextStyleProps } from '@antv/g';
import { Group } from '@antv/g';
import { GUI, PrefixStyleProps, type ComponentOptions, type RequiredStyleProps } from '../../core';
import type { MergeMultiple } from '../../types';
import { classNames, ifShow, select, styleSeparator, subStyleProps, type Selection } from '../../util';
import { createComponent } from '../../util/create';
import { HANDLE_DEFAULT_CFG, HANDLE_ICON_DEFAULT_CFG, HANDLE_LABEL_DEFAULT_CFG } from './constant';

export type IconStyleProps = {
  style: PathStyleProps & {
    size?: number;
    radius?: number;
    shape?: string | (() => DisplayObject);
    orientation?: 'horizontal' | 'vertical';
  };
};

export type LabelStyleProps = {
  style: TextStyleProps;
};

export type HandleStyleProps = MergeMultiple<
  [
    PrefixStyleProps<LabelStyleProps, 'label'>,
    PrefixStyleProps<IconStyleProps, 'icon'>,
    {
      showLabel?: boolean;
      style: GroupStyleProps & {
        type?: 'start' | 'end';
        spacing?: number;
        orientation?: IconStyleProps['style']['orientation'];
      };
    }
  ]
>;

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

const HandleIcon = createComponent<RequiredStyleProps<IconStyleProps>>({
  render(attributes, container) {
    const {
      style: { size = 10, radius = size / 4, orientation, ...iconStyle },
    } = attributes;
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
  },
});

export class Handle extends GUI<RequiredStyleProps<HandleStyleProps>> {
  private label!: Selection;

  private icon!: Selection;

  constructor(options: ComponentOptions<HandleStyleProps>) {
    super(options, HANDLE_DEFAULT_CFG);
  }

  private renderLabel(container: Group) {
    const { showLabel } = this.attributes;
    const { style } = subStyleProps(this.attributes, 'label');
    const [labelStyle, groupStyle] = styleSeparator(style, []);

    const labelGroup = select(container).maybeAppendByClassName(CLASS_NAMES.labelGroup, 'g').styles(groupStyle);
    ifShow(!!showLabel, labelGroup, (group) => {
      this.label = group
        .maybeAppendByClassName(CLASS_NAMES.label, 'text')
        .styles({ ...HANDLE_LABEL_DEFAULT_CFG.style, ...labelStyle });

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
      style: {
        iconShape = () => {
          return new HandleIcon({ style: { style: iconStyle } });
        },
        orientation,
      },
    } = this.attributes;
    const iconStyle = { orientation, ...HANDLE_ICON_DEFAULT_CFG, ...subStyleProps(this.attributes, 'icon').style };

    this.icon = select(container).maybeAppendByClassName(CLASS_NAMES.icon, iconShape).update(iconStyle);
  }

  public render(attributes: HandleStyleProps, container: Group) {
    this.renderIcon(container);
    this.renderLabel(container);
  }
}
