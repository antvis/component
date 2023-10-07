import { Group, Rect } from '@antv/g';
import { Tooltip } from '../../../../src/ui/tooltip';

export const Tooltip10 = () => {
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
        data: [
          { value: 1231230, name: '第三项', index: 0, color: 'red' },
          { value: 1.2312323, name: '第四项', index: 1, color: 'green' },
          { value: 1.2312323, name: '第五项', index: 1, color: 'blue' },
        ],
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

Tooltip10.tags = ['提示窗口', '无标题'];
