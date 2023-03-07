import { Group, Rect, Circle } from '@antv/g';
import { Text } from '../../../src/shapes';
import { transitionShape } from '../../../src/animation';

export function Transition2() {
  const group = new Group();

  const rect1 = group.appendChild(
    new Rect({
      style: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fill: 'red',
      },
    })
  );

  const circle = group.appendChild(
    new Circle({
      style: {
        cx: 200,
        cy: 50,
        r: 50,
        fill: 'green',
      },
    })
  );

  setTimeout(async () => {
    const animations1 = transitionShape(rect1, circle, { duration: 1000 });
    await animations1.slice(-1)[0]!.finished;
    const rect2 = group.appendChild(
      new Rect({
        style: {
          x: 150,
          y: 150,
          width: 100,
          height: 100,
          fill: 'blue',
        },
      })
    );
    const animations2 = transitionShape(circle, rect2, { duration: 1000 });

    await animations2.slice(-1)[0]!.finished;

    const text = group.appendChild(
      new Text({
        style: {
          x: 0,
          y: 150,
          text: 'Animation',
          fontSize: 20,
        },
      })
    );

    transitionShape(rect2, text, { duration: 1000 });
  });

  return group;
}
