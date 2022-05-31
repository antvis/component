// eslint-disable no-explicit-any
import { Group, Rect, Path } from '@antv/g';
import { select } from '../../../../src/util/selection';
import { getAxisTitleStyle } from '../../../../src/ui/axis/axisTitle';
import { createCanvas } from '../../../utils/render';

describe('Axis title', () => {
  function drawTitle(attrs: any = {}, bounds?: any, selection?: any) {
    const axisLine = selection.select('.axis-line').node() as Path;
    selection
      .selectAll('.axis-title-rect')
      .data(
        [
          {
            x: bounds ? bounds.x1 : axisLine.getBBox().x,
            y: bounds ? bounds.y1 : attrs.y,
            width: bounds ? bounds.x2 - bounds.x1 : axisLine.getBBox().width,
            height: bounds ? bounds.y2 - bounds.y1 : 20,
            fill: 'pink',
          },
        ],
        () => 1
      )
      .join(
        (enter: any) =>
          enter
            .append('rect')
            .attr('className', 'axis-title-rect')
            .each(function (d: any) {
              this.attr(d);
            }),
        (update: any) =>
          update.each(function (d: any) {
            this.attr(d);
          }),
        (exit: any) => exit.remove()
      );
    const text = selection
      .selectAll('.axis-title')
      .data([attrs], () => 1)
      .join(
        (enter: any) =>
          enter
            .append('text')
            .attr('className', 'axis-title')
            .each(function (d: any) {
              this.attr(d);
            }),
        (update: any) =>
          update.each(function (d: any) {
            this.attr(d);
          }),
        (exit: any) => exit.remove()
      )
      .select('.axis-title')
      .node();
    return text;
  }

  describe('x-direction', () => {
    const selection = select(createCanvas(200).appendChild(new Group()));
    // Init.
    const group = selection.append('g').attr('className', 'container').node();
    const startX = 20;
    const startY = 50;
    const endX = 200;
    group.appendChild(
      new Path({
        className: 'axis-line',
        style: {
          path: [
            ['M', startX, 50],
            ['L', endX, startY],
          ],
          lineWidth: 1,
          stroke: 'red',
          fill: 'red',
        },
      })
    );
    group.appendChild(
      new Rect({
        className: 'axis-label-group',
        style: { x: Math.min(startX, endX), width: Math.abs(endX - startX), y: startY, height: 50, fill: 'lightgreen' },
      })
    );

    it('If x-direction, positionX is determined by `axisLine` and `titleAnchor`', () => {
      const axisLine = selection.select('.axis-line').node() as Path;
      const { min, max } = axisLine.getLocalBounds() as any;
      let titleAttrs = getAxisTitleStyle({ titleAnchor: 'start' }, { min, max }, 'bottom');

      expect(titleAttrs.x).toBe(min[0]);
      expect(titleAttrs.textAlign).toBe('start');
      expect(titleAttrs.textBaseline).toBe('top');

      titleAttrs = getAxisTitleStyle({ titleAnchor: 'center' }, { min, max }, 'bottom');
      expect(titleAttrs.textAlign).toBe('center');
      expect(titleAttrs.x).toBe(axisLine.getBBox().left + axisLine.getBBox().width / 2);

      titleAttrs = getAxisTitleStyle({ titleAnchor: 'end' }, { min, max }, 'bottom');
      expect(titleAttrs.textAlign).toBe('end');
      expect(titleAttrs.x).toBe(max[0]);
      titleAttrs = getAxisTitleStyle({ titleAnchor: 'end' }, { min, max }, 'top');
      expect(titleAttrs.x).toBe(max[0]);
    });

    it('If x-direction, positionY is determined by `axisLabel`, `orient`', () => {
      const labelGroup = selection.select('.axis-label-group').node() as Group;
      const { min, max } = labelGroup.getLocalBounds() as any;
      let titleAttrs = getAxisTitleStyle({ titleAnchor: 'start' }, { min, max }, 'bottom');
      ``;
      expect(titleAttrs.y).toBe(labelGroup.getBBox().bottom);
      expect(titleAttrs.textBaseline).toBe('top');

      // Override textBaseline
      titleAttrs = getAxisTitleStyle({ style: { textBaseline: 'bottom' } }, { min, max }, 'bottom');
      // Keep same `y`.
      expect(titleAttrs.y).toBe(labelGroup.getBBox().bottom);
      expect(titleAttrs.textBaseline).toBe('bottom');

      titleAttrs = getAxisTitleStyle({ style: { textBaseline: 'middle' } }, { min, max }, 'bottom');
      expect(titleAttrs.textBaseline).toBe('middle');
    });
  });

  describe('y-direction', () => {
    const selection = select(createCanvas(400).appendChild(new Group()));
    const drawYTitle = (attrs: any, bounds?: any) => drawTitle(attrs, bounds, selection);
    // Init.
    const group = selection.append('g').attr('className', 'container').node();
    const startY = 150;
    const endY = 300;
    const startX = 50;
    group.appendChild(
      new Path({
        className: 'axis-line',
        style: {
          path: [
            ['M', startX, startY],
            ['L', startX, endY],
          ],
          lineWidth: 1,
          stroke: 'red',
          fill: 'red',
        },
      })
    );
    group.appendChild(
      new Rect({
        className: 'axis-label-group',
        style: { x: startX, width: 50, y: startY, height: Math.abs(endY - startY), fill: 'lightgreen' },
      })
    );

    const labelGroup = selection.select('.axis-label-group').node() as Group;
    const axisLine = selection.select('.axis-line').node() as Group;
    const { min, max } = labelGroup.getLocalBounds() as any;
    const { right } = labelGroup.getBBox();

    it('If y-direction, positionX is determined by `axisLabel`, `orient` and `titlePadding`', () => {
      let titleAttrs = getAxisTitleStyle({ titleAnchor: 'start' }, { min, max }, 'right');

      expect(titleAttrs.x).toBe(labelGroup.getBBox().right);
      expect(titleAttrs.textBaseline).toBe('bottom');
      expect(titleAttrs.textAlign).toBe('start');

      // Override textAlign
      titleAttrs = getAxisTitleStyle({ style: { textAlign: 'end' } }, { min, max }, 'right');
      // // Keep same `x`.
      expect(titleAttrs.x).toBe(labelGroup.getBBox().right);
      expect(titleAttrs.textAlign).toBe('end');

      titleAttrs = getAxisTitleStyle({ style: { textBaseline: 'middle' } }, { min, max }, 'right');
      expect(titleAttrs.textBaseline).toBe('middle');
    });

    it('If y-direction, positionY is determined by `axisLine` and `titleAnchor`', () => {
      let titleAttrs = getAxisTitleStyle({ titleAnchor: 'start' }, { min, max }, 'right');

      expect(titleAttrs.y).toBe(axisLine.getBBox().top);
      expect(titleAttrs.textAlign).toBe('start');
      expect(titleAttrs.textBaseline).toBe('bottom');

      titleAttrs = getAxisTitleStyle({ titleAnchor: 'center' }, { min, max }, 'right');
      expect(titleAttrs.textAlign).toBe('center');
      expect(titleAttrs.y).toBe(axisLine.getBBox().top + axisLine.getBBox().height / 2);

      titleAttrs = getAxisTitleStyle({ titleAnchor: 'end' }, { min, max }, 'right');
      expect(titleAttrs.textAlign).toBe('end');
      expect(titleAttrs.y).toBe(axisLine.getBBox().bottom);
      titleAttrs = getAxisTitleStyle({ titleAnchor: 'end' }, { min, max }, 'left');
      expect(titleAttrs.y).toBe(axisLine.getBBox().bottom);

      titleAttrs = getAxisTitleStyle(
        {
          titleAnchor: 'center',
          style: { textAlign: 'center' },
        },
        { min, max },
        'left'
      );
      const text = drawYTitle({ ...titleAttrs, text: 'hello' });
      // 居中
      // expect(text.getBBox().y + text.getBBox().height / 2).toBe(axisLine.getBBox().y + axisLine.getBBox().height / 2);
      expect(text.getBBox().y + text.getBBox().height / 2).toBeGreaterThan(
        axisLine.getBBox().y + axisLine.getBBox().height / 2 - 1
      );
    });
  });
});
