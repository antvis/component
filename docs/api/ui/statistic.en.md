---
title: Statistic
order: 4
---

# Statistic

> Indicator card Displays statistical data.

## Usage

```ts
import { Statistic } from '@antv/gui';
```

## StatisticOptions

| **Property** | **Description**              | **Type**             | **Default** |
| ------------ | ---------------------------- | -------------------- | ----------- |
| x            | Starting point x             | <code>number</code>  | `-`         |
| y            | Starting point y             | <code>number</code>  | `-`         |
| title        | title                        | <code>TextCfg</code> | `{}`        |
| value        | value                        | <code>TextCfg</code> | `{}`        |
| spacing      | Distance between up and down | <code>number<code>   | `5`         |

## TextCfg

| **Property** | **Description**  | **Type**                                             | **Default** |
| ------------ | ---------------- | ---------------------------------------------------- | ----------- |
| x            | Starting point x | <code>number</code>                                  | `-`         |
| y            | Starting point y | <code>number</code>                                  | `-`         |
| text         | text             | <code>string &#124; number</code>                    | `''`        |
| style        | text style       | <code>{default: RectProps, active: RectProps}</code> | `{}`        |
| marker       | icon             | <code>Marker</code>                                  | `null`      |
| spacing      | Graphic spacing  | <code>number<code>                                   | `4`         |

# Statistic（Countdown）

> Countdown or current time.

## import

```ts
import { Countdown } from '@antv/gui';
```

## Timer configuration item (the configuration is inherited from the indicator card)

| **Property** | **Description**                     | **Type**              | **Default** |
| ------------ | ----------------------------------- | --------------------- | ----------- |
| value        | The countdown option                | <code>TextCfg</code>  | `{}`        |
| onFinish     | The reverse meter ends the callback | <code>callBack</code> | `() => {}`  |

## TextCfg

| **Property** | **Description**     | **Type**             | **Default** |
| ------------ | ------------------- | -------------------- | ----------- |
| format       | Formatting time     | <code> string <code> | `null`      |
| timestamp    | Countdown timestamp | <code> number <code> | `30s`       |
