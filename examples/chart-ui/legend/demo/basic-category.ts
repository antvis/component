import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Category } from '@antv/gui';
import * as dat from 'dat.gui';

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});

const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 200,
  renderer,
});

const items1 = [
  { id: '事例一', color: '#4982f8' },
  { id: '事例二', color: '#41d59c' },
  { id: '事例三', color: '#516587' },
  { id: '事例四', color: '#f9b41b' },
  { id: '事例五', color: '#624ef7' },
].map(({ id, color }) => {
  return { name: id, id, state: 'selected', color };
});

const items2 = [
  { id: '1991', color: '#4982f8' },
  { id: '1992', color: '#41d59c' },
  { id: '1993', color: '#516587' },
  { id: '1994', color: '#f9b41b' },
  { id: '1995', color: '#624ef7' },
].map(({ id, color }) => {
  return { value: id, id, state: 'selected', color };
});

const items3 = [
  { id: 'Tokyo', color: '#4982f8' },
  { id: 'London', color: '#41d59c' },
].map(({ id, color }) => {
  return { name: id, id, state: 'selected', color };
});

const items4 = [
  { id: 'series1', color: '#4982f8' },
  { id: 'series2', color: '#41d59c' },
].map(({ id, color }) => {
  return { name: id, id, state: 'selected', color };
});

function createCategory(x, y, items, marker = 'circle', furtherOptions = {}) {
  canvas.appendChild(
    new Category({
      style: {
        x,
        y,
        items,
        itemMarker: ({ color }) => {
          return {
            size: 10,
            marker: marker,
            style: {
              selected: {
                fill: color,
              },
            },
          };
        },
        spacing: [0, 0],
        maxItemWidth: 160,
        ...furtherOptions,
      },
    })
  );
}

createCategory(10, 10, items1);
createCategory(10, 50, items2, 'square');
createCategory(10, 90, items3, undefined, {
  itemMarker: ({ color }) => {
    return {
      size: 12,
      marker: 'smooth',
      style: {
        default: { lineWidth: 2, fill: '#fff', stroke: '#d3d2d3' },
        selected: { lineWidth: 2, fill: '#fff', stroke: color },
      },
    };
  },
});
createCategory(10, 130, items4, undefined, {
  itemMarker: ({ color }) => {
    return {
      size: 12,
      marker: 'hvh',
      style: {
        default: { lineWidth: 2, fill: '#fff', stroke: '#d3d2d3' },
        selected: { lineWidth: 2, fill: '#fff', stroke: color },
      },
    };
  },
});
