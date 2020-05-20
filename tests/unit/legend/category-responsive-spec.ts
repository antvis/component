import { Canvas } from '@antv/g-canvas';
import CategroyLegend from '../../../src/legend/category';
import { getItemShape } from '../../../src/legend/responsive';

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
      { name: 'AthrunZala', value: 'GAT-X303', marker: { symbol: 'circle', style: { r: 4, fill: 'blue' } } },
      { name: 'YzakJule', value: 'GAT-X102', marker: { symbol: 'circle', style: { r: 4, fill: 'grey' } } },
      { name: 'ShinnAsuka', value: 'ZGMF-X56S', marker: { symbol: 'circle', style: { r: 4, fill: 'black' } } },
      { name: 'KiraYamato', value: 'GAT-X105', marker: { symbol: 'circle', style: { r: 4, fill: 'brown' } } },
    ];

    it('default responsive order - ellipsValue',()=>{
        const legendCfg = {
          itemName:{
            autoEllipsis: true
          },
          itemValue:{
            autoEllipsis: true,
            autoHide: true
          },
          itemWidth: 120
        };
        const legend = renderLegend(canvas, items, legendCfg);
        const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
        const valueShape = getItemShape(itemGroup,'legend-item-value');
        const nameShape = getItemShape(itemGroup,'legend-item-name');
        expect(valueShape.get('tip')).toBe('GAT-X303');
        expect(nameShape.attr('text')).toBe('AthrunZala');
        legend.destroy();
    });

    it('default responsive order - hideValue',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: true
        },
        itemValue:{
          autoEllipsis: true,
          autoHide: true
        },
        itemWidth: 100
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const valueShape = getItemShape(itemGroup,'legend-item-value');
      const nameShape = getItemShape(itemGroup,'legend-item-name');
      expect(valueShape.attr('text')).toBe('');
      expect(nameShape.attr('text')).toBe('AthrunZala');
      legend.destroy();
    });

    it('default responsive order - ellipsis name',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: true
        },
        itemValue:{
          autoEllipsis: true,
          autoHide: true
        },
        itemWidth: 70
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const nameShape = getItemShape(itemGroup,'legend-item-name');
      expect(nameShape.get('tip')).toBe('AthrunZala');
      legend.destroy();
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
    return legend;
}