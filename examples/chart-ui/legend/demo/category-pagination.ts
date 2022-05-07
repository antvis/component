import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer();

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 400,
  renderer,
});

const category = new Category({
  style: {
    x: 10,
    y: 10,
    title: {
      content: '基本分类图例',
    },
    items: [
      { name: 'Chrome', value: '7.08%' },
      { name: 'IE', value: '5.41%' },
      { name: 'QQ', value: '5.35%' },
      { name: 'Firefox', value: '1.23%' },
      { name: 'Microsoft Edge', value: '3.51%' },
      { name: '360', value: '2.59%' },
      { name: 'Opera', value: '0.87%' },
      { name: 'Sogou', value: '1.06%' },
      { name: 'Others', value: '0.59%' },
    ].map(({ name, value }) => {
      return { name, value, id: name, state: 'selected' };
    }),
    spacing: [10, 10],
    maxItemWidth: 160,
    orient: 'vertical',
  },
});

canvas.appendChild(category);

/** -------------------------配置区域--------------------------------------- */
const $wrapper = document.getElementById('container');
const cfg = new dat.GUI({ autoPlace: false });
$wrapper.appendChild(cfg.domElement);
const layoutFolder = cfg.addFolder('布局');
layoutFolder.open();
const layoutCfg = {
  布局: '单行',
  按钮位置: '底部',
  项宽: 140,
  最大宽度: 300,
  最大高度: 200,
};
layoutFolder
  .add(layoutCfg, '布局', ['单行', '单列', '单行分页', '单列分页', '多行', '多列', '多行分页', '多列分页'])
  .onChange((layout) => {
    const row = {
      orient: 'horizontal',
      itemWidth: undefined,
      maxItemWidth: 160,
      autoWrap: false,
      maxWidth: Infinity,
      maxHeight: undefined,
      maxCols: undefined,
      maxRows: Infinity,
    };
    const rows = {
      ...row,
      maxWidth: 300,
      autoWrap: true,
    };
    const rowPaging = {
      ...row,
      maxWidth: 300,
    };
    const rowsPaging = {
      ...rows,
      maxRows: 3,
    };

    const col = {
      orient: 'vertical',
      itemWidth: 140,
      autoWrap: false,
      maxItemWidth: 160,
      maxWidth: undefined,
      maxHeight: Infinity,
      maxCols: undefined,
      maxRows: Infinity,
    };
    const cols = {
      ...col,
      autoWrap: true,
      maxHeight: 200,
      maxRows: undefined,
      maxCols: Infinity,
    };
    const colPaging = {
      ...col,
      maxHeight: 200,
    };
    const colsPaging = {
      ...cols,
      maxHeight: 60,
      maxCols: 3,
    };

    const layoutStrategy = {
      单行: row,
      单列: col,
      单行分页: rowPaging,
      单列分页: colPaging,
      多行: rows,
      多列: cols,
      多行分页: rowsPaging,
      多列分页: colsPaging,
    };
    category.update({ ...layoutStrategy[layout] });
  });

layoutFolder.add(layoutCfg, '按钮位置', ['底部', '顶部', '左侧', '右侧', '上下', '两侧']).onChange((position) => {
  const buttonMap = {
    底部: 'bottom',
    顶部: 'top',
    左侧: 'left',
    右侧: 'right',
    上下: 'top-bottom',
    两侧: 'left-right',
  };
  category.update({ pageNavigator: { button: { position: buttonMap[position] } } });
});
layoutFolder.add(layoutCfg, '项宽', 0, 300).onChange((itemWidth) => {
  category.update({ itemWidth });
});
layoutFolder.add(layoutCfg, '最大宽度', 0, 500).onChange((maxWidth) => {
  category.update({ maxWidth });
});
layoutFolder.add(layoutCfg, '最大高度', 0, 300).onChange((maxHeight) => {
  category.update({ maxHeight });
});
