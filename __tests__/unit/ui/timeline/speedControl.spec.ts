import { SpeedControl } from '../../../../src/ui/timeline/speedControl';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(750, undefined, true);

describe('Timeline button', () => {
  it('new SpeedControl({...} returns play button', () => {
    const markerSize = 4;
    const speedControl = new SpeedControl({
      style: {
        x: 5,
        y: 10,
        markerSize,
      },
    });
    canvas.appendChild(speedControl);

    expect(speedControl.childNodes.length).toBe(3);
    const lineGroup = speedControl.querySelector('.line-group')! as any;
    const speedPath = speedControl.querySelector('.speed-path')! as any;
    const speedMarker = speedControl.querySelector('.speed-marker')!;
    const speedLabel = speedControl.querySelector('.speed-label')! as any;
    expect(speedPath.style.path.map((d: any) => d[0]).filter((d: any) => d === 'M').length).toBe(5);
    expect(lineGroup.style.x).toBe(markerSize - 0.5);

    expect(speedLabel.style.text).toBe('1.0x');
    speedControl.update({ initialSpeed: 3, formatter: (v) => `${v.toFixed(2)}` });
    expect(speedLabel.style.text).toBe('3.00');

    speedControl.update({ labelStyle: { fill: 'red' }, lineStyle: { stroke: 'red' }, markerFill: 'red' });
    expect(speedLabel.style.fill).toBe('red');
    expect(speedPath.style.stroke).toBe('red');
    expect(speedMarker.style.fill).toBe('red');
    expect(speedPath.getBBox().width).toBe(markerSize * 2);

    speedControl.update({ markerSize: 8, spacing: 4, labelStyle: { fontSize: 16 } });
    expect(speedLabel.getBBox().left).toBe(lineGroup.getBBox().right + 4);

    speedControl.destroy();
  });
});
