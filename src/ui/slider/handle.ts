import { Group, TextStyleProps } from '@antv/g';
import { Marker, MarkerStyleProps } from '../marker';
import type { ShapeAttrs } from '../../types';
import { applyStyle, maybeAppend, select } from '../../util';
import { createComponent } from '../../util/create';

export interface HandleStyleProps {
  x: number;
  y: number;
  zIndex: number;
  handleType: 'start' | 'end';
  visibility: 'visible' | 'hidden';
  iconCfg: (ShapeAttrs | MarkerStyleProps) & {
    type: 'symbol' | 'default';
    size?: number;
    radius?: number | string;
    orient?: 'horizontal' | 'vertical';
  };
  textCfg: TextStyleProps;
}

const HandleIcon = createComponent<any>({
  render(attributes, container) {
    const { size = 10, radius = 2, stroke, fill, lineWidth, orient } = attributes;
    // 默认手柄
    const width = size!;
    const height = width * 2.4;
    const rect = maybeAppend(container, '.rect', 'rect')
      .attr('className', 'rect')
      .style('x', -width / 2)
      .style('y', -height / 2)
      .style('width', width)
      .style('height', height)
      .style('stroke', stroke || '#bfbfbf')
      .style('lineWidth', typeof lineWidth !== 'number' ? 1 : lineWidth)
      .style('fill', fill || '#fff')
      .style('radius', typeof radius !== 'number' ? width / 4 : radius)
      .node();

    const appendLine = (idx: number, x1: number, y1: number, x2: number, y2: number) => {
      maybeAppend(rect, `line-${idx}`, 'line')
        .attr('className', `line-${idx}`)
        .style('x1', x1)
        .style('y1', y1)
        .style('x2', x2)
        .style('y2', y2)
        .style('stroke', rect.style.stroke)
        .style('lineWidth', rect.style.lineWidth);
    };
    const X1 = (1 / 3) * width;
    const X2 = (2 / 3) * width;
    const Y1 = (1 / 4) * height;
    const Y2 = (3 / 4) * height;
    appendLine(0, X1, Y1, X1, Y2);
    appendLine(0, X2, Y1, X2, Y2);

    rect.setOrigin(width / 2, height / 2);
    if (orient === 'vertical') container.setLocalEulerAngles(90);
    else container.setLocalEulerAngles(0);
  },
});

function renderHandleIcon(container: Group, iconCfg: HandleStyleProps['iconCfg']) {
  const { type } = iconCfg;
  const className = `handle-icon ${type}-handle`;
  select(container)
    .selectAll('.handle-icon')
    .data([type], (d) => d)
    .join(
      (enter) =>
        enter.append((type) => {
          if (type === 'symbol') return new Marker({ className, name: 'icon', style: iconCfg as any });
          return new HandleIcon({ name: 'icon', className, style: iconCfg as any });
        }),
      (update) =>
        update.each(function () {
          this.update(iconCfg);
        }),
      (exit) => exit.remove()
    );
}

function renderHandleText(container: Group, cfg: any = {}) {
  const className = `handle-text`;
  maybeAppend(container, `.${className}`, 'text')
    .attr('className', className)
    .style('fontSize', 12)
    .style('fill', '#000')
    .style('fillOpacity', 0.45)
    .style('textAlign', 'center')
    .style('textBaseline', 'middle')
    .call(applyStyle, cfg);
}

export const Handle = createComponent<HandleStyleProps>({
  render(attributes, container) {
    const { iconCfg, textCfg } = attributes;

    renderHandleIcon(container, iconCfg);
    renderHandleText(container, textCfg);
  },
});
