时间条

## 引入

```ts
import { Timebar } from '@antv/gui';
```

## 配置项

| **属性名**            | **类型**                                                       | **描述**                       | **默认值** |
| --------------------- | -------------------------------------------------------------- | ------------------------------ | ---------- |
| type                  | `time`\|`chart`                                                | 时间条类型：时间模式、图表模式 | `time`     |
| playMode              | `acc`\|`slide`                                                 | 播放模式：累计、滑动窗口       | `acc`      |
| values                | `number`\|`number[]`                                           | 选区值                         | `-`        |
| data                  | `{time:number\|Date;value:number}[]`                           | 数据                           | `[]`       |
| labelFormatter        | `(time: number\|Date)=>string`                                 | 时间自定义格式化               | `-`        |
| loop                  | `boolean`                                                      | 启用轮博                       | `false`    |
| speed                 | `number`                                                       | 播放速度                       | `1`        |
| state                 | `play`\|`pause`                                                | 播放状态                       | `pause`    |
| selectionType         | `range`\|`value`                                               | 选区类型                       | `range`    |
| chartType             | `line`\|`column`                                               | 图表类型                       | `line`     |
| onChange              | (values: number\|[number, number]\|Date\|[Date, Date]) => void | 值变化回调                     | `-`        |
| onReset               | `()=>void`                                                     | 重置回调                       | `-`        |
| onSpeedChange         | `(speed:number)=>void`                                         | 速度变化回调                   | `-`        |
| onPlay                | `()=>void`                                                     | 播放回调                       | `-`        |
| onPause               | `()=>void`                                                     | 暂停回调                       | `-`        |
| onBackward            | `()=>void`                                                     | 快退回调                       | `-`        |
| onForward             | `()=>void`                                                     | 快进回调                       | `-`        |
| onSelectionTypeChange | `(type: 'range'\|'value')=>void`                               | 选区类型变化回调               | `-`        |
| onChartTypeChange     | `(type: 'line'\|'column')=>void`                               | 图表类型变化回调               | `-`        |
| `chart{Style}`        | `SliderStyleProps`                                             | 上方时间轴区域配置             | `-`        |
| `axis{Style}`         | `LinearAxisStyleProps`                                         | 坐标轴配置                     | `-`        |
| `controller{Style}`   | `ControllerStyleProps`                                         | 控制器配置                     | `-`        |

### 控制器配置

| **属性名**          | **类型**                  | **描述**                   | **默认值** |
| ------------------- | ------------------------- | -------------------------- | ---------- |
| padding             | `number`\|`number[]`      | 内边距                     | `0`        |
| align               | `left`\|`center`\|`right` | 对齐位置                   | `center`   |
| iconSize            | `number`                  | 功能图标尺寸               | `25`       |
| iconSpacing         | `number`                  | 功能图标之间的间距         | `0`        |
| functions           | `Functions[][]`           | 启用功能，通过 [] 进行分组 |            |
| `background{Style}` | `BaseStyleProps`          | 背景样式                   | `-`        |

```ts
type Functions = 'reset' | 'speed' | 'backward' | 'playPause' | 'forward' | 'selectionType' | 'chartType';
```

## API

| **方法** | **说明** | **参数** |
| -------- | -------- | -------- |
| reset    | 重置     | `-`      |
| play     | 播放     | `-`      |
| pause    | 暂停     | `-`      |
| backward | 快退     | `-`      |
| forward  | 前进     | `-`      |
