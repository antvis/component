import { Canvas, DisplayObject } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-svg';
import { Timeline } from '../../../../src/ui/timeline';
import { createDiv } from '../../../utils';

function getVerticalCenter(shape: DisplayObject | undefined) {
  return shape?.getBounds()?.center[1] as number;
}

const renderer = new CanvasRenderer({
  enableDirtyRectangleRenderingDebug: false,
  enableAutoRendering: true,
  enableDirtyRectangleRendering: true,
});
const div = createDiv();

const canvas = new Canvas({
  container: div,
  width: 600,
  height: 1200,
  renderer,
});

// 2022年1月的日期数据
const date = new Array(20).fill(undefined).map((_, id) => ({ date: new Date(2022, 0, id).toLocaleString('zh-CN') }));

describe('timeline layout cell', () => {
  test('left', async () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 20,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'row',
          controlButtonAlign: 'left',
        },
        cellAxisCfg: {
          backgroundStyle: {
            fill: '#FFAA22',
          },
        },
        playMode: 'increase',
        onSelectionChange: console.log,
      },
    });
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { cellAxis, speedControl, playBtn, prevBtn, nextBtn, singleTimeCheckbox } = components;
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(speedControl)).toBeCloseTo(0, 4);
    expect(getVerticalCenter(cellAxis?.cellBackground) as number).toBeCloseTo(getVerticalCenter(playBtn), 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
    expect(cellAxis?.cellBackground.style.fill).toBe('#FFAA22');
  });
  test('normal', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 100,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'row',
          controlButtonAlign: 'normal',
        },
      },
    });
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { cellAxis, speedControl, playBtn, prevBtn, nextBtn, singleTimeCheckbox } = components;
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(speedControl)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(playBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
  });
  test('right', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 200,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'row',
          controlButtonAlign: 'right',
        },
      },
    });
    timeline.setSelection([date[0].date, date[4].date]);
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { cellAxis, speedControl, prevBtn, nextBtn, singleTimeCheckbox, playBtn } = components;

    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(speedControl)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(playBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect((cellAxis?.backgroundVerticalCenter as number) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
    // @ts-ignore
    expect(timeline.timeSelection[1] as any as number).toBe(date[4].date);
    // @ts-ignore
    expect(timeline.timeSelection[0] as any as number).toBe(date[0].date);
  });
  test('normal column', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 300,
        height: 20,
        width: 500,
        data: date,
        orient: {
          layout: 'col',
          controlButtonAlign: 'normal',
        },
      },
    });
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { speedControl, playBtn, prevBtn, nextBtn, singleTimeCheckbox } = components;
    expect(getVerticalCenter(speedControl) - getVerticalCenter(playBtn)).toBeCloseTo(0, 4);
    expect(getVerticalCenter(speedControl) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect(getVerticalCenter(speedControl) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect(getVerticalCenter(speedControl) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
    expect(singleTimeCheckbox?.getBounds().max[0] as number).toBe(510);
  });
});

describe('timeline slider', () => {
  test('left', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 400,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        single: true,
        sliderAxisCfg: {
          backgroundStyle: {
            fill: '#feaafe',
          },
        },
        orient: {
          layout: 'row',
          controlButtonAlign: 'left',
        },
        onSelectionChange: console.log,
      },
    });
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { sliderAxis, speedControl, playBtn, prevBtn, nextBtn, singleTimeCheckbox } = components;
    expect(singleTimeCheckbox!.attributes!.checked).toBe(true);
    expect(sliderAxis?.sliderBackground.style.fill).toBe('#feaafe');
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(speedControl)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(playBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
  });
  test('normal', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 500,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        playMode: 'increase',
        sliderAxisCfg: {
          selection: [date[0].date, date[7].date],
        },
        orient: {
          layout: 'row',
          controlButtonAlign: 'normal',
        },
      },
    });
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { sliderAxis, speedControl, playBtn, prevBtn, nextBtn, singleTimeCheckbox } = components;
    expect(sliderAxis!.attributes!.selection[0]).toBe(date[0].date);
    expect(sliderAxis!.attributes!.selection[1]).toBe(date[7].date);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(speedControl)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(playBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
  });
  test('right', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 600,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        orient: {
          layout: 'row',
          controlButtonAlign: 'right',
        },
      },
    });
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { sliderAxis, speedControl, playBtn, prevBtn, nextBtn, singleTimeCheckbox } = components;
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(speedControl)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(playBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect((sliderAxis?.backgroundVerticalCenter as number) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
  });
  test('normal column', () => {
    const timeline = new Timeline({
      style: {
        x: 10,
        y: 700,
        height: 20,
        width: 500,
        data: date,
        type: 'slider',
        orient: {
          layout: 'col',
          controlButtonAlign: 'normal',
        },
      },
    });
    canvas.appendChild(timeline);
    const { components } = timeline;
    const { speedControl, playBtn, prevBtn, nextBtn, singleTimeCheckbox } = components;
    expect(getVerticalCenter(speedControl) - getVerticalCenter(playBtn)).toBeCloseTo(0, 4);
    expect(getVerticalCenter(speedControl) - getVerticalCenter(prevBtn)).toBeCloseTo(0, 4);
    expect(getVerticalCenter(speedControl) - getVerticalCenter(nextBtn)).toBeCloseTo(0, 4);
    expect(getVerticalCenter(speedControl) - getVerticalCenter(singleTimeCheckbox)).toBeCloseTo(0, 4);
  });
});
