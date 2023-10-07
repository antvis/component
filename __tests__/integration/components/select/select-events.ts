import { Group, Rect } from '@antv/g';
import { Select } from '../../../../src/ui/select';

export const SelectEvents = () => {
  const group = new Group({});

  const select = group.appendChild(
    new Select({
      style: {
        x: 10,
        y: 10,
        options: [
          {
            label: '选项1',
            value: '1',
          },
          {
            label: '选项2',
            value: '2',
          },
          {
            label: () =>
              new Rect({
                style: {
                  width: 100,
                  height: 40,
                  fill: '#f75461',
                },
              }),
            value: '3',
          },
          {
            label: () =>
              new Rect({
                style: {
                  width: 100,
                  height: 20,
                  fill: '#0f58da',
                },
              }),
            value: '4',
          },
        ],
      },
    })
  );

  select.addEventListener('change', console.log);

  return group;
};
