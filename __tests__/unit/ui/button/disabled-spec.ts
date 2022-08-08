import { Button } from '../../../../src';
import { createCanvas } from '../../../utils/render';

const canvas = createCanvas();

describe('disabled button', () => {
  test('disable', () => {
    const button = new Button({
      style: {
        x: 50,
        y: 50,
        text: 'hoverStyle',
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
        state: 'disabled',
      },
    });

    canvas.appendChild(button);

    const rect = button.querySelector('.background') as any;
    const { fill, stroke } = rect.attributes;
    expect(fill).toBe('#f5f5f5');
    expect(stroke).toBe('#d9d9d9');

    // @ts-ignore
    const text = button.textShape;
    expect(text.attr('fill')).toBe('#b8b8b8');
  });
});
