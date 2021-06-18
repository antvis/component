import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button } from '../../../../src';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

describe('button', () => {
  test('basic', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      attrs: {
        x: 50,
        y: 40,
        text: 'basic button',
      },
    });

    const { x, y, text, textStyle, buttonStyle } = button.attributes;

    expect(button.getPosition()[0]).toBe(50 * 2);
    expect(button.getPosition()[1]).toBe(40 * 2);
    expect(x).toBe(50);
    expect(y).toBe(40);

    expect(text).toBe('basic button');
    const { textAlign, textBaseline } = textStyle;
    expect(textAlign).toBe('center');
    expect(textBaseline).toBe('middle');

    const { stroke, height, lineWidth, radius } = buttonStyle;
    expect(stroke).toBe('#bbb');
    expect(height).toBe(30);
    expect(lineWidth).toBe(1);
    expect(radius).toBe(5);

    canvas.appendChild(button);
  });

  test('text', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      attrs: {
        x: 50,
        y: 40,
        text: 'changed button',
      },
    });

    const { text } = button.attributes;
    expect(text).toBe('changed button');
    canvas.appendChild(button);
  });

  test('position', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      attrs: {
        x: 80,
        y: 60,
        text: 'change position button',
      },
    });

    const { x, y } = button.attributes;

    expect(button.getPosition()[0]).toBe(80 * 2);
    expect(button.getPosition()[1]).toBe(60 * 2);
    expect(x).toBe(80);
    expect(y).toBe(60);

    canvas.appendChild(button);
  });

  test('textStyle', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      attrs: {
        x: 50,
        y: 40,
        text: 'textStyle',
        textStyle: {
          fill: '#abc',
          fontSize: 20,
          fontWeight: 'bold',
          fontFamily: 'Helvetica',
          textAlign: 'right',
          textBaseline: 'top',
        },
      },
    });

    const { textStyle } = button.attributes;

    const { fill, fontSize, fontWeight, fontFamily, textAlign, textBaseline } = textStyle;
    expect(fill).toBe('#abc');
    expect(fontSize).toBe(20);
    expect(fontWeight).toBe('bold');
    expect(fontFamily).toBe('Helvetica');
    expect(textAlign).toBe('right');
    expect(textBaseline).toBe('top');

    canvas.appendChild(button);
  });

  test('buttonStyle', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      attrs: {
        x: 50,
        y: 40,
        text: 'buttonStyle',
        buttonStyle: {
          width: 150,
          height: 40,
          fill: 'pink',
          opacity: 0.5,
          stroke: '#666',
          lineWidth: 5,
          radius: 10,
          lineDash: [6, 10],
        },
      },
    });

    const { buttonStyle } = button.attributes;

    const { width, height, fill, opacity, stroke, lineWidth, radius, lineDash } = buttonStyle;

    expect(width).toBe(150);
    expect(height).toBe(40);
    expect(fill).toBe('pink');
    expect(opacity).toBe(0.5);
    expect(stroke).toBe('#666');
    expect(lineWidth).toBe(5);
    expect(radius).toBe(10);
    expect(lineDash[0]).toBe(6);
    expect(lineDash[1]).toBe(10);

    canvas.appendChild(button);
  });

  test('hoverStyle', async () => {
    const div = createDiv();

    // @ts-ignore
    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      attrs: {
        x: 50,
        y: 40,
        text: 'hoverStyle',
        hoverStyle: {
          textStyle: {
            fill: '#abc',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Helvetica',
            textAlign: 'right',
            textBaseline: 'top',
          },
          buttonStyle: {
            width: 150,
            height: 40,
            fill: 'pink',
            opacity: 0.5,
            stroke: '#666',
            lineWidth: 5,
            radius: 10,
            lineDash: [6, 10],
          },
        },
      },
    });

    const { hoverStyle } = button.attributes;
    const { textStyle, buttonStyle } = hoverStyle;

    expect(textStyle.fill).toBe('#abc');
    expect(textStyle.fontSize).toBe(20);
    expect(textStyle.fontWeight).toBe('bold');
    expect(textStyle.fontFamily).toBe('Helvetica');
    expect(textStyle.textAlign).toBe('right');
    expect(textStyle.textBaseline).toBe('top');

    expect(buttonStyle.width).toBe(150);
    expect(buttonStyle.height).toBe(40);
    expect(buttonStyle.fill).toBe('pink');
    expect(buttonStyle.opacity).toBe(0.5);
    expect(buttonStyle.stroke).toBe('#666');
    expect(buttonStyle.lineWidth).toBe(5);
    expect(buttonStyle.radius).toBe(10);
    expect(buttonStyle.lineDash[0]).toBe(6);
    expect(buttonStyle.lineDash[1]).toBe(10);

    canvas.appendChild(button);
  });
});
