import { measureTextWidth, getEllipsisText } from '../../../src';

const FONT_STYLE = { fontSize: 10, fontFamily: 'serif' };

const NEW_FONT_STYLE = { ...FONT_STYLE, fontSize: 20 };

describe('text', () => {
  test('measureTextWidth', async () => {
    expect(measureTextWidth('test text', FONT_STYLE)).toBeCloseTo(32, -1);
    expect(measureTextWidth('test text test text', FONT_STYLE)).toBeCloseTo(67, -1);
    expect(measureTextWidth('汉字', FONT_STYLE)).toBeCloseTo(20, -1);
    expect(measureTextWidth('汉字测试文本', FONT_STYLE)).toBeCloseTo(60, -1);
  });

  test('new font measure', () => {
    expect(measureTextWidth('test text', NEW_FONT_STYLE)).toBeCloseTo(64.5, -1);
    expect(measureTextWidth('test text test text', NEW_FONT_STYLE)).toBeCloseTo(134, -1);
    expect(measureTextWidth('汉字', NEW_FONT_STYLE)).toBeCloseTo(40, -1);
    expect(measureTextWidth('汉字测试文本', NEW_FONT_STYLE)).toBeCloseTo(120, -1);
  });

  test('getEllipsisText', async () => {
    const testText = 'test text test text';
    const han = '汉字测试文本';

    expect(getEllipsisText(testText, 20, FONT_STYLE)).toBe('tes...');
    expect(getEllipsisText(testText, 40, FONT_STYLE)).toBe('test text...');
    expect(getEllipsisText(testText, 60, FONT_STYLE)).toBe('test text test t...');
    expect(getEllipsisText(testText, 120, FONT_STYLE)).toBe('test text test text');

    expect(getEllipsisText(han, 20, FONT_STYLE)).toBe('汉...');
    expect(getEllipsisText(han, 40, FONT_STYLE)).toBe('汉字测...');
    expect(getEllipsisText(han, 60, FONT_STYLE)).toBe('汉字测试文本');
    expect(getEllipsisText(han, 120, FONT_STYLE)).toBe('汉字测试文本');

    expect(getEllipsisText(han, 19, FONT_STYLE)).toBe('汉...');
    expect(getEllipsisText(han, 39, FONT_STYLE)).toBe('汉字测...');
    expect(getEllipsisText(han, 59, FONT_STYLE)).toBe('汉字测试文...');
    expect(getEllipsisText(han, 120, FONT_STYLE)).toBe('汉字测试文本');
  });

  test('new font ellipsis', async () => {
    const testText = 'test text test text';
    const han = '汉字测试文本';

    expect(getEllipsisText(testText, 20, NEW_FONT_STYLE)).toBe('...');
    expect(getEllipsisText(testText, 40, NEW_FONT_STYLE)).toBe('tes...');
    expect(getEllipsisText(testText, 60, NEW_FONT_STYLE)).toBe('test t...');
    expect(getEllipsisText(testText, 120, NEW_FONT_STYLE)).toBe('test text test t...');

    expect(getEllipsisText(han, 20, NEW_FONT_STYLE)).toBe('...');
    expect(getEllipsisText(han, 40, NEW_FONT_STYLE)).toBe('汉...');
    expect(getEllipsisText(han, 60, NEW_FONT_STYLE)).toBe('汉字...');
    expect(getEllipsisText(han, 120, NEW_FONT_STYLE)).toBe('汉字测试文本');

    expect(getEllipsisText(han, 19, NEW_FONT_STYLE)).toBe('...');
    expect(getEllipsisText(han, 39, NEW_FONT_STYLE)).toBe('汉...');
    expect(getEllipsisText(han, 59, NEW_FONT_STYLE)).toBe('汉字...');
    expect(getEllipsisText(han, 120, NEW_FONT_STYLE)).toBe('汉字测试文本');
  });
});
