import { Rect } from '@antv/g';
import {
  Backward,
  BarChart,
  Forward,
  LineChart,
  Pause,
  Play,
  Range,
  Reset,
  Value,
  PlayPause,
  SelectionType,
  ChartType,
  Split,
  SpeedSelect,
} from '../../../../src/ui/timebar/icons';
import { it } from '../../utils';

export const TimebarIcons = it((group) => {
  const icons: any[] = [
    Reset,
    Backward,
    Play,
    Forward,
    Pause,
    Range,
    Value,
    LineChart,
    BarChart,
    PlayPause,
    SelectionType,
    ChartType,
    Split,
    SpeedSelect,
  ];
  const size = [5, 10, 15, 20, 25, 40];
  const color = ['red', 'green', 'blue', 'pink'];

  const offset = 20;
  size.forEach((s, i) => {
    icons.forEach((Icon, j) => {
      group.appendChild(
        new Rect({
          style: {
            x: offset + 50 * j - s / 2,
            y: offset + 50 * i - s / 2,
            width: s,
            height: s,
            stroke: 'orange',
          },
        })
      );
      group.appendChild(
        new Icon({
          style: {
            x: offset + 50 * j,
            y: offset + 50 * i,
            size: s,
            color: color[i] || '#565758',
          },
        })
      );
    });
  });
});
