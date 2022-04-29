import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Tag } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

function createTag(x, y, text, fill, backgroundColor, backgroundBorderColor = 'transparent') {
  return new Tag({
    style: {
      x,
      y,
      text,
      padding: [4, 7],
      textStyle: {
        default: {
          fontSize: 12,
          fill,
        },
      },
      backgroundStyle: {
        default: {
          fill: backgroundColor,
          stroke: backgroundBorderColor,
          lineWidth: backgroundBorderColor === 'transparent' ? 0 : 1,
        },
      },
    },
  });
}

canvas.appendChild(createTag(0, 10, 'magenta', '#c41d7f', '#fff0f6', '#ffadd2'));
canvas.appendChild(createTag(0, 50, 'volcano', '#d4380d', '#fff2e8', '#ffbb96'));
canvas.appendChild(createTag(0, 90, 'orange', '#d46b08', '#fff7e6', '#ffd591'));
canvas.appendChild(createTag(0, 130, 'green', '#389e0d', '#f6ffed', '#b7eb8f'));
canvas.appendChild(createTag(0, 170, 'purple', '#531dab', '#f9f0ff', '#d3adf7'));

canvas.appendChild(createTag(80, 10, '#f50', '#fff', '#f50'));
canvas.appendChild(createTag(80, 50, '#2db7f5', '#fff', '#2db7f5'));
canvas.appendChild(createTag(80, 90, '#87d068', '#fff', '#87d068'));
canvas.appendChild(createTag(80, 130, '#108ee9', '#fff', '#108ee9'));
canvas.appendChild(createTag(80, 170, '#1d39c4', '#fff', '#1d39c4'));
