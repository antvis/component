import { Group } from '@antv/g';
import { Switch } from '../../../../src';

export const Switch1 = () => {
  const group = new Group();

  group.appendChild(
    new Switch({
      style: {
        style: {
          checked: false,
        },
      },
    })
  );

  group.appendChild(
    new Switch({
      style: {
        style: {
          y: 40,
          checked: true,
        },
      },
    })
  );

  const sw = group.appendChild(
    new Switch({
      style: {
        style: {
          y: 80,
          checked: false,
        },
      },
    })
  );

  sw.addEventListener('click', () => {
    sw.update({
      style: {
        checked: !sw.attributes.style?.checked,
      },
    });
  });

  return group;
};
