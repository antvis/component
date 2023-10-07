import dayjs from 'dayjs';
import { Axis } from '../../../../src/ui/axis';
import { createTimeData } from '../../utils/mock-data';
import { it } from '../../utils';

export const AxisLinearTime1 = it({ width: 500, height: 350 }, (group) => {
  const formatter = ({ time, value }: any) => ({
    label: time.toLocaleString(),
    value,
    time,
  });

  const halfHour = createTimeData('2023-01-01 22:00:00', 'half-hour', 12).map(formatter);
  const hour = createTimeData('2023-01-01 22:00:00', 'hour', 12).map(formatter);
  const fourHour = createTimeData('2023-01-01 22:00:00', 'four-hour', 12).map(formatter);
  const halfDay = createTimeData('2023-01-01 06:00:00', 'half-day', 6).map(formatter);
  const day = createTimeData('2023-01-01 06:00:00', 'day', 12).map(formatter);
  const week = createTimeData('2023-01-01 06:00:00', 'week', 12).map(formatter);
  const month = createTimeData('2022-12-01 00:00:00', 'month', 12).map(formatter);
  const season = createTimeData('2022-10-01 00:00:00', 'season', 12).map(formatter);
  const year = createTimeData('2018-01-01 00:00:00', 'year', 12).map(formatter);

  const createAxis = (data: any, y: number, timeFormatter?: any) => {
    group.appendChild(
      new Axis({
        style: {
          data,
          type: 'linear',
          startPos: [5, y],
          endPos: [500, y],
          labelFormatter: ({ time }) => {
            const dayjsTime = dayjs(time);
            if (timeFormatter) return timeFormatter(dayjsTime);
            if ([0, 6, 12, 18].includes(dayjsTime.hour()) && dayjsTime.minute() === 0) {
              return dayjs(time).format('HH:mm\nYYYY-MM-DD');
            }
            return dayjs(time).format('HH:mm');
          },
          showArrow: false,
          lineLineWidth: 1,
          lineStroke: '#cacdd1',
          tickLength: 15,
          tickLineWidth: 1,
          tickStroke: '#cacdd1',
          labelTextAlign: 'left',
          labelTextBaseline: 'top',
          labelFill: '#6e6e6e',
          labelTransform: 'translate(5, -12)',
        },
      })
    );
  };
  createAxis(halfHour, 10);
  createAxis(hour, 50);
  createAxis(fourHour, 90);
  createAxis(halfDay, 130, (time: dayjs.Dayjs) => {
    // return AM/PM
    // if is AM, return date further
    if (time.hour() < 12) {
      return time.format('A\nYYYY-MM-DD');
    }
    return time.format('A');
  });
  createAxis(day, 170, (time: dayjs.Dayjs) => {
    // if is 1st, 10th, 20th day, return date further
    if ([1, 10, 20].includes(time.date())) {
      return time.format('DD\nYYYY-MM');
    }
    return time.format('DD');
  });
  createAxis(week, 210, (time: dayjs.Dayjs) => {
    // if is first week of month, return date further
    if (time.date() <= 7) {
      return time.format('DD\nYYYY-MM');
    }
    return time.format('DD');
  });
  createAxis(month, 250, (time: dayjs.Dayjs) => {
    // if is Jan or Jul, return date further
    if ([0, 6].includes(time.month())) {
      return time.format('MM月\nYYYY');
    }
    return time.format('MM月');
  });
  createAxis(season, 290, (time: dayjs.Dayjs) => {
    if ([0].includes(time.month())) {
      return time.format('MM月\nYYYY');
    }
    return time.format('MM月');
  });
  createAxis(year, 330, (time: dayjs.Dayjs) => {
    return time.format('YYYY');
  });
});
