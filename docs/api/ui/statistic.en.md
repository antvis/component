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

| **Property** | **Description**      | **Type**                | **Default** |
| ------------ | -------------------- | ----------------------- | ----------- |
| title        | title of Statistic   | <code>TextOption</code> | `{}`        |
| value        | value of Statistic   | <code>TextOption</code> | `{}`        |
| spacing      | spacing of Statistic | <code>number<code>      | `5`         |

## TextOption

| **Property** | **Description**   | **Type**                              | **Default** |
| ------------ | ----------------- | ------------------------------------- | ----------- |
| text         | text              | <code>string</code>                   | `''`        |
| style        | style of text     | <code>ShapeAttrs</code>               | `{}`        |
| formatter    | formatter of text | <code>(text: string) => string <code> | `null`      |

# Statistic（Countdown）

> Countdown or current time.

## 引入

```ts
import { Countdown } from '@antv/gui';
```

## TextOption

| **Property** | **Description**   | **Type**                              | **Default** |
| ------------ | ----------------- | ------------------------------------- | ----------- |
| text         | text              | <code>string &#124; number</code>     | `''`        |
| style        | style of text     | <code>ShapeAttrs</code>               | `{}`        |
| format       | format of text    | <code> string <code>                  | `null`      |
| formatter    | formatter of text | <code>(text: string) => string <code> | `null`      |
| dynamicTime  | dynamicTime       | <code>boolean<code>                   | `false`     |

