import { Canvas, Rect } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Poptip } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 200,
  renderer,
});

const rect = new Rect({
  style: {
    x: 0,
    y: 50,
    width: 100,
    height: 50,
    fill: 'red',
  },
});

canvas.appendChild(rect);

// 自定义内容
const poptip = new Poptip({
  style: {
    position: 'right',
    containerClassName: 'custom-poptip',
    domStyles: {
      '.custom-poptip': {
        height: '80px',
        width: '80px',
        'background-color': '#fff',
        'background-image':
          'url("https://gw.alipayobjects.com/mdn/rms_6ae20b/afts/img/A*N4ZMS7gHsUIAAAAAAAAAAABkARQnAQ")',
        'background-size': 'cover',
        'border-radius': '50%',
        opacity: 1,
      },
      // 内置小箭头样式自定义
      '.custom-poptip .gui-poptip-arrow': {
        width: '6px',
        height: '6px',
        transform: 'rotate(45deg)',
        'background-color': '#fff',
        position: 'absolute',
      },
      '.custom-text': {
        color: '#000',
        width: '200px',
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      },
    },
    template: `<div class="custom-text">
        <div class='text'>文本内容</div>
      </div>`,
  },
});

poptip.bind(rect);
