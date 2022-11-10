import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Button } from '../../../../src';
import type { RectProps, TextProps } from '../../../../src/types';
import { createDiv } from '../../../utils';

const renderer = new CanvasRenderer();

describe.skip('button', () => {
  test('basic', async () => {
    const div = createDiv();

    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      style: {
        x: 50,
        y: 40,
        text: 'basic button',
      },
    });

    const { x, y, text } = button.attributes;

    expect(button.getPosition()[0]).toBe(50);
    expect(button.getPosition()[1]).toBe(40);
    expect(x).toBe(50);
    expect(y).toBe(40);

    expect(text).toBe('basic button');
    // @ts-ignore
    const { textAlign, textBaseline } = button.getStyle('textStyle');
    expect(textAlign).toBe('center');
    expect(textBaseline).toBe('middle');

    // @ts-ignore
    const { stroke, height, lineWidth, radius } = button.getStyle('buttonStyle');
    expect(stroke).toBe('#bbb');
    expect(height).toBe(30);
    expect(lineWidth).toBe(1);
    expect(radius).toBe(5);

    canvas.appendChild(button);
  });

  test('text', async () => {
    const div = createDiv();

    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      style: {
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

    const canvas = new Canvas({
      container: div,
      width: 300,
      height: 300,
      renderer,
    });

    const button = new Button({
      style: {
        x: 80,
        y: 60,
        text: 'change position button',
      },
    });

    const { x, y } = button.attributes;

    expect(button.getPosition()[0]).toBe(80);
    expect(button.getPosition()[1]).toBe(60);
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
      style: {
        x: 50,
        y: 40,
        text: 'textStyle',
        textStyle: {
          default: {
            fill: '#abc',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Helvetica',
            textAlign: 'right',
            textBaseline: 'top',
          },
        },
      },
    });

    const { textStyle } = button.attributes;

    const { fill, fontSize, fontWeight, fontFamily, textAlign, textBaseline } = textStyle!.default as TextProps;
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
      style: {
        x: 50,
        y: 40,
        text: 'buttonStyle',
        buttonStyle: {
          default: {
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

    const { buttonStyle } = button.attributes;

    const { width, height, fill, opacity, stroke, lineWidth, radius, lineDash } = buttonStyle!.default as RectProps;

    expect(width).toBe(150);
    expect(height).toBe(40);
    expect(fill).toBe('pink');
    expect(opacity).toBe(0.5);
    expect(stroke).toBe('#666');
    expect(lineWidth).toBe(5);
    expect(radius).toBe(10);
    expect((lineDash as number[])[0]).toBe(6);
    expect((lineDash as number[])[1]).toBe(10);

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
      style: {
        x: 50,
        y: 40,
        text: 'hoverStyle',
        textStyle: {
          active: {
            fill: '#abc',
            fontSize: 20,
            fontWeight: 'bold',
            fontFamily: 'Helvetica',
            textAlign: 'right',
            textBaseline: 'top',
          },
        },
        buttonStyle: {
          active: {
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

    const { textStyle, buttonStyle } = button.attributes;
    const { active: activeTextStyle } = textStyle as { active: TextProps };
    const { active: activeButtonStyle } = buttonStyle as { active: RectProps };

    expect(activeTextStyle.fill).toBe('#abc');
    expect(activeTextStyle.fontSize).toBe(20);
    expect(activeTextStyle.fontWeight).toBe('bold');
    expect(activeTextStyle.fontFamily).toBe('Helvetica');
    expect(activeTextStyle.textAlign).toBe('right');
    expect(activeTextStyle.textBaseline).toBe('top');

    expect(activeButtonStyle.width).toBe(150);
    expect(activeButtonStyle.height).toBe(40);
    expect(activeButtonStyle.fill).toBe('pink');
    expect(activeButtonStyle.opacity).toBe(0.5);
    expect(activeButtonStyle.stroke).toBe('#666');
    expect(activeButtonStyle.lineWidth).toBe(5);
    expect(activeButtonStyle.radius).toBe(10);
    expect((activeButtonStyle.lineDash as number[])[0]).toBe(6);
    expect((activeButtonStyle.lineDash as number[])[1]).toBe(10);

    canvas.appendChild(button);
  });
});
