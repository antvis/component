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
  - [Axis](./docs//ui/axis.zh.md)
  - [Legend](./docs/ui/legend.zh.md)
  - [Tooltip](./docs/ui/tooltip.zh.md)
  - [Slider](./docs/ui/slider.zh.md)
  - [Scrollbar](./docs/ui/scrollbar.zh.md)
  - [Button](./docs/ui/button.zh.md)
  - [Checkbox](./docs/ui/checkbox.zh.md)
  - [Navigator](./docs/ui/navigator.zh.md)

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
