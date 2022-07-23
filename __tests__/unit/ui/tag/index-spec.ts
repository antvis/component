import { Tag } from '../../../../src';
import { createDiv, delay } from '../../../utils';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas(500, 'svg');

describe('tag', () => {
  const tag = new Tag({
    style: {
      x: 0,
      y: 0,
      text: 'tag',
    },
  });
  canvas.appendChild(tag);

  it('padding', () => {
    tag.update({ padding: [6, 8] });
    const bounds = (tag.querySelector('.tag-content')! as any).getLocalBounds();
    expect(bounds.min[0]).toBe(8);
    expect(bounds.min[1]).toBe(6);
  });

  it('add marker', () => {
    tag.update({ spacing: 10, marker: { symbol: 'triangle', size: 12 } });

    const markerBounds = (tag.querySelector('.tag-marker')! as any).getLocalBounds();
    const bounds = (tag.querySelector('.tag-text')! as any).getLocalBounds();
    expect(markerBounds.max[0] + 10).toBe(bounds.min[0]);
  });

  it('text', () => {
    tag.update({ text: 'hello' });
    expect(tag.querySelector('.tag-text')!.style.text).toBe('hello');
  });

  it('textStyle', () => {
    tag.update({ textStyle: { fill: 'red' } });
    expect(tag.querySelector('.tag-text')!.style.fill).toBe('red');
  });

  it('backgroundStyle', () => {
    tag.update({ backgroundStyle: { fill: 'blue' } });
    expect(tag.querySelector('.tag-background')!.style.fill).toBe('blue');
  });

  // todo
  it.skip('align and verticalAlign', () => {
    tag.update({ marker: null, padding: [4, 8] });
    tag.update({ x: 100, y: 0 });
    setTimeout(() => {
      expect(tag.getLocalBounds().min[0]).toBe(100);
      expect(tag.getLocalBounds().min[1]).toBe(100);
    }, 0);
    // tag.update({ align: 'end' });
    setTimeout(() => {
      // console.log(tag.getLocalBounds().min[0]);
      // expect(tag.getLocalBounds().min[0]).toBe(tag.getLocalBounds().halfExtents[0]);
    }, 0);
  });

  afterAll(() => {
    tag.destroy();
  });
});
