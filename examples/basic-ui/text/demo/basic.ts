import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Text } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 500,
  height: 500,
  renderer,
});

const text = new Text({
  style: {
    x: 10,
    y: 10,
    text: 'the first line\nthe second line\nthe third line',
    fontSize: 50,
    backgroundStyle: {
      lineWidth: 1,
      stroke: '#000',
    },
  },
});

canvas.appendChild(text);

/**
 * 控件配置
 */

const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const fontFolder = cfg.addFolder('文本');
fontFolder.open();
const fontCfg = {
  x: 10,
  y: 10,
  text: 'the first line\nthe second line\nthe third line',
  width: 0,
  height: 0,
  lineHeight: 0,
  fontColor: '#000',
  fontFamily: 'Arial',
  fontSize: 50,
  fontWeight: 'normal',
  fontVariant: 'normal',
  letterSpacing: 0,
  leading: 0,
};

fontFolder
  .add(fontCfg, 'x', 0, 500)
  .step(1)
  .onChange((x) => {
    text.update({ x });
  });

fontFolder
  .add(fontCfg, 'y', 0, 500)
  .step(1)
  .onChange((y) => {
    text.update({ y });
  });

fontFolder.add(fontCfg, 'text').onChange((text) => {
  text.update({ text });
});

fontFolder
  .add(fontCfg, 'width', 0, 300)
  .step(1)
  .onChange((width) => {
    text.update({ width });
  });

fontFolder
  .add(fontCfg, 'height', 0, 300)
  .step(1)
  .onChange((height) => {
    text.update({ height });
  });

fontFolder
  .add(fontCfg, 'lineHeight', 0, 100)
  .step(1)
  .onChange((lineHeight) => {
    text.update({ lineHeight });
  });

fontFolder.addColor(fontCfg, 'fontColor').onChange((fontColor) => {
  text.update({ fontColor });
});

fontFolder
  .add(fontCfg, 'fontFamily', ['PingFang SC', 'fantasy', 'Arial', 'Times', 'Microsoft YaHei'])
  .onChange((fontFamily) => {
    text.update({ fontFamily });
  });

fontFolder
  .add(fontCfg, 'fontSize', 0, 50)
  .step(1)
  .onChange((fontSize) => {
    text.update({ fontSize });
  });

fontFolder
  .add(fontCfg, 'fontWeight', ['normal', 'bold', 'bolder', 'lighter', '100', '200', '400'])
  .onChange((fontWeight) => {
    text.update({ fontWeight });
  });

fontFolder.add(fontCfg, 'fontVariant', ['normal', 'small-caps']).onChange((fontVariant) => {
  text.update({ fontVariant });
});

fontFolder
  .add(fontCfg, 'letterSpacing', 0, 50)
  .step(1)
  .onChange((letterSpacing) => {
    text.update({ letterSpacing });
  });

fontFolder
  .add(fontCfg, 'leading', 0, 50)
  .step(1)
  .onChange((leading) => {
    text.update({ leading });
  });

const alignFolder = cfg.addFolder('对齐');
alignFolder.add({ textAlign: 'center' }, 'textAlign', ['start', 'center', 'end']).onChange((textAlign) => {
  text.update({ textAlign });
});

alignFolder.add({ verticalAlign: 'middle' }, 'verticalAlign', ['top', 'middle', 'bottom']).onChange((verticalAlign) => {
  text.update({ verticalAlign });
});

const otherFolder = cfg.addFolder('其他');
otherFolder
  .add({ transform: 'none' }, 'transform', ['none', 'capitalize', 'uppercase', 'lowercase'])
  .onChange((transform) => {
    text.update({ transform });
  });

const decorationLine = otherFolder
  .add({ decorationLine: 'none' }, 'decorationLine', ['none', 'underline', 'overline', 'line-through'])
  .onChange((line) => {
    let cfg = [];
    if (line !== 'none') {
      cfg = [[line, decorationShape.getValue()]];
    }
    text.update({
      decoration: {
        type: cfg,
      },
    });
  });

const decorationShape = otherFolder
  .add({ decorationShape: 'solid' }, 'decorationShape', ['solid', 'dashed', 'dotted', 'double'])
  .onChange((shape) => {
    let line = decorationLine.getValue();
    if (line === 'none') {
      decorationLine.setValue('underline');
      line = 'underline';
    }
    text.update({
      decoration: {
        type: [[decorationLine.getValue(), shape]],
      },
    });
  });

otherFolder.addColor({ backgroundColor: '#fff' }, 'backgroundColor').onChange((color) => {
  text.update({ backgroundStyle: { fill: color } });
});

otherFolder.add({ overflow: 'none' }, 'overflow', ['none', 'clip', 'ellipsis']).onChange((overflow) => {
  text.update({ overflow });
});
