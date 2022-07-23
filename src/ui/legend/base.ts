import { Group, DisplayObject, HTML, Text } from '@antv/g';
import { applyStyle, maybeAppend } from '../../util';

export function getTitleShapeBBox(titleShape?: DisplayObject): {
  top: number;
  left: number;
  right: number;
  bottom: number;
} {
  let box = { left: 0, top: 0, width: 0, height: 0 };
  if (titleShape?.tagName === 'html') {
    const { width, height } = titleShape.style;
    box = { left: 0, top: 0, width: width as number, height: height as number };
  } else if (titleShape) {
    const { min, halfExtents } = titleShape.getLocalBounds();
    box = {
      left: min[0],
      top: min[1],
      width: halfExtents[0] * 2,
      height: halfExtents[1] * 2,
    };
  }
  return { left: 0, top: 0, right: box.width, bottom: box.height };
}

export function renderTitle(container: Group, cfg?: any): any | null {
  if (!cfg) {
    const shape = container.querySelector('.legend-title');
    if (shape) shape.remove();
    return null;
  }
  const { useHTML, style } = cfg;
  const type = useHTML ? 'html' : 'text';
  const className = `legend-title ${type}-title`;
  const innerHTML = `<span>${cfg?.content || ''}</span>`;
  return maybeAppend(container, `.${className}`, () => {
    if (useHTML) return new HTML({ className, style: { innerHTML } });
    return new Text({ className, style });
  })
    .call((selection) => {
      if (useHTML) {
        selection
          .style('width', cfg.width ?? 80)
          .style('height', cfg.height ?? 20)
          .style('innerHTML', innerHTML);
      } else {
        selection
          .style('fontSize', 12)
          .style('textBaseline', 'top')
          .style('text', cfg.content || '');
      }
    })
    .call(applyStyle, style)
    .node();
}

export function renderGroup(container: Group, className: string, x: number, y: number): Group {
  return maybeAppend(container, `.${className}`, 'g').attr('className', className).style('x', x).style('y', y).node();
}

export function renderRect(container: Group, className: string, width: number, height: number, style?: any) {
  return maybeAppend(container, `.${className}`, 'rect')
    .attr('className', className)
    .style('zIndex', -1)
    .style('width', width)
    .style('height', height)
    .call(applyStyle, style || {})
    .node();
}
