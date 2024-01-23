import { Group } from '@antv/g';
import { Switch } from '../../../../src';

export const Switch1 = () => {
  const group = new Group();

  group.appendChild(
    new Switch({
      style: {
        checked: false,
      },
    })
  );

  group.appendChild(
    new Switch({
      style: {
        transform: 'translateY(40)',
        checked: true,
      },
    })
  );

  const sw = group.appendChild(
    new Switch({
      style: {
        transform: 'translateY(80)',
        checked: false,
      },
    })
  );

  sw.addEventListener('click', () => {
    sw.update({
      checked: !sw.attributes.checked,
    });
  });

  return group;
};
