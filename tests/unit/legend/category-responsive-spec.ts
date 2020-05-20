import { Canvas } from '@antv/g-canvas';
import CategroyLegend from '../../../src/legend/category';

describe('responsive legend',()=>{
    const dom = document.createElement('div');
    document.body.appendChild(dom);
    dom.id = 'clc';
    const canvas = new Canvas({
      container: 'clc',
      width: 500,
      height: 500,
    });
  
    const items = [
      { name: 'AthrunZala', value: 1000, marker: { symbol: 'circle', style: { r: 4, fill: 'blue' } } },
      { name: 'YzakJule', value: 2000, marker: { symbol: 'circle', style: { r: 4, fill: 'grey' } } },
      { name: 'ShinnAsuka', value: 300, marker: { symbol: 'circle', style: { r: 4, fill: 'black' } } },
      { name: 'KiraYamato', value: 40000, marker: { symbol: 'circle', style: { r: 4, fill: 'brown' } } },
    ];

    it('default responsive order',()=>{
        const legendCfg = {
          itemName:{
            autoEllipsis: true
          },
          itemValue:{
            autoEllipsis: true,
            autoHide: true
          },
          itemWidth: 50
        };
        renderLegend(canvas, items, legendCfg);
    });

});

function renderLegend(canvas,items,cfg){
    const container = canvas.addGroup();
    const legend = new CategroyLegend({
      id: 'c',
      container,
      x: 100,
      y: 100,
      items,
      updateAutoRender: true,
      itemBackground: null,
      layout: 'vertical',
      ...cfg
    });
    legend.init();
    legend.render();
}