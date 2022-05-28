// @ts-ignore no-implicit-this
import { Group } from '@antv/g';
import HideUtil from '../../../../../src/ui/axis/overlap/autoHide';
import { boundTest } from '../../../../../src/ui/axis/utils';
import { select } from '../../../../../src/util';
import { createCanvas } from '../../../../utils/render';

describe('Overlap autoHide', () => {
  const group = createCanvas(600).appendChild(new Group());

  it('HideUtil.getDefault', () => {
    expect(typeof HideUtil.getDefault() === 'function').toBeTruthy();
    expect(HideUtil.getDefault()).toEqual(HideUtil.equidistance);
  });

  const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const horizontalTexts = data.map((text, idx) => ({ text, x: 30 + 20 * idx, y: 50, fontSize: 10, fill: 'red' }));
  const verticalTexts = data.map((text, idx) => ({ text, x: 40, y: 100 + 20 * idx, fontSize: 16, fill: 'red' }));
  const updateLabels = (data: any, className: string) =>
    select(group)
      .selectAll(`.${className}`)
      .data(data)
      .join(
        (enter) =>
          enter
            .append('text')
            .attr('className', className)
            .each(function (datum) {
              this.attr(datum);
            }),
        (update) =>
          update.each(function (datum) {
            this.attr(datum);
          }),
        (exit) => exit.remove()
      )
      .nodes() as any[];
  let horizontalLabels = updateLabels(horizontalTexts, 'h-text');
  const verticalLabels = updateLabels(verticalTexts, 'v-text');

  it('Hide label in horizontal, without rotation', () => {
    HideUtil.equidistance('bottom', horizontalLabels);
    expect(horizontalLabels.some((d) => d.style.visibility === 'hidden')).not.toBeTruthy();

    HideUtil.equidistance('bottom', horizontalLabels, { margin: [0, 4] });
    expect(horizontalLabels.some((d) => d.style.visibility === 'hidden')).toBeTruthy();
  });

  it('Hide label in horizontal, cfg: { showLast, showFirst }', () => {
    horizontalLabels = updateLabels(
      horizontalTexts.map((d) => ({ ...d, visibility: 'visible' })),
      'h-text'
    );
    HideUtil.equidistance('bottom', horizontalLabels, { margin: [0, 4], showLast: true });
    expect(horizontalLabels[data.length - 1].style.visibility === 'hidden').not.toBeTruthy();
    expect(horizontalLabels[0].style.visibility === 'hidden').toBeTruthy();

    horizontalLabels = updateLabels(
      horizontalTexts.map((d) => ({ ...d, visibility: 'visible' })),
      'h-text'
    );
    HideUtil.equidistance('bottom', horizontalLabels, { margin: [0, 4], showFirst: true, showLast: true });
    expect(horizontalLabels[0].style.visibility === 'hidden').not.toBeTruthy();
  });

  it('Hide label in vertical, with rotation', () => {
    horizontalLabels = updateLabels(
      horizontalTexts.map((d) => ({ ...d, visibility: 'visible', transform: 'rotate(45deg)' })),
      'h-text'
    );
    expect(verticalLabels.some((d) => d.style.visibility === 'hidden')).not.toBeTruthy();
  });

  const filter = (labels: any[]) => labels.filter((d) => d.style.visibility !== 'hidden');
  it('HideUtil support equidistance and greedy', () => {
    // equidistance 存在 reverse, greedy 不存在 reverse, 因此 first one 一直展示
    horizontalLabels = updateLabels(
      horizontalTexts.map((d) => ({ ...d, visibility: 'visible' })),
      'h-text'
    );
    HideUtil.greedy('bottom', horizontalLabels, { margin: [0, 4], showLast: true });
    expect(horizontalLabels[data.length - 1].style.visibility === 'hidden').not.toBeTruthy();
    expect(horizontalLabels[0].style.visibility === 'hidden').not.toBeTruthy();
    const counts = filter(horizontalLabels).length;

    HideUtil.equidistance('bottom', horizontalLabels, { margin: [0, 4], showLast: true, showFirst: true });
    expect(filter(horizontalLabels).length).toBeLessThan(counts);
  });

  it('Hide labels in vertical', () => {
    HideUtil.equidistance('left', verticalLabels);
    expect(filter(verticalLabels).length).toBe(verticalLabels.length);

    verticalLabels.forEach((d) => (d.style.fontSize = 30));
    HideUtil.equidistance('left', verticalLabels);
    expect(filter(verticalLabels).length).toBe(verticalLabels.length / 2);

    verticalLabels.forEach((d) => (d.style.visibility = 'visible'));
    HideUtil.equidistance('left', verticalLabels, { showLast: true, showFirst: true });
    expect(filter(verticalLabels).length).toBe(verticalLabels.length / 2 - 1);

    verticalLabels.forEach((d) => (d.style.visibility = 'visible'));
    HideUtil.greedy('left', verticalLabels, { showLast: true, showFirst: true });
    expect(filter(verticalLabels).length).toBe(verticalLabels.length / 2);
  });

  it('large labels, exceed time not to processOverlap', () => {
    const attrs = Array(10000)
      .fill(null)
      .map((d: any, idx: number) => ({ text: `hello${idx}`, x: 10 + idx, y: 10, fontSize: 10, fill: 'orange' }));
    const labels: any[] = select(group)
      .selectAll('.text')
      .data(attrs)
      .join((enter) =>
        enter
          .append('text')
          .attr('className', 'text')
          .each(function (datum) {
            this.attr(datum);
          })
      )
      .nodes();
    HideUtil.greedy('bottom', labels);
    expect(filter(labels).length).toBeLessThan(labels.length);

    let test = boundTest(filter(labels));
    // greedy 一般不超时
    expect(test.length).toBe(0);

    verticalLabels.forEach((d) => (d.style.visibility = 'visible'));
    HideUtil.equidistance('bottom', labels);
    expect(filter(labels).length).toBeLessThan(labels.length);
    test = boundTest(filter(labels));
    // 超时不处理
    expect(test.length).not.toBe(0);
  });
});
