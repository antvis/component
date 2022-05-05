import { Group } from '@antv/g';
import EllipsisUtil from '../../../../../src/ui/axis/overlap/autoEllipsis';
import { select } from '../../../../../src/util';
import { createCanvas } from '../../../../utils/render';

describe('Overlap autoEllipsis', () => {
  const group = createCanvas(600, 'svg').appendChild(new Group());

  it('EllipsisUtil.getDefault', () => {
    expect(typeof EllipsisUtil.getDefault() === 'function').toBeTruthy();
  });

  const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const horizontalTexts = data.map((text, idx) => ({ text, x: 30 + 20 * idx, y: 50, fontSize: 14, fill: 'red' }));
  const verticalTexts = data.map((text, idx) => ({ text, x: 40, y: 100 + 20 * idx, fontSize: 16, fill: 'red' }));
  const updateLabels = (data: any[], className: string) =>
    select(group)
      .selectAll(`.${className}`)
      .data(data)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('className', className)
            .each((shape, datum) => shape.attr(datum)),
        (update) => update.each((shape, datum) => shape.attr(datum)),
        (exit) => exit.remove()
      )
      .nodes() as any[];
  let horizontalLabels = updateLabels(horizontalTexts, 'h-text');
  let verticalLabels = updateLabels(verticalTexts, 'v-text');

  it('Ellipsis in horizontal, without rotation', () => {
    EllipsisUtil.ellipsis('bottom', horizontalLabels, { minLength: 14 });
    expect(horizontalLabels.some((d) => d.style.text.endsWith('...'))).toBeTruthy();

    horizontalLabels = updateLabels(horizontalTexts, 'h-text');
    EllipsisUtil.ellipsis('bottom', horizontalLabels, { minLength: 60 });
    expect(horizontalLabels.some((d) => d.style.text.endsWith('...'))).not.toBeTruthy();
  });

  it('Ellipsis in horizontal, with rotation', () => {
    horizontalLabels = updateLabels(
      horizontalTexts.map((d) => ({ ...d, transform: 'rotate(45deg)', textBaseline: 'bottom' })),
      'h-text'
    );
    // 文本计算 bbox 有些误差，可以通过调节 margin-top 来调整
    EllipsisUtil.ellipsis('bottom', horizontalLabels, { minLength: 14, margin: [-2, 0, 0, 0] });
    expect(horizontalLabels.some((d) => d.style.text.endsWith('...'))).not.toBeTruthy();
  });

  it('Ellipsis in vertical, without rotation', () => {
    EllipsisUtil.ellipsis('left', verticalLabels, { minLength: 14 });
    expect(verticalLabels.some((d) => d.style.text.endsWith('...'))).not.toBeTruthy();

    verticalLabels = updateLabels(
      horizontalTexts.map((d) => ({ ...d, fontSize: 18 })),
      'v-text'
    );
    EllipsisUtil.ellipsis('left', verticalLabels, { minLength: 60 });
    expect(verticalLabels.some((d) => d.style.text.endsWith('...'))).not.toBeTruthy();
  });
});
