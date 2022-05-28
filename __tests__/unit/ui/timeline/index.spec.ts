import { Group, Rect } from '@antv/g';
import { Timeline } from '../../../../src/ui/timeline';
import { AxisBase } from '../../../../src/ui/timeline/playAxis';
import { SpeedControl } from '../../../../src/ui/timeline/speedControl';
import { createCanvas } from '../../../utils/render';
import { TIME_DATA, generateTimeData } from './data';

const canvas = createCanvas(750, undefined, true);
const rectStyle = { width: 400, height: 50, stroke: '#d9d9d9', lineWidth: 1 };

describe('Timeline', () => {
  it('new Timeline({...}) returns a slider timeline by default.', () => {
    const timeline = new Timeline({
      style: {
        x: 20,
        y: 20,
        width: 490,
        data: TIME_DATA,
        padding: [10, 0, 10, 10],
        playAxis: {
          appendPadding: [0, 0, 6],
        },
        controlButton: {
          spacing: 4,
          prevBtn: { size: 10 },
          playBtn: { size: 20, margin: 0 },
          nextBtn: { size: 10 },
        },
      },
    });
    canvas.appendChild(timeline);
    const container = timeline.querySelector('.container') as Group;
    expect(container.childNodes.length).toBe(6);
    expect(container.getPosition()[0]).toBe(30);
    expect(container.getPosition()[1]).toBe(30);
    const axis = container.querySelector('.timeline-axis')! as any;
    expect(axis.style.length).toBe(480);
    const speedControl = container.querySelector('.timeline-speed-control')!;
    const singleControl = container.querySelector('.timeline-single-control')!;
    expect(singleControl.style.x + singleControl.style.width).toBe(480);
    expect(speedControl.style.x + speedControl.style.width).toBe(singleControl.style.x - 8 /** 8px spacing fixed. */);
    const playButton = container.querySelector('.timeline-play-btn')! as any;
    const prevButton = container.querySelector('.timeline-prev-btn')!;
    const nextButton = container.querySelector('.timeline-next-btn')!;
    expect(playButton.style.x).toBe(480 / 2);
    expect(prevButton.style.x).toBe(480 / 2 - 15 - 4);
    expect(nextButton.style.x).toBe(480 / 2 + 15 + 4);
  });

  it('new Timeline({...}) returns a cell timeline.', () => {
    const timeline = new Timeline({
      style: {
        x: 20,
        y: 110,
        width: 490,
        data: TIME_DATA,
        type: 'cell',
        padding: [10, 0, 10, 10],
        playAxis: {
          appendPadding: [0, 0, 6],
        },
        controlButton: {
          spacing: 4,
          prevBtn: { size: 10 },
          playBtn: { size: 20 },
          nextBtn: { size: 10 },
        },
      },
    });
    canvas.appendChild(timeline);
    const container = timeline.querySelector('.container') as Group;
    expect(container.childNodes.length).toBe(6);
    expect(container.getPosition()[0]).toBe(30);
    expect(container.getPosition()[1]).toBe(120);
    expect(container.querySelector('.timeline-axis')!.style.length).toBe(480);
    const speedControl = container.querySelector('.timeline-speed-control')!;
    const singleControl = container.querySelector('.timeline-single-control')!;
    expect(singleControl.style.x + singleControl.style.width).toBe(480);
    expect(speedControl.style.x + speedControl.style.width).toBe(singleControl.style.x - 8 /** 8px spacing fixed. */);
    const playButton = container.querySelector('.timeline-play-btn')!;
    const prevButton = container.querySelector('.timeline-prev-btn')!;
    const nextButton = container.querySelector('.timeline-next-btn')!;
    expect(playButton.style.x).toBe(480 / 2);
    expect(prevButton.style.x).toBe(480 / 2 - 15 - 4);
    expect(nextButton.style.x).toBe(480 / 2 + 15 + 4);
  });

  it('new Timeline({...}) returns a slider timeline with controlButton in other position.', () => {
    const timeline = new Timeline({
      style: {
        x: 20,
        y: 210,
        width: 490,
        data: TIME_DATA,
        padding: [10, 0, 10, 10],
        playAxis: {
          size: 4,
          appendPadding: [0, 20, 6, 12],
          label: {
            position: -1,
          },
        },
        controlPosition: 'left',
        controlButton: {
          spacing: 5,
          prevBtn: { size: 12 },
          playBtn: { size: 20 },
          nextBtn: { size: 12 },
        },
        speedControl: {
          markerSize: 3,
        },
      },
    });
    canvas.appendChild(timeline);

    const container = timeline.querySelector('.container') as Group;
    const axis = container.querySelector('.timeline-axis')! as any;
    const playButton = container.querySelector('.timeline-play-btn')!;
    const prevButton = container.querySelector('.timeline-prev-btn')!;
    const nextButton = container.querySelector('.timeline-next-btn')!;
    expect(container.getLocalPosition()[0]).toBe(10);
    expect(prevButton.style.x).toBe(6);
    expect(playButton.style.x).toBe(27);
    expect(nextButton.style.x).toBe(48);
    expect(axis.style.x).toBe(12 + 5 + 20 + 5 + 12 + 12);
    expect(axis.getPosition()[0]).toBe(20 + 10 + axis.style.x);
    const speedControl = container.querySelector('.timeline-speed-control')!;
    expect(speedControl.style.y).toBe(axis.style.y - 3 * 2 * 2 - 3 * 0.5 /** speedControlMarkerSize*0.5 */);

    timeline.update({ playAxis: { label: { position: 1 } } });
    expect(speedControl.style.y).toBe(axis.style.y + 3 * 0.5 /** speedControlMarkerSize*0.5 */);
    expect(prevButton.style.x).toBe(6);
    expect(playButton.style.x).toBe(27);
    expect(nextButton.style.x).toBe(48);
    expect(prevButton.style.y).toBe(2 /** playAxis.size * 0.5 */);
    expect(playButton.style.y).toBe(2);
    expect(nextButton.style.y).toBe(2);

    expect(axis.style.x).toBe(12 + 5 + 20 + 5 + 12 + 12);
    expect(axis.getPosition()[0]).toBe(20 + 10 + axis.style.x);
  });

  it('new Timeline({...}) returns a timeline could adjust speed', () => {
    const timeline = new Timeline({ style: { data: TIME_DATA, playInterval: 3000 } });
    canvas.appendChild(timeline);
    const axis = timeline.querySelector('.timeline-axis')! as AxisBase;
    const speedControl = timeline.querySelector('.timeline-speed-control')! as SpeedControl;
    speedControl.emit('speedChanged', { speed: 3 });
    // @ts-ignore
    expect(timeline.speed).toBe(3);
    expect(axis.style.playInterval).toBe(1000);

    timeline.destroy();
  });

  it('new Timeline({...}) returns a timeline could control play.', async () => {
    const timeline = new Timeline({ style: { data: TIME_DATA, playInterval: 10, autoPlay: true, selection: [0, 2] } });
    canvas.appendChild(timeline);
    const axis = timeline.querySelector('.timeline-axis')! as AxisBase;

    const playButton = timeline.querySelector('.timeline-play-btn')!;
    playButton.emit('pointerdown', {});
    // @ts-ignore
    expect(timeline.playing).toBe(false);
    expect(playButton.style.symbol).toBe('timeline-stop-button');
    playButton.emit('pointerdown', {});
    // @ts-ignore
    expect(timeline.playing).toBe(true);
    expect(playButton.style.symbol).toBe('timeline-play-button');

    axis.addEventListener('timelineStopped', (evt: any) => {
      expect(evt.detail.selection).toEqual([7, 9]);
      axis.update({ selection: [0, 0], singleMode: true });
      const nextButton = timeline.querySelector('.timeline-next-btn')! as any;
      const prevButton = timeline.querySelector('.timeline-prev-btn')! as any;
      nextButton.emit('pointerdown', {});
      expect(axis.getSelection()).toEqual([1, 1]);
      nextButton.emit('pointerdown', {});
      expect(axis.getSelection()).toEqual([2, 2]);
      prevButton.emit('pointerdown', {});
      expect(axis.getSelection()).toEqual([1, 1]);

      timeline.destroy();
    });
  });

  it('new Timeline({...}) returns a timeline could switch mode', () => {
    const timeline = new Timeline({ style: { data: TIME_DATA, playInterval: 10, selection: [0, 2] } });
    canvas.appendChild(timeline);
    const axis = timeline.querySelector('.timeline-axis')! as AxisBase;

    expect(axis.getSelection()).toEqual([0, 2]);
    timeline.emit('singleModeChanged', { active: true });
    // @ts-ignore
    expect(timeline.singleMode).toBe(true);
    expect(axis.getSelection()).toEqual([0, 0]);

    timeline.destroy();
  });

  it('new Timeline({...}) returns a timeline could close controls', () => {
    const timeline = new Timeline({ style: { data: TIME_DATA, controlButton: null } });
    canvas.appendChild(timeline);

    const container = timeline.querySelector('.container') as Group;
    expect(container.childNodes.length).toBe(3);

    timeline.update({ controlButton: { playBtn: null } });
    expect(container.childNodes.length).toBe(5);

    timeline.update({ speedControl: null, singleModeControl: null });
    expect(container.childNodes.length).toBe(3);

    timeline.destroy();
  });

  it('new Timeline({...})', () => {
    canvas.appendChild(new Rect({ style: { ...rectStyle, x: 30, y: 270, height: 44 } })).appendChild(
      new Timeline({
        style: {
          width: 400,
          height: 40,
          data: generateTimeData(20),
          type: 'cell',
          selection: [0, 2],
          controlPosition: 'left',
          controlButton: {
            spacing: 6,
            playBtn: { size: 16 },
          },
          padding: [2, 4],
          playAxis: {
            appendPadding: [0, 8],
            label: { position: -1 },
            // loop: true,
            playMode: 'increase',
          },
        },
      })
    );
  });

  it('new Timeline({...})', () => {
    canvas.appendChild(new Rect({ style: { ...rectStyle, x: 30, y: 330, height: 36 } })).appendChild(
      new Timeline({
        style: {
          width: 400,
          height: 40,
          data: generateTimeData(20),
          selection: [0, 2],
          padding: [4],
          playAxis: {
            appendPadding: [0, 16, 0, 8],
            label: { position: -1 },
            // loop: true,
            playMode: 'increase',
          },
          controlPosition: 'left',
          controlButton: {
            spacing: 6,
            playBtn: { size: 16 },
          },
          autoPlay: true,
        },
      })
    );
  });

  it('new Timeline({...})', () => {
    canvas.appendChild(new Rect({ style: { ...rectStyle, x: 30, y: 390 } })).appendChild(
      new Timeline({
        style: {
          width: 400,
          height: 40,
          data: generateTimeData(20),
          selection: [0, 2],
          padding: [4, 4, 4, 16],
          controlPosition: 'right',
          controlButton: {
            spacing: 6,
            playBtn: { size: 16 },
          },
          singleMode: true,
          playAxis: {
            appendPadding: [4, 8, 4, 0],
            label: { position: -1 },
          },
        },
      })
    );
  });

  it('new Timeline({...})', () => {
    canvas.appendChild(new Rect({ style: { ...rectStyle, height: 400, width: 80, x: 540, y: 30 } })).appendChild(
      new Timeline({
        style: {
          x: 14,
          orient: 'vertical',
          width: 40,
          height: 400,
          data: generateTimeData(20),
          type: 'cell',
          selection: [0, 2],
          controlPosition: 'left',
          padding: [4, 0],
          // singleModeControl: null,
          speedControl: null,
          autoPlay: true,
          controlButton: {
            spacing: 4,
            playBtn: { size: 16 },
          },
          playAxis: {
            appendPadding: [2, 0],
            label: { position: -1 },
            // loop: true,
            playMode: 'increase',
          },
        },
      })
    );
  });
});
