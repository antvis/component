import { Group, Rect } from '@antv/g';
// import React from 'react';
// import ReactDOM from 'react-dom';
import { Tooltip } from '../../../../src/ui/tooltip';

export const Tooltip6 = () => {
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
        title: 'Tooltip',
        x: 100,
        y: 100,
        offset: [20, 20],
        enterable: true,
        autoPosition: false,
        container: { x: 28, y: 80 },
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
  group.addEventListener('mousemove', (e: any) => {
    tooltip.position = [e.offsetX, e.offsetY];
    /** 1: 通过 React 渲染Tooltip节点 */
    // ReactDOM.render(
    //   <div>
    //     <span>x: {e.offsetX.toFixed(0)}</span>
    //     <span>y: {e.offsetY.toFixed(0)}</span>
    //   </div>,
    //   tooltip.getContainer()
    // );
    /** 2: 通过原生DOM渲染Tooltip节点 */
    // tooltip.getContainer().innerText = `x: ${e.offsetX.toFixed(0)} y: ${e.offsetY.toFixed(0)}`;
    /** 3. 通过创建新的 customContent 来更新节点 */
    // tooltip.update({ customContent: `x: ${e.offsetX.toFixed(0)} y: ${e.offsetY.toFixed(0)}` });
  });
  group.addEventListener('mouseenter', () => {
    tooltip.show();
  });
  group.addEventListener('mouseleave', () => {
    tooltip.hide();
  });
  return group;
};

Tooltip6.tags = ['提示窗口', '自定义内容', 'React'];
