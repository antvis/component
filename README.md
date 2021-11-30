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
import { Button } from '@antv/gui';

// add `arrow` instance into canvas
const canvas = new Canvas({
  /* ... */
});
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
  - [Arrow](./docs//ui/arrow.md)
  - [Icon](./docs/ui/icon.md)

## 📮 Contribution

```bash
$ git clone git@github.com:antvis/gui.git

$ cd gui

$ npm i

$ npm t
```

Then send a pull request after coding.

## 📄 License

MIT@[AntV](https://github.com/antvis).
