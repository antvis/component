import { Group, Rect } from '@antv/g';
import { Tooltip } from '../../../../src/ui/tooltip';

export const Tooltip4 = () => {
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

  const content = document.createElement('iframe');
  content.src = 'https://www.w3.org/';
  content.style.width = '300px';
  content.style.height = '200px';
  content.style.margin = '-12px';

  const tooltip = group.appendChild(
    new Tooltip({
      style: {
        title: 'Tooltip',
        x: 100,
        y: 100,
        offset: [20, 20],
        enterable: true,
        container: {
          x: 28,
          y: 80,
        },
        bounding: {
          x: 0,
          y: 0,
          width: len,
          height: len,
        },
        content,
      },
    })
  );

  document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
  group.addEventListener('mousemove', (e: any) => {
    tooltip.show(e.offsetX, e.offsetY);
  });
  group.addEventListener('mouseenter', () => {
    tooltip.show();
  });
  group.addEventListener('mouseleave', (e: any) => {
    tooltip.hide(e.offsetX, e.offsetY);
  });
  return group;
};

Tooltip4.tags = ['提示窗口', '自定义内容', 'iframe'];
