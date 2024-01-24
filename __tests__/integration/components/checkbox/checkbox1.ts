import { Group } from '@antv/g';
import { Checkbox } from '../../../../src';

export function Checkbox1() {
  const group = new Group();

  group.appendChild(
    new Checkbox({
      style: {
        transform: 'translate(10, 10)',
        labelText: 'Checkbox',
      },
    })
  );

  const ck = group.appendChild(
    new Checkbox({
      style: {
        transform: 'translate(10, 30)',
        labelText: 'Checkbox',
        checked: true,
      },
    })
  );

  ck.addEventListener('click', () => {
    ck.update({
      checked: !ck.attr('checked'),
    });
  });

  return group;
}
