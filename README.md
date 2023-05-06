<h1 align="center">
<b>GUI</b>
</h1>

<div align="center">

UI components for [G](https://github.com/antvis/g).

[![Build Status](https://github.com/antvis/gui/workflows/build/badge.svg?branch=master)](https://github.com/antvis/gui/actions)
[![Coverage Status](https://img.shields.io/coveralls/github/antvis/gui/master.svg)](https://coveralls.io/github/antvis/GUI?branch=master)
[![npm Version](https://img.shields.io/npm/v/@antv/gui.svg)](https://www.npmjs.com/package/@antv/gui)
[![npm Download](https://img.shields.io/npm/dm/@antv/gui.svg)](https://www.npmjs.com/package/@antv/gui)
[![npm License](https://img.shields.io/npm/l/@antv/gui.svg)](https://www.npmjs.com/package/@antv/gui)

</div>

## ✨ Features

## 📦 Installation

```bash
$ npm install @antv/gui
```

## 🔨 Getting Started

```ts
import { Canvas } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { Button } from '@antv/gui';

// create a canvas
const canvas = new Canvas({
  container: 'container',
  width: 600,
  height: 600,
  renderer: new Renderer(),
});

// create a button
const button = new Button({
  /* ... */
});

canvas.appendChild(button);

// render it
canvas.render();
```

## 📎 Components

- [API](./docs//api.md)
- UI components
  - [Axis](https://github.com/antvis/GUI/blob/master/docs/api/ui/axis.zh.md)
  - [Legend](https://github.com/antvis/GUI/blob/master/docs/api/ui/legend.zh.md)
  - [Tooltip](https://github.com/antvis/GUI/blob/master/docs/api/ui/tooltip.zh.md)
  - [Slider](https://github.com/antvis/GUI/blob/master/docs/api/ui/slider.zh.md)
  - [Scrollbar](https://github.com/antvis/GUI/blob/master/docs/api/ui/scrollbar.zh.md)
  - [Button](https://github.com/antvis/GUI/blob/master/docs/api/ui/button.zh.md)
  - [Checkbox](https://github.com/antvis/GUI/blob/master/docs/api/ui/checkbox.zh.md)
  - [Navigator](https://github.com/antvis/GUI/blob/master/docs/api/ui/navigator.zh.md)
  - [Breadcrumb](https://github.com/antvis/GUI/blob/master/docs/api/ui/breadcrumb.zh.md)
  - [Sparkline](https://github.com/antvis/GUI/blob/master/docs/api/ui/sparkline.zh.md)

## 📮 Contribution

```bash
$ git clone git@github.com:antvis/gui.git

$ cd gui

$ npm install

$ npm run dev
```

Then send a pull request after coding.

## 📄 License

MIT@[AntV](https://github.com/antvis).
