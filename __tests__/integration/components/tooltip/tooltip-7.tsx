import { Group, Rect } from '@antv/g';
import { Tooltip } from '../../../../src/ui/tooltip';

export const Tooltip7 = () => {
  const group = new Group();
  const len = 400;
  group.appendChild(
    new Rect({
      style: {
        width: len,
        height: len,
        fill: '#ddd',
      },
    })
  );

  let tooltip: Tooltip;

  group.addEventListener('mousemove', (e: any) => {
    if (!tooltip) {
      tooltip = group.appendChild(
        new Tooltip({
          style: {
            title: 'Tooltip',
            x: e.offsetX,
            y: e.offsetY,
            offset: [20, 20],
            container: { x: 28, y: 80 },
            content: 'Custom Content',
            bounding: {
              x: 0,
              y: 0,
              width: len,
              height: len,
            },
          },
        })
      );
      document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
    }

    tooltip.position = [e.offsetX, e.offsetY];
  });
  group.addEventListener('mouseenter', (e: any) => {
    tooltip?.show(e.offsetX, e.offsetY);
  });
  group.addEventListener('mouseleave', () => {
    tooltip?.hide();
  });
  return group;
};

Tooltip7.tags = ['提示窗口', '位置更新'];
