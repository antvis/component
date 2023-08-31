import { getTimeDiff, getTimeScale, formatTime, getMask, getTimeStart } from '../../../src/util';

// const testDate = ['2021-01-11', '2021-01-12', '2021-01-12 12:13:02', '2022-01-20'];
const testDate = [
  ['2021-01-01', '2021-01-01'],
  ['2021-01-01', '2021-12-31'],
  ['2021-01-01', '2022-01-01'],
  ['2021-01-01 00:00:00', '2021-01-02 00:00:00'],
  ['2021-01-01 00:01:00', '2021-01-01 00:50:00'],
];
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

describe('time', () => {
  test('getTimeDiff', async () => {
    expect(getTimeDiff(testDate[0][0], testDate[0][1])).toBe(0);
    expect(getTimeDiff(testDate[1][0], testDate[1][1])).toBe(-day * 364);
    expect(getTimeDiff(testDate[2][0], testDate[2][1])).toBe(-day * 365);
    expect(getTimeDiff(testDate[3][0], testDate[3][1])).toBe(-day);
  });

  test('getTimeScale', async () => {
    expect(getTimeScale(testDate[0][0], testDate[0][1])).toBe('second');
    expect(getTimeScale(testDate[1][0], testDate[1][1])).toBe('month');
    expect(getTimeScale(testDate[2][0], testDate[2][1])).toBe('year');
    expect(getTimeScale(testDate[3][0], testDate[3][1])).toBe('day');
    expect(getTimeScale(testDate[4][0], testDate[4][1])).toBe('minute');
  });

  test('formatTime', async () => {
    const time = new Date('2021-08-07 12:23:34');
    expect(formatTime(time, 'YYYY')).toBe('2021');
    expect(formatTime(time, 'YYYY-MM')).toBe('2021-08');
    expect(formatTime(time, 'YYYY-MM-DD')).toBe('2021-08-07');
    expect(formatTime(time, 'YYYY-MM-DD HH:mm:ss')).toBe('2021-08-07 12:23:34');
    expect(formatTime(time, 'HH:mm:ss')).toBe('12:23:34');
  });

  test('getMask', async () => {
    expect(getMask(['year', 'day'])).toBe('YYYY-MM-DD');
    expect(getMask(['hour', 'second'])).toBe('HH:mm:ss');
    expect(getMask(['year', 'second'])).toBe('YYYY-MM-DD HH:mm:ss');
  });

  test('getTimeStart', async () => {
    const time = new Date('2021-08-07 12:23:34');
    expect(getTimeStart(time, 'year')).toBe('2021');
    expect(getTimeStart(time, 'month')).toBe('2021-08');
    expect(getTimeStart(time, 'day')).toBe('2021-08-07');
    expect(getTimeStart(time, 'hour')).toBe('2021-08-07 12');
    expect(getTimeStart(time, 'minute')).toBe('2021-08-07 12:23');
    expect(getTimeStart(time, 'second')).toBe('2021-08-07 12:23:34');
  });
});
