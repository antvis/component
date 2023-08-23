import { Group, Rect } from '@antv/g';
import { Select } from '../../../../src/ui/select';

export const SelectDefaultValue = () => {
  const group = new Group({});

  group.appendChild(
    new Select({
      style: {
        x: 10,
        y: 10,
        defaultValue: '2',
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
  return group;
};
