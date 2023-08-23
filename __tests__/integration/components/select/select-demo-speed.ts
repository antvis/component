import { Group } from '@antv/g';
import { Select } from '../../../../src/ui/select';

export const SelectDemoSpeed = () => {
  const group = new Group({
    style: {
      width: 50,
      height: 100,
    },
  });

  group.appendChild(
    new Select({
      style: {
        x: 10,
        y: 10,
        width: 30,
        height: 20,
        open: true,
        defaultValue: 1,
        bordered: false,
        showDropdownIcon: false,
        selectRadius: 2,
        dropdownPadding: 2,
        dropdownRadius: 2,
        optionPadding: 0,
        optionBackgroundRadius: 1,
        options: [
          { label: '1x', value: 1 },
          { label: '1.5x', value: 1.5 },
          { label: '2x', value: 2 },
        ],
      },
    })
  );
  return group;
};
