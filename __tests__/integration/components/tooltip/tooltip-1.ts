import { Group, Rect } from '@antv/g';
import { Tooltip } from '../../../../src/ui/tooltip';

export const Tooltip1 = () => {
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

  const tooltip = group.appendChild(
    new Tooltip({
      style: {
        data: [],
        title: '标题',
        x: 100,
        y: 100,
        offset: [20, 20],
        position: 'bottom-right',
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
        content: '<span id="pos">Tooltip内容</span>',
      },
    })
  );

  document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
  group.addEventListener('mousemove', (e: any) => {
    tooltip.position = [e.offsetX, e.offsetY];
  });
  group.addEventListener('mouseenter', (e: any) => {
    tooltip.show(e.offsetX, e.offsetY);
  });
  group.addEventListener('mouseleave', () => {
    tooltip.hide();
  });

  return group;
};

Tooltip1.tags = ['提示窗口', '自动位置'];
