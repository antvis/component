import { Button, SymbolPool } from '../../../../src/ui/timeline/button';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(750, undefined, true);

describe('Timeline button', () => {
  it('new Button({...} returns play button', () => {
    const playButton = new Button({
      style: {
        x: 50,
        y: 50,
        symbol: 'timeline-play-button',
        size: 30,
        margin: 0,
        padding: 0,
        backgroundStyle: { fill: 'pink', active: { fill: 'orange' } },
        markerStyle: { stroke: '#000', active: { stroke: 'red' } },
      },
    });
    canvas.appendChild(playButton);
    expect(playButton.getBBox().width).toBe(30);
    expect(playButton.getBBox().height).toBe(30);
    expect(playButton.querySelector('.background')!.style.fill).toBe('pink');
    expect(playButton.querySelector('.marker')!.style.stroke).toBe('#000');

    playButton.emit('pointerup', {});
    playButton.emit('pointermove', {});
    expect(playButton.querySelector('.background')!.style.fill).toBe('orange');
    expect(playButton.querySelector('.marker')!.style.stroke).toBe('red');

    playButton.update({ symbol: 'timeline-prev-button', size: 10, x: 0, y: 0 });
    let symbol = SymbolPool.get('timeline-prev-button');
    expect(playButton.querySelector('.marker')!.style.path).toEqual(symbol(0, 0, 5));

    playButton.update({ symbol: 'timeline-next-button', size: 10, x: 0, y: 0 });
    symbol = SymbolPool.get('timeline-next-button');
    expect(playButton.querySelector('.marker')!.style.path).toEqual(symbol(0, 0, 5));

    const container = playButton.querySelector('.container')!;
    const background = playButton.querySelector('.background')!;
    expect(container.style.x).toBe(background.style.x);
    expect(container.style.y).toBe(background.style.y);
    playButton.update({ margin: 4 });
    expect(container.style.x).toBe(background.style.x - 4);
    expect(container.style.y).toBe(background.style.y - 4);

    playButton.destroy();
  });
});
