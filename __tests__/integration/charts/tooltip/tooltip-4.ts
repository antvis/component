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

  const customContent = document.createElement('iframe');
  customContent.src = 'https://www.w3.org/';
  customContent.style.width = '300px';
  customContent.style.height = '200px';
  customContent.style.margin = '-12px';

  const tooltip = group.appendChild(
    new Tooltip({
      style: {
        title: 'Tooltip',
        x: 100,
        y: 100,
        offset: [20, 20],
        enterable: true,
        autoPosition: false,
        container: {
          x: 28,
          y: 80,
        },
        items: [],
        bounding: {
          x: 0,
          y: 0,
          width: len,
          height: len,
        },
        customContent,
      },
    })
  );

  document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
  group.addEventListener('mousemove', (e: any) => {
    tooltip.position = [e.offsetX, e.offsetY];
  });
  group.addEventListener('mouseenter', () => {
    tooltip.show();
  });
  group.addEventListener('mouseleave', () => {
    tooltip.hide();
  });
  return group;
};

Tooltip4.tags = ['提示窗口', '自定义内容', 'iframe'];
