import { Canvas } from '@antv/g-canvas';
import * as GUI from 'dat.gui';
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
          itemWidth: 100
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

    it('default responsive order - without value',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: true
        },
        itemValue:false,
        itemWidth: 70
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const nameShape = getItemShape(itemGroup,'legend-item-name');
      expect(nameShape.get('tip')).toBe('AthrunZala');
      legend.destroy();
    });

    it('custom responsive order - ellipsis name',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: true
        },
        itemValue:{
          autoEllipsis: true,
          autoHide: true,
        },
        itemWidth: 120,
        responsiveOrder:['autoEllipsisName','autoEllipsisValue','autoHideValue']
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const nameShape = getItemShape(itemGroup,'legend-item-name');
      expect(nameShape.get('tip')).toBe('AthrunZala');
      legend.destroy();
    });

    it('custom responsive order - ellipsis value',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: true
        },
        itemValue:{
          autoEllipsis: true,
          autoHide: true,
        },
        itemWidth: 100,
        responsiveOrder:['autoEllipsisName','autoEllipsisValue','autoHideValue']
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const nameShape = getItemShape(itemGroup,'legend-item-name');
      expect(nameShape.get('tip')).toBe('AthrunZala');
      const valueShape = getItemShape(itemGroup,'legend-item-value');
      expect(valueShape.get('tip')).toBe('GAT-X303');
      legend.destroy();
    });

    it('custom responsive order - hide value',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: true
        },
        itemValue:{
          autoEllipsis: true,
          autoHide: true,
        },
        itemWidth: 10,
        responsiveOrder:['autoEllipsisName','autoEllipsisValue','autoHideValue']
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const nameShape = getItemShape(itemGroup,'legend-item-name');
      expect(nameShape.get('tip')).toBe('AthrunZala');
      const valueShape = getItemShape(itemGroup,'legend-item-value');
      expect(valueShape.get('tip')).toBe('GAT-X303');
      expect(valueShape.attr('text')).toBe('');
      legend.destroy();
    });

    it('close one action',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: false
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
      expect(valueShape.get('tip')).toBe('GAT-X303');
      expect(nameShape.get('tip')).toBe(undefined);
      legend.destroy();
    });

    it('ellipsis position',()=>{
      const legendCfg = {
        itemName:{
          autoEllipsis: false,
          ellipsisPosition: 'tail'
        },
        itemValue:{
          autoEllipsis: true,
          autoHide: true,
          ellipsisPosition: 'head'
        },
        itemWidth: 140
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const valueShape = getItemShape(itemGroup,'legend-item-value');
      const pattern = new RegExp('\u2026$');
      expect(pattern.test(valueShape.attr('text'))).toBe(true);
      legend.destroy();
    });

    it("don't trigger responsive by default",()=>{
      const legend = renderLegend(canvas, items);
      const itemGroup = legend.getElementById('c-legend-item-group').get('children')[0].get('children')[0];
      const nameShape = getItemShape(itemGroup,'legend-item-name');
      expect(nameShape.get('tip')).toBe(undefined);
      legend.destroy();
    });

    it.skip("show",()=>{
      const guiContainer = document.createElement('div');
      guiContainer.style.width = '400';
      guiContainer.style.height = '400';
      guiContainer.style.position = 'absolute';
      guiContainer.style.left = '400px';
      guiContainer.style.top = '400px';
      dom.appendChild(guiContainer);
      const legendCfg = {
        itemName:{
          autoEllipsis: true,
          ellipsisPosition: 'tail'
        },
        itemValue:{
          autoEllipsis: true,
          autoHide: true,
          ellipsisPosition: 'head'
        },
        itemWidth: 200
      };
      const legend = renderLegend(canvas, items, legendCfg);
      const guiCfg = {
        autoEllipsisName: true,
        autoEllipsisValue: true,
        autoHideValue: true,
        overlapOrder:['autoEllipsisValue', 'autoHideValue', 'autoEllipsisNam'],
        itemWidth: 200,
      };
      const gui = new GUI.gui.GUI({autoPlace: false});
      gui.add(guiCfg,'autoEllipsisName',true);
      gui.add(guiCfg,'autoEllipsisValue',true);
      gui.add(guiCfg,'autoHideValue',true); 
      gui.add(guiCfg,'overlapOrder',['autoEllipsisValue', 'autoHideValue', 'autoEllipsisNam']);
      guiContainer.appendChild(gui.domElement);
      const sizeContrller = gui.add(guiCfg,'itemWidth',20,200);
      sizeContrller.onFinishChange((value)=>{
        legendCfg.itemWidth = value;
        legend.update(legendCfg);
      });
    });
});

function renderLegend(canvas,items,cfg = {}){
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