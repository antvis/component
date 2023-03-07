import { Group, Rect } from '@antv/g';
import { Tooltip } from '../../../../src/ui/tooltip';
import { timeout } from '../../utils';

export const Tooltip2 = () => {
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
        data: [
          {
            value: 1231230,
            name: '第三项',
            index: 0,
            color: 'red',
          },
          {
            value: 1.2312323,
            name: '第四项',
            index: 1,
            color: 'green',
          },
          {
            value: 1.2312323,
            name: '第五项',
            index: 1,
            color: 'blue',
          },
        ],
        title: '标题',
        x: 100,
        y: 100,
        offset: [20, 20],
        enterable: true,
        autoPosition: false,
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
      },
    })
  );

  document.getElementsByTagName('body')[0].appendChild(tooltip.HTMLTooltipElement);
  let isPointerInTooltip = false;
  group.addEventListener('mousemove', (e: any) => {
    tooltip.position = [e.offsetX, e.offsetY];
  });
  tooltip.getContainer().addEventListener('mouseenter', () => {
    isPointerInTooltip = true;
  });
  tooltip.getContainer().addEventListener('mouseleave', () => {
    isPointerInTooltip = false;
  });

  group.addEventListener('mouseenter', () => {
    tooltip.show();
  });
  group.addEventListener('mouseleave', () => {
    timeout(() => {
      if (!isPointerInTooltip) {
        tooltip.hide();
      }
    });
  });
  return group;
};

Tooltip2.tags = ['提示窗口', '可进入'];
