import { Canvas, Text, Rect, Group } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { PageNavigator } from '@antv/gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 500,
  height: 500,
  renderer,
});

const pages = new Group({ name: 'group' });

function createPages(count, width, height) {
  const pages = [];
  for (let i = 0; i < count; i += 1) {
    const rect = new Rect({
      style: {
        x: width * i,
        y: 0,
        width,
        height,
        fill: '#f3f3f3',
        stroke: 'gray',
        lineWidth: 0,
      },
    });
    const text = new Text({
      style: {
        x: width / 2,
        y: height / 2,
        text: `第${i + 1}页`,
        fill: 'black',
        fontSize: 20,
        textAlign: 'center',
        textBaseline: 'middle',
      },
    });
    rect.appendChild(text);
    pages.push(rect);
  }
  return pages;
}

const pageCount = 5;
const pageWidth = 150;
const pageHeight = 200;

createPages(pageCount, pageWidth, pageHeight).forEach((shape) => pages.appendChild(shape));

const pageNavigator = new PageNavigator({
  style: {
    x: 100,
    y: 100,
    view: pages,
    pageWidth,
    pageHeight,
    initPageNum: 1,
    loop: false,
    button: {
      position: 'bottom',
    },
  },
});

pages.removeChildren();
createPages(10, pageWidth, pageHeight).forEach((shape) => pages.appendChild(shape));

pageNavigator.update({
  loop: true,
  view: pages,
});

const newPages = new Group({});
createPages(15, pageWidth, pageHeight).forEach((shape) => newPages.appendChild(shape));
pageNavigator.update({
  view: newPages,
});

canvas.appendChild(pageNavigator);
