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
            .each((shape: any, d: any) => shape.attr(d)),
        (update: any) => update.each((shape: any, d: any) => shape.attr(d)),
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
            .each((shape: any, d: any) => shape.attr(d)),
        (update: any) => update.each((shape: any, d: any) => shape.attr(d)),
        (exit: any) => exit.remove()
      )
      .select('.axis-title')
      .node();
    return text;
  }

  describe('x-direction', () => {
    const selection = select(createCanvas(200).appendChild(new Group()));
    const drawXTitle = (attrs: any, bounds?: any) => drawTitle(attrs, bounds, selection);
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
      let titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', titleAnchor: 'start' });

      expect(titleAttrs.x).toBe(axisLine.getBBox().left);
      expect(titleAttrs.textAlign).toBe('start');
      expect(titleAttrs.textBaseline).toBe('top');

      titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', titleAnchor: 'center' });
      expect(titleAttrs.textAlign).toBe('center');
      expect(titleAttrs.x).toBe(axisLine.getBBox().left + axisLine.getBBox().width / 2);

      titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', titleAnchor: 'end' });
      expect(titleAttrs.textAlign).toBe('end');
      expect(titleAttrs.x).toBe(axisLine.getBBox().right);
      titleAttrs = getAxisTitleStyle(selection, { orient: 'top', titleAnchor: 'end' });
      expect(titleAttrs.x).toBe(axisLine.getBBox().right);
    });

    it('If x-direction, positionY is determined by `axisLabel`, `orient` and `titlePadding`', () => {
      const labelGroup = selection.select('.axis-label-group').node() as Group;
      let titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', titleAnchor: 'start' });

      expect(titleAttrs.y).toBe(labelGroup.getBBox().bottom);
      expect(titleAttrs.textBaseline).toBe('top');

      // Override textBaseline
      titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', style: { textBaseline: 'bottom' } });
      // Keep same `y`.
      expect(titleAttrs.y).toBe(labelGroup.getBBox().bottom);
      expect(titleAttrs.textBaseline).toBe('bottom');

      titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', style: { textBaseline: 'middle' } });
      expect(titleAttrs.textBaseline).toBe('middle');

      // Specify titlePadding
      titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', titlePadding: -10 });
      expect(titleAttrs.y).toBe(labelGroup.getBBox().bottom - 10);
      titleAttrs = getAxisTitleStyle(selection, { orient: 'bottom', titlePadding: 10 });
      expect(titleAttrs.y).toBe(labelGroup.getBBox().bottom + 10);

      // Orient: top and customize titlePadding.
      titleAttrs = getAxisTitleStyle(selection, { orient: 'top', titlePadding: 10 });
      expect(titleAttrs.y).toBe(labelGroup.getBBox().top - 10);
      titleAttrs = getAxisTitleStyle(selection, { orient: 'top', titlePadding: -10 });
      expect(titleAttrs.y).toBe(labelGroup.getBBox().top + 10);
    });

    describe('In x-direction, specified bounds, do not out-of bounds', () => {
      const axisLine = selection.select('.axis-line').node() as Path;
      const labelGroup = selection.select('.axis-label-group').node() as Group;

      const { left, right } = axisLine.getBBox();
      const { bottom } = labelGroup.getBBox();
      const bounds = ({ x1 = left, x2 = right, y1 = bottom, y2 = bottom + 40 }) => ({ x1, y1, x2, y2 });
      const options: any = {
        orient: 'bottom',
        content: 'Axis title..... very long very long',
        style: { textAlign: 'center', fontSize: 12 },
      };
      let titleAttrs = getAxisTitleStyle(selection, options);

      it('out of bounds', () => {
        const text = drawXTitle(titleAttrs);
        expect(text.getBBox().right).toBeGreaterThan(bounds({}).x2);
      });

      it('specify bounds, do not out of bounds.', () => {
        titleAttrs = getAxisTitleStyle(selection, { ...options, bounds: bounds({}) });
        const text = drawXTitle(titleAttrs);
        expect(text.getBBox().right).not.toBeGreaterThan(bounds({}).x2);
        expect(text.getBBox().left).not.toBeLessThan(bounds({}).x1);
        expect(titleAttrs.textAlign).toBe('end');
      });

      it('specify { textAlign: "end" }, kept align while left-hand side not out of bounds', () => {
        titleAttrs = getAxisTitleStyle(selection, {
          ...options,
          bounds: bounds({}),
          style: { ...options.style, textAlign: 'end' },
        });
        const text = drawXTitle(titleAttrs);
        expect(text.getBBox().right).not.toBeGreaterThan(bounds({}).x2);
        expect(titleAttrs.textAlign).toBe('end');
      });

      it('specify { textAlign: "end" }, align is changed to "start" while left-hand side is out of bounds', () => {
        titleAttrs = getAxisTitleStyle(selection, {
          ...options,
          content: 'options.content + options.contentcontentcontent',
          bounds: bounds({}),
          style: { ...options.style, textAlign: 'end' },
        });
        const text = drawXTitle(titleAttrs);
        expect(text.getBBox().left).not.toBeLessThan(
          Math.min(bounds({}).x1, labelGroup.getBBox().right - text.getBBox().width)
        );
        expect(text.getBBox().right).not.toBeGreaterThan(bounds({}).x2);
        expect(titleAttrs.textAlign).toBe('start');
      });

      it('specify { dx: 10 } as the offset of textShape.', () => {
        titleAttrs = getAxisTitleStyle(selection, {
          ...options,
          style: { ...options.style, textAlign: 'end', dx: 10 },
        });
        let text = drawXTitle(titleAttrs);
        expect(text.getBBox().right).toBe(right + 10);

        titleAttrs = getAxisTitleStyle(selection, {
          ...options,
          bounds: bounds({ x2: right + 20 }),
          style: { ...options.style, textAlign: 'end', dx: '10px' },
        });
        text = drawXTitle(titleAttrs, bounds({ x2: right + 20 }));
        expect(text.getBBox().right).toBe(right + 10);
      });

      it('specify { titleAnchor: "start" } will be adjust while left-hand side is out of bounds', () => {
        titleAttrs = getAxisTitleStyle(selection, {
          ...options,
          titleAnchor: 'start',
          style: { ...options.style, textAlign: 'start', dx: -10 },
        });
        let text = drawXTitle(titleAttrs);
        expect(text.getBBox().left).toBe(left - 10);

        titleAttrs = getAxisTitleStyle(selection, {
          ...options,
          bounds: bounds({}),
          titleAnchor: 'start',
          style: { ...options.style, textAlign: 'start', dx: 0 },
        });
        text = drawXTitle(titleAttrs);
        expect(text.getBBox().left).toBe(left);

        titleAttrs = getAxisTitleStyle(selection, {
          ...options,
          bounds: bounds({}),
          titleAnchor: 'start',
          style: { ...options.style, textAlign: 'start', dx: 10 },
        });
        text = drawXTitle(titleAttrs);
        expect(text.getBBox().left).toBe(left + 10);
      });
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
    const { top, bottom } = axisLine.getBBox();
    const { right } = labelGroup.getBBox();

    it('If y-direction, positionX is determined by `axisLabel`, `orient` and `titlePadding`', () => {
      let titleAttrs = getAxisTitleStyle(selection, { orient: 'right', titleAnchor: 'start' });

      expect(titleAttrs.x).toBe(labelGroup.getBBox().right);
      expect(titleAttrs.textBaseline).toBe('bottom');
      expect(titleAttrs.textAlign).toBe('start');

      // Override textAlign
      titleAttrs = getAxisTitleStyle(selection, { orient: 'right', style: { textAlign: 'end' } });
      // // Keep same `x`.
      expect(titleAttrs.x).toBe(labelGroup.getBBox().right);
      expect(titleAttrs.textAlign).toBe('end');

      titleAttrs = getAxisTitleStyle(selection, { orient: 'right', style: { textBaseline: 'middle' } });
      expect(titleAttrs.textBaseline).toBe('middle');

      // Specify titlePadding
      titleAttrs = getAxisTitleStyle(selection, { orient: 'right', titlePadding: -10 });
      expect(titleAttrs.x).toBe(labelGroup.getBBox().right - 10);
      titleAttrs = getAxisTitleStyle(selection, { orient: 'right', titlePadding: 10 });
      expect(titleAttrs.x).toBe(labelGroup.getBBox().right + 10);
      // // Orient: top and customize titlePadding.
      titleAttrs = getAxisTitleStyle(selection, { orient: 'left', titlePadding: 10 });
      expect(titleAttrs.x).toBe(labelGroup.getBBox().left - 10);
      titleAttrs = getAxisTitleStyle(selection, { orient: 'left', titlePadding: -10 });
      expect(titleAttrs.x).toBe(labelGroup.getBBox().left + 10);
    });

    it('If y-direction, positionY is determined by `axisLine` and `titleAnchor`', () => {
      let titleAttrs = getAxisTitleStyle(selection, { orient: 'right', titleAnchor: 'start' });

      expect(titleAttrs.y).toBe(axisLine.getBBox().top);
      expect(titleAttrs.textAlign).toBe('start');
      expect(titleAttrs.textBaseline).toBe('bottom');

      titleAttrs = getAxisTitleStyle(selection, { orient: 'right', titleAnchor: 'center' });
      expect(titleAttrs.textAlign).toBe('center');
      expect(titleAttrs.y).toBe(axisLine.getBBox().top + axisLine.getBBox().height / 2);

      titleAttrs = getAxisTitleStyle(selection, { orient: 'right', titleAnchor: 'end' });
      expect(titleAttrs.textAlign).toBe('end');
      expect(titleAttrs.y).toBe(axisLine.getBBox().bottom);
      titleAttrs = getAxisTitleStyle(selection, { orient: 'left', titleAnchor: 'end' });
      expect(titleAttrs.y).toBe(axisLine.getBBox().bottom);

      titleAttrs = getAxisTitleStyle(selection, {
        orient: 'left',
        titleAnchor: 'center',
        style: { textAlign: 'center' },
      });
      const text = drawYTitle({ ...titleAttrs, text: 'hello' });
      // 居中
      expect(text.getBBox().y + text.getBBox().height / 2).toBe(axisLine.getBBox().y + axisLine.getBBox().height / 2);
    });
  });
});
