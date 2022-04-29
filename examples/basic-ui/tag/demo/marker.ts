import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Marker, Tag } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 300,
  height: 300,
  renderer,
});

Marker.registerSymbol('heart', (x, y, width) => {
  const r = width / 4;
  const dx = x - width / 2;
  const dy = y - width / 2;
  return [
    ['M', dx, dy + r * 2],
    ['A', r, r, 0, 0, 1, x, dy + r],
    ['A', r, r, 0, 0, 1, dx + width, dy + r * 2],
    ['L', x, dy + width],
    ['L', dx, dy + r * 2],
    ['Z'],
  ];
});

Marker.registerSymbol('check', (x, y, r) => {
  return [
    ['M', x, y - r],
    ['A', r, r, 0, 0, 1, x, y + r],
    ['A', r, r, 0, 0, 1, x, y - r],
    ['Z'],
    ['M', x - r / 2, y + r / 8],
    ['L', x - r / 8, y + r / 2],
    ['L', x + r / 3, y - r / 2],
  ];
});

Marker.registerSymbol('stop', (x, y, r) => {
  return [
    ['M', x, y - r],
    ['A', r, r, 0, 0, 1, x, y + r],
    ['A', r, r, 0, 0, 1, x, y - r],
    ['Z'],
    ['M', x - r / 2, y],
    ['L', x + r / 2, y],
  ];
});

Marker.registerSymbol('error', (x, y, r) => {
  return [
    ['M', x, y - r],
    ['A', r, r, 0, 0, 1, x, y + r],
    ['A', r, r, 0, 0, 1, x, y - r],
    ['Z'],
    ['M', x - r / 3, y - r / 3],
    ['L', x + r / 3, y + r / 3],
    ['M', x + r / 3, y - r / 3],
    ['L', x - r / 3, y + r / 3],
  ];
});

Marker.registerSymbol('star', (x, y, r) => {
  const path = [];
  for (let i = 0; i < 5; i++) {
    path.push([
      i === 0 ? 'M' : 'L',
      (Math.cos(((18 + i * 72) * Math.PI) / 180) * r) / 2 + x,
      (-Math.sin(((18 + i * 72) * Math.PI) / 180) * r) / 2 + y,
    ]);
    path.push([
      'L',
      (Math.cos(((54 + i * 72) * Math.PI) / 180) * r) / 4 + x,
      (-Math.sin(((54 + i * 72) * Math.PI) / 180) * r) / 4 + y,
    ]);
  }
  path.push(['Z']);
  return path;
});

canvas.appendChild(
  new Tag({
    style: {
      x: 0,
      y: 10,
      text: 'Hello',
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#fa8c16',
        },
      },
      marker: {
        symbol: 'star',
        fill: '#fa8c16',
        size: 20,
      },
      backgroundStyle: {
        default: {
          stroke: '#ffd591',
          fill: '#fff7e6',
        },
      },
    },
  })
);
canvas.appendChild(
  new Tag({
    style: {
      x: 0,
      y: 40,
      text: 'Hello',
      spacing: 6,
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#000',
          fillOpacity: 0.85,
        },
      },
      marker: {
        symbol: 'triangle',
        x: 0,
        y: 0,
        fill: '#000',
        stroke: '#000',
        fillOpacity: 0.85,
        size: 8,
      },
      backgroundStyle: {
        default: {
          stroke: '#d9d9d9',
          fill: '#fafafa',
        },
      },
    },
  })
);

canvas.appendChild(
  new Tag({
    style: {
      x: 0,
      y: 70,
      text: 'Hello',
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#52c41a',
          fillOpacity: 0.85,
        },
      },
      marker: {
        symbol: 'heart',
        x: 0,
        y: 0,
        fill: '#52c41a',
        fillOpacity: 0.85,
        size: 20,
      },
      backgroundStyle: {
        default: {
          stroke: '#b7eb8f',
          fill: '#f6ffed',
        },
      },
    },
  })
);

canvas.appendChild(
  new Tag({
    style: {
      x: 0,
      y: 100,
      text: 'success',
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#52c41a',
          fillOpacity: 0.85,
        },
      },
      marker: {
        symbol: 'check',
        x: 0,
        y: 0,
        stroke: '#52c41a',
        size: 10,
      },
      backgroundStyle: {
        default: {
          stroke: '#b7eb8f',
          fill: '#f6ffed',
        },
      },
    },
  })
);

canvas.appendChild(
  new Tag({
    style: {
      x: 0,
      y: 130,
      text: 'stop',
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#000000d9',
          fillOpacity: 0.85,
        },
      },
      marker: {
        symbol: 'stop',
        x: 0,
        y: 0,
        stroke: '#000000d9',
        size: 10,
      },
      backgroundStyle: {
        default: {
          stroke: '#d9d9d9',
          fill: '#fafafa',
        },
      },
    },
  })
);

canvas.appendChild(
  new Tag({
    style: {
      x: 0,
      y: 160,
      text: 'error',
      textStyle: {
        default: {
          x: 0,
          y: 30,
          fontSize: 12,
          fill: '#f5222d',
          fillOpacity: 0.85,
        },
      },
      marker: {
        symbol: 'error',
        x: 0,
        y: 0,
        stroke: '#f5222d',
        size: 10,
      },
      backgroundStyle: {
        default: {
          stroke: '#ffa39e',
          fill: '#fff1f0',
        },
      },
    },
  })
);
