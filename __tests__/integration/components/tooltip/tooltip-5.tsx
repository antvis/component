import { Group, Rect } from '@antv/g';
// import React from 'react';
// import ReactDOM from 'react-dom';
import { Tooltip } from '../../../../src/ui/tooltip';

export const Tooltip5 = () => {
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

  const customContent = document.createElement('div');
  // ReactDOM.render(<div>自定义内容</div>, customContent);

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

Tooltip5.tags = ['提示窗口', '自定义内容', 'React'];
