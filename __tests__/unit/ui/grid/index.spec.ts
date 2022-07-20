import { Grid } from '../../../../src/ui/grid';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(800);

describe('Grid', () => {
  it('renders line grid in y-position', () => {
    const items = new Array(5).fill(null).map((_, idx) => ({
      id: `line-${idx}`,
      points: [
        [30 * (idx + 1), 150],
        [30 * (idx + 1), 20],
      ],
    })) as Array<{ id: string; points: any[] }>;
    const grid = new Grid({ style: { items, lineStyle: { stroke: 'red' } } });
    canvas.appendChild(grid);
  });

  it('renders line grid in x-position', () => {
    const items = new Array(5).fill(null).map((_, idx) => ({
      id: `line-${idx}`,
      points: [
        [30, 180 + 20 * idx],
        [150, 180 + 20 * idx],
      ],
    })) as Array<{ id: string; points: any[] }>;
    const grid = new Grid({ style: { items: items.slice().reverse(), alternateColor: 'rgba(68, 170, 213, 0.1)' } });
    canvas.appendChild(grid);

    const regions = grid.querySelectorAll('.grid-region');
    expect(regions.length).toBe(4);
    expect(regions[0].style.fill).toBe('rgba(68, 170, 213, 0.1)');
    expect(regions[1].style.fill).toBe('transparent');
  });

  const points = [
    [325.88190451025207, 323.4074173710932],
    [370.71067811865476, 349.28932188134524],
    [396.5925826289068, 394.11809548974793],
    [396.5925826289068, 445.88190451025207],
    [370.71067811865476, 490.71067811865476],
    [325.88190451025207, 516.5925826289068],
    [274.11809548974793, 516.5925826289068],
    [229.2893218813453, 490.71067811865476],
    [203.40741737109317, 445.8819045102521],
    [203.40741737109317, 394.11809548974793],
    [229.2893218813452, 349.2893218813453],
    [274.11809548974793, 323.4074173710932],
  ] as any[];
  const points2 = [
    [320.70552360820164, 342.72593389687455],
    [356.5685424949238, 363.4314575050762],
    [377.27406610312545, 399.29447639179836],
    [377.27406610312545, 440.70552360820164],
    [356.5685424949238, 476.5685424949238],
    [320.70552360820164, 497.27406610312545],
    [279.29447639179836, 497.27406610312545],
    [243.43145750507622, 476.5685424949238],
    [222.72593389687455, 440.7055236082017],
    [222.72593389687455, 399.29447639179836],
    [243.43145750507614, 363.43145750507625],
    [279.29447639179836, 342.72593389687455],
  ] as any[];
  const points3 = [
    [315.5291427061512, 362.0444504226559],
    [342.42640687119285, 377.57359312880715],
    [357.9555495773441, 404.4708572938488],
    [357.9555495773441, 435.5291427061512],
    [342.42640687119285, 462.42640687119285],
    [315.5291427061512, 477.9555495773441],
    [284.4708572938487, 477.9555495773441],
    [257.57359312880715, 462.42640687119285],
    [242.04445042265593, 435.5291427061513],
    [242.0444504226559, 404.4708572938488],
    [257.5735931288071, 377.5735931288072],
    [284.4708572938488, 362.0444504226559],
  ] as any[];
  const points4 = [
    [307.7645713530756, 391.02222521132796],
    [321.2132034355964, 398.7867965644036],
    [328.97777478867204, 412.2354286469244],
    [328.97777478867204, 427.7645713530756],
    [321.2132034355964, 441.2132034355964],
    [307.7645713530756, 448.97777478867204],
    [292.2354286469244, 448.97777478867204],
    [278.7867965644036, 441.2132034355964],
    [271.02222521132796, 427.76457135307567],
    [271.02222521132796, 412.2354286469244],
    [278.7867965644036, 398.7867965644036],
    [292.2354286469244, 391.02222521132796],
  ] as any[];

  it('renders line grid in circular', () => {
    const grid = new Grid({
      style: {
        items: [
          { id: 'line3', points: points4 },
          { id: 'line2', points: points3 },
          { id: 'line1', points: points2 },
          { id: 'line0', points },
        ],
        type: 'circle',
        center: [300, 420],
        closed: true,
      },
    });
    canvas.appendChild(grid);

    grid.update({ lineStyle: { lineWidth: 0.5 } });
  });

  it('renders circle grid in circular', () => {
    const grid = new Grid({
      style: {
        items: [
          { id: 'line3', points: points4 },
          { id: 'line2', points: points3 },
          { id: 'line1', points: points2 },
          { id: 'line0', points },
        ],
        closed: true,
        lineStyle: { stroke: 'pink', lineWidth: 0.5, lineDash: [0, 0] },
        alternateColor: ['rgba(68, 170, 213, 0.1)', '#efefef'],
      },
    });
    canvas.appendChild(grid);

    const regions = grid.querySelectorAll('.grid-region');
    expect(regions.length).toBe(4);
    expect(regions[0].style.fill).toBe('rgba(68, 170, 213, 0.1)');
    expect(regions[1].style.fill).toBe('#efefef');
    expect(regions[2].style.fill).toBe('rgba(68, 170, 213, 0.1)');
    expect(regions[3].style.fill).toBe('#efefef');

    grid.update({ alternateColor: null });
    expect(grid.querySelectorAll('.grid-region').length).toBe(0);
  });
});
