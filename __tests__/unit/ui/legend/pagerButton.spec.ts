import { PageButton } from '../../../../src/ui/legend/pageButton';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(800);

describe('PageButton', () => {
  it('new PageButton({..}) should draw a button with background.', () => {
    const button = new PageButton({
      style: {
        x: 0,
        y: 0,
        size: 10,
        symbol: 'left',
        padding: [2, 4],
        backgroundStyle: { fill: 'pink' },
      },
    });

    canvas.appendChild(button);

    button.update({ padding: [4, 2] });
    expect(button.getBBox().x).toBe(-5);
    expect(button.getBBox().y).toBe(-5);
    const [container, a, b] = button.childNodes as any[];
    expect(a.style.fill).toBe('pink');

    button.update({ padding: 0 });
    expect(b.getLocalBounds().halfExtents[1] * 2).toBe(10);
    button.update({ padding: [4, 2] });
    expect(a!.getLocalBounds().halfExtents[1]).toBe(b!.getLocalBounds().halfExtents[1] + 4);
    button.destroy();
  });

  it('new PageButton({..}) should draw a button with disable state.', () => {
    const button = new PageButton({
      style: {
        x: 0,
        y: 0,
        size: 10,
        symbol: 'left',
        disabled: true,
        markerStyle: { fill: 'green', disabled: { fill: 'red' } },
      },
    });

    canvas.appendChild(button);
    expect((button.childNodes[2] as any)!.style.fill).toBe('red');
    button.setState('default');
    expect((button.childNodes[2] as any)!.style.fill).toBe('green');
    button.setState('disabled');
    expect((button.childNodes[2] as any)!.style.fill).toBe('red');
    button.destroy();
  });
});
