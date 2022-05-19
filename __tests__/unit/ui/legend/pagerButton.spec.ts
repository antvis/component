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
        backgroundStyle: { default: { fill: 'pink' } },
      },
    });

    canvas.appendChild(button);

    button.style.padding = [4, 2];
    expect(button.getBBox().x).toBe(0);
    expect(button.getBBox().y).toBe(0);
    const [a, b] = button.childNodes as any[];
    expect(a.style.fill).toBe('pink');
    expect(b.style.size).toBe(10);
    expect(a!.getLocalBounds().halfExtents[0]).toBe(b!.getLocalBounds().halfExtents[0] + 2);
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
        markerStyle: { disabled: { fill: 'red' } },
      },
    });

    canvas.appendChild(button);
    expect((button.childNodes[1] as any)!.style.fill).toBe('red');
    button.destroy();
  });
});
