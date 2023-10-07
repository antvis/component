import { Group, Rect } from '@antv/g';
import { Layout } from '../../../../src/ui/layout';
import { createGrid, timeout } from '../../utils';
import { Category } from '../../../../src/ui/legend';
import { ageData } from '../legend/data';

export const LayoutUpdateAttr2 = () => {
  const group = new Group();
  createGrid(group, 500);
  const box = group.appendChild(
    new Layout({
      style: {
        width: 300,
        height: 300,
        display: 'flex',
        justifyContent: 'center',
      },
    })
  );

  const a = box.appendChild(
    new Category({
      style: {
        data: ageData,
        layout: 'flex',
        gridCol: 2,
        colPadding: 5,
        width: 400,
        height: 300,
        itemMarkerFill: (d: any, i: number) => ageData[i].color,
      },
    })
  );

  timeout(() => {
    box.attr('width', 500);
  }, 1000);

  timeout(() => {
    box.attr('width', 300);
  }, 2000);

  return group;
};

LayoutUpdateAttr2.tags = ['布局', 'flex-direction', 'row'];
