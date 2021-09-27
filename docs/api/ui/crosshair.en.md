---
title: Crosshair
order: 8
---

# Crosshair

> A crosshair.

## Usage

```ts
import { LineCrosshair, CircleCrosshair, PolygonCrosshair } from '@antv/gui';
```

## Basic Options

| Key       | Description                        | Type                   | Default |
| --------- | ---------------------------------- | ---------------------- | ------- |
| lineStyle | config the style of crosshair line | <code>LineProps</code> | ``      |
| text      | tag                                | <code>TagCfg</code>    | ``      |

## LineCrosshair

| Key      | Description                 | Type                          | Default |
| -------- | --------------------------- | ----------------------------- | ------- |
| startPos | start pos of crosshair line | <code>[number, number]</code> | ``      |
| endPos   | end pos of crosshair line   | <code>[number, number]</code> | ``      |

## CircleCrosshair

| Key           | Description                          | Type                          | Default |
| ------------- | ------------------------------------ | ----------------------------- | ------- |
| center        | center of crosshair circle           | <code>[number, number]</code> | ``      |
| defaultRadius | the radius of first crosshair circle | <code>number</code>           | `0`     |

## PolygonCrosshair

| Key           | Description                           | Type                          | Default |
| ------------- | ------------------------------------- | ----------------------------- | ------- |
| center        | center of crosshair polygon           | <code>[number, number]</code> | ``      |
| defaultRadius | the radius of first crosshair polygon | <code>number</code>           | `0`     |
| startAngle    | start angle of polygon                | <code>number</code>           | `0`     |
| sides         | sides of polygon                      | <code>number</code>           | ``      |
