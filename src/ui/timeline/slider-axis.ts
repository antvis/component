import { Circle, Rect, RectStyleProps, CustomEvent, Animation } from '@antv/g';
import { clamp, deepMix, isFunction } from '@antv/util';
import { GUIOption } from 'types';
import { GUI } from '../../core/gui';
import { Linear as Ticks } from '../axis/linear';
import { SliderAxisCfg, SliderAxisOptions, TimeData } from './types';
import { createTickData } from './util';
import { Poptip } from '../poptip';

export class SliderAxis extends GUI<Required<SliderAxisCfg>> {
  public static tag = 'slideraxis';

  public static defaultOptions: GUIOption<Omit<SliderAxisCfg, 'selection'>> = {
    type: SliderAxis.tag,
    style: {
      dataPerStep: 1,
      duration: 200,
      delay: 800,
      x: 0,
      y: 0,
      length: 100,
      timeData: [],
      single: false,
      tickCfg: {
        verticalFactor: -1,
        axisLine: undefined,
        label: {
          autoRotate: false,
          rotation: 0,
          autoEllipsis: true,
          tickPadding: 15,
          alignTick: true,
          style: {
            fontSize: 10,
            fill: 'rgba(0,0,0,0.45)',
          },
        },
        tickLine: {
          len: 4,
          style: {
            stroke: 'rgba(0,0,0,0.25)',
            lineWidth: 1,
          },
        },
      },
      handleStyle: {
        r: 6,
        stroke: '#BFBFBF',
        lineWidth: 1,
        fill: '#f7f7f7',
        cursor: 'ew-resize',
      },
      backgroundStyle: {
        height: 8,
        radius: 4,
        fill: 'rgba(65, 97, 128, 0.05)',
      },
      selectionStyle: {
        height: 8,
        fill: 'rgba(52, 113, 249, 0.75)',
      },
    },
  };

  private timeIndexMap = new Map<TimeData['date'], number>();

  private minLength: number = 0;

  private backgroundShape!: Rect;

  private selectionShape!: Rect;

  private startHandleShape: Circle | undefined;

  private endHandleShape: Circle | undefined;

  private ticks: Ticks | undefined;

  private poptip: Poptip | undefined;

  public animation: Animation | null | undefined;

  private timer: number | undefined;

  public played: boolean = false;

  private cachedSelection: SliderAxisCfg['selection'];

  public get axisTimeIndexMap() {
    return this.timeIndexMap;
  }

  public get backgroundVerticalCenter() {
    return this.backgroundShape.getBounds()?.center[1] as number;
  }

  public get sliderBackground() {
    return this.backgroundShape as Rect;
  }

  public get sliderTicks() {
    return this.ticks as Ticks;
  }

  public get sliderSelection() {
    return this.selectionShape as Rect;
  }

  public get sliderStartHandle() {
    return this.startHandleShape;
  }

  public get sliderEndHandle() {
    return this.endHandleShape;
  }

  constructor(options: SliderAxisOptions) {
    super(deepMix({}, SliderAxis.defaultOptions, options));
    this.init();
  }

  public init(): void {
    this.initSelection();
    this.initMinLength();
    this.initTimeIndexMap();
    this.createTicks();
    this.createBackground();
    this.createSelection();
    this.bindEvents();
  }

  public update(cfg: Partial<Required<SliderAxisCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.clear();
    this.cachedSelection = this.attributes.selection;
    this.initTimeIndexMap();
    this.initMinLength();
    this.createTicks();
    this.createBackground();
    this.createSelection();
    this.bindEvents();
  }

  public clear(): void {
    this.removeChildren();
    this.removeAllEventListeners();
  }

  private initSelection() {
    const { selection, timeData, single } = this.attributes;
    if (selection === undefined) {
      single
        ? this.setAttribute('selection', [timeData[0].date])
        : this.setAttribute('selection', [timeData[0].date, timeData[timeData.length - 1].date]);
    }
    this.cachedSelection = this.attributes.selection;
  }

  private initMinLength() {
    const { length, timeData } = this.attributes;
    this.minLength = length / (timeData.length - 1);
  }

  public increase(distance: number) {
    const { single, timeData, selection, onSelectionChange } = this.attributes;
    if (single || selection.length !== 2) return;
    const currStartIdx = this.timeIndexMap.get(selection[0]) as number;
    const endIdx = this.timeIndexMap.get(selection[1] as string) as number;
    const newEndIdx = endIdx + distance;
    if (newEndIdx >= timeData.length) {
      const replay = new CustomEvent('replay');
      this.dispatchEvent(replay);
      return;
    }
    if (newEndIdx <= currStartIdx) return;
    this.update({ selection: [selection[0], timeData[newEndIdx].date] });
    isFunction(onSelectionChange) && onSelectionChange([selection[0], timeData[newEndIdx].date]);
  }

  // 动画，向后增长一步
  public increaseStepWithAnimation() {
    const { single, timeData, selection, onSelectionChange, dataPerStep, duration, length, backgroundStyle } =
      this.attributes;
    if (single || selection.length !== 2) {
      console.error('单一时间不支持increase播放模式');
      return;
    }
    const currStartIdx = this.timeIndexMap.get(selection[0]) as number;
    const endIdx = this.timeIndexMap.get(selection[1] as string) as number;
    const newEndIdx = endIdx + dataPerStep;
    if (newEndIdx >= timeData.length) {
      const replay = new CustomEvent('replay');
      this.dispatchEvent(replay);
      return;
    }
    if (newEndIdx <= currStartIdx) return;
    let stepLength = (dataPerStep / (timeData.length - 1)) * this.actualLength;
    const endHandleX = (this.endHandleShape?.attributes.x as number) + (this.selectionShape.attributes.x as number);
    if (endHandleX + stepLength > length - (backgroundStyle.radius as number)) {
      stepLength = -endHandleX + length - (backgroundStyle.radius as number);
    }
    this.animation = this.selectionShape.animate(
      [
        { width: this.selectionShape.attributes.width },
        { width: (this.selectionShape.attributes.width as number) + stepLength },
      ],
      {
        duration,
        fill: 'forwards',
      }
    );
    if (this.animation) {
      this.animation.onframe = () => {
        this.endHandleShape?.attr({ x: this.selectionShape.parsedStyle.width.value as number });
      };
      this.animation.onfinish = () => {
        const newSelection = this.calculateSelection() as [string, string];
        this.endHandleShape?.attr({ x: this.selectionShape.parsedStyle.width.value as number });
        this.attr({ selection: newSelection });
        isFunction(onSelectionChange) && onSelectionChange([selection[0], timeData[newEndIdx].date]);
      };
    }
  }

  private calculateSelection() {
    const { timeData, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const newSelection = new Array(2).fill(undefined);
    const startHandleX = (this.selectionShape.getAttribute('x') as number) - radius; // 相对背景的x坐标
    const endHandleX = startHandleX + (this.selectionShape.getAttribute('width') as number);

    let nearestTimeDataId = Math.round((startHandleX / this.actualLength) * (timeData.length - 1));
    nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
    newSelection[0] = timeData[nearestTimeDataId].date;
    nearestTimeDataId = Math.round((endHandleX / this.actualLength) * (timeData.length - 1));
    nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
    newSelection[1] = timeData[nearestTimeDataId].date;
    return newSelection;
  }

  private get actualLength() {
    const { length, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    return length - radius * 2;
  }

  public cancelAnimation() {
    if (this.animation) {
      this.animation.cancel();
    }
  }

  // private getCurrentTime() {
  //   const { timeData } = this.attributes;
  //   const selectionShapeX = this.selectionShape.attributes.x as number;

  //   const prevIndex = Math.floor((selectionShapeX / this.actualLength) * (timeData.length - 1));
  //   const prevX = (prevIndex / (timeData.length - 1)) * this.actualLength;
  //   const nextIndex = prevIndex + 1;
  //   const nextX = (nextIndex / (timeData.length - 1)) * this.actualLength;
  //   const prevT = this.idxCurrentTimeMap.get(prevIndex) as number;
  //   const nextT = this.idxCurrentTimeMap.get(nextIndex) as number;

  //   const t = prevT + ((nextT - prevT) / (nextX - prevX)) * (selectionShapeX - prevX);
  //   return t;
  // }

  public moveDistance(distance: number) {
    const { single, timeData, selection, onSelectionChange, duration } = this.attributes;
    if (single) {
      const idx = this.timeIndexMap.get(selection[0]);
      if (idx === undefined) return;
      const nextDataIdx = idx + distance;
      if (nextDataIdx >= timeData.length) {
        const replay = new CustomEvent('replay');
        this.dispatchEvent(replay);
        return;
      }
      if (nextDataIdx < 0) return;
      const nextX = (nextDataIdx / (timeData.length - 1)) * this.actualLength;
      const startX = this.selectionShape.attributes.x as number;
      this.animation = this.selectionShape.animate(
        [{ transform: `translate(${0}px,0px)` }, { transform: `translate(${nextX - startX}px,0px)` }],
        {
          duration,
          fill: 'forwards',
        }
      ) as any as Animation;
      this.animation.onfinish = () => {
        this.attr({ selection: [timeData[nextDataIdx].date] });
        isFunction(onSelectionChange) && onSelectionChange([timeData[nextDataIdx].date]);
      };
    } else {
      const startIdx = this.timeIndexMap.get(selection[0]);
      const endIdx = this.timeIndexMap.get(selection[1] as string);
      if (startIdx === undefined || endIdx === undefined) return;
      const newEndIdx = endIdx + distance;
      if (newEndIdx >= timeData.length) {
        const replay = new CustomEvent('replay');
        this.dispatchEvent(replay);
        return;
      }
      const newStartIdx = startIdx + distance;
      if (newStartIdx < 0) return;
      this.update({ selection: [timeData[newStartIdx].date, timeData[newEndIdx].date] });
      isFunction(onSelectionChange) && onSelectionChange([timeData[newStartIdx].date, timeData[newEndIdx].date]);
    }
  }

  // 动画，向后移动一步
  public moveStep() {
    const { single, timeData, selection, onSelectionChange, dataPerStep, duration, length, backgroundStyle } =
      this.attributes;
    if (single) {
      const idx = this.timeIndexMap.get(selection[0]);
      if (idx === undefined) return;
      const nextDataIdx = idx + dataPerStep;
      if (nextDataIdx >= timeData.length) {
        const replay = new CustomEvent('replay');
        this.dispatchEvent(replay);
        return;
      }
      if (nextDataIdx < 0) return;
      const nextX = (nextDataIdx / (timeData.length - 1)) * this.actualLength;
      const startX = this.selectionShape.attributes.x as number;
      this.animation = this.selectionShape.animate(
        [{ transform: `translate(${0}px,0px)` }, { transform: `translate(${nextX - startX}px,0px)` }],
        {
          duration,
          fill: 'forwards',
        }
      ) as any as Animation;
      this.animation.onfinish = () => {
        this.attr({ selection: [timeData[nextDataIdx].date] });
        isFunction(onSelectionChange) && onSelectionChange([timeData[nextDataIdx].date]);
      };
    } else {
      const startIdx = this.timeIndexMap.get(selection[0]);
      const endIdx = this.timeIndexMap.get(selection[1] as string);
      if (startIdx === undefined || endIdx === undefined) return;
      const newEndIdx = endIdx + dataPerStep;
      if (newEndIdx >= timeData.length) {
        const replay = new CustomEvent('replay');
        this.dispatchEvent(replay);
        return;
      }
      const newStartIdx = startIdx + dataPerStep;
      if (newStartIdx < 0) return;
      let stepLength = (dataPerStep / (timeData.length - 1)) * this.actualLength;
      const endHandleX = (this.endHandleShape?.attributes.x as number) + (this.selectionShape.attributes.x as number);
      if (endHandleX + stepLength > length - (backgroundStyle.radius as number)) {
        stepLength = -endHandleX + length - (backgroundStyle.radius as number);
      }
      this.animation = this.selectionShape.animate(
        [{ transform: `translate(${0}px,0px)` }, { transform: `translate(${stepLength}px,0px)` }],
        {
          duration,
          fill: 'forwards',
        }
      ) as any as Animation;
      this.animation.onfinish = () => {
        this.attr({ selection: [timeData[newStartIdx].date, timeData[newEndIdx].date] });
        isFunction(onSelectionChange) && onSelectionChange([timeData[newStartIdx].date, timeData[newEndIdx].date]);
      };
    }
  }

  public play() {
    if (this.timer) {
      clearInterval(this.timer);
      this.animation?.cancel();
    }
    const { playMode, duration, delay } = this.attributes;
    this.played = true;
    this.update({ selection: this.attributes.selection });
    if (playMode === 'fixed') {
      this.timer = window.setInterval(() => {
        this.moveStep();
      }, delay + duration);
    } else {
      this.timer = window.setInterval(() => {
        this.increaseStepWithAnimation();
      }, delay + duration);
    }
  }

  public stop() {
    window.clearInterval(this.timer);
    // if (this.animation) this.animation.cancel();
  }

  // 计算hover时的最近邻刻度
  private getNearestIdx(canvasX: number) {
    const { timeData, backgroundStyle } = this.attributes;
    const { x } = this.attributes;
    const localX = canvasX - x - (backgroundStyle.radius as number);
    const nearsetIdx = Math.round((localX / this.actualLength) * (timeData.length - 1));
    return clamp(nearsetIdx, 0, timeData.length - 1);
  }

  private bindEvents() {
    this.addEventListener('replay', () => {
      if (!this.attributes.loop) return;
      if (this.cachedSelection) this.update({ selection: this.cachedSelection });
    });

    this.poptip = new Poptip({
      style: {
        id: 'slider-poptip',
        containerClassName: 'poptip-domStyles',
        domStyles: {
          '.poptip-domStyles': {
            'font-size': '8px',
          },
        },
      },
    });

    const { selection, backgroundStyle, length, timeData, single, onSelectionChange } = this.attributes;
    this.poptip.bind(this.backgroundShape, (e) => {
      return {
        position: 'top',
        offset: [0, -5],
        html: `${timeData[this.getNearestIdx(e.canvasX)].date}`,
      };
    });
    if (single && Array.isArray(selection) && selection.length === 1) {
      let selectionDragging = false;
      let lastPosition: number; // 保存上次的位置
      const newSelection: [string] = selection as [string]; // 变化的选中时间
      const onSelectionDragStart = (event: any) => {
        event.stopPropagation();
        this.stop();
        selectionDragging = true;
        lastPosition = event.canvasX;
      };
      const onDragMove = (event: any) => {
        event.stopPropagation();
        if (selectionDragging) {
          const offset = event.canvasX - lastPosition;
          let newX = (this.selectionShape.getAttribute('x') as number) + offset;
          newX = clamp(newX, 0, this.actualLength);
          this.selectionShape.attr({
            x: newX,
          });
          const selectionX = this.selectionShape.attributes.x as number; // 相对背景的x坐标
          const nearestTimeDataId = Math.round((selectionX / this.actualLength) * (timeData.length - 1));
          newSelection[0] = timeData[nearestTimeDataId].date;
          lastPosition = event.x;
          this.attr({ selection: newSelection });
          isFunction(onSelectionChange) && onSelectionChange(newSelection);
        }
      };
      const onDragEnd = () => {
        if (selectionDragging && this.played) {
          this.cachedSelection = newSelection;
          this.play();
          selectionDragging = false;
          this.attr({ selection: newSelection });
        }
      };
      this.selectionShape.addEventListener('mousedown', onSelectionDragStart);
      this.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('mouseleave', onDragEnd);
    } else if (!single && Array.isArray(selection) && selection.length === 2) {
      const radius = backgroundStyle.radius as number;
      let startHandleDragging = false; // startHandle拖拽状态
      let endHandleDragging = false;
      let selectionDragging = false;
      let lastPosition: number; // 保存上次的位置
      let maxLength = Infinity; //  蓝轴最长长度
      const newSelection: [string, string] = selection as [string, string]; // 变化的时间范围
      const onStartHandleDragStart = (event: any) => {
        // const axisDraggingEvent = new CustomEvent('dragging', { dragging: true });
        // this.dispatchEvent(axisDraggingEvent);
        event.stopPropagation();
        this.stop();
        startHandleDragging = true;
        lastPosition = event.canvasX;
        maxLength =
          (this.selectionShape.getAttribute('x') as number) + (this.selectionShape.getAttribute('width') as number);
      };
      const onEndHandleDragStart = (event: any) => {
        // const axisDraggingEvent = new CustomEvent('dragging', { dragging: true });
        // this.dispatchEvent(axisDraggingEvent);
        event.stopPropagation();
        this.stop();
        endHandleDragging = true;
        lastPosition = event.canvasX;
        maxLength = -(this.selectionShape.getAttribute('x') as number) + length;
      };
      const onSelectionDragStart = (event: any) => {
        // const axisDraggingEvent = new CustomEvent('dragging', { dragging: true });
        // this.dispatchEvent(axisDraggingEvent);
        event.stopPropagation();
        this.stop();
        selectionDragging = true;
        lastPosition = event.canvasX;
      };
      const onDragMove = (event: any) => {
        event.stopPropagation();
        if (startHandleDragging && !this.played) {
          const offset = event.canvasX - lastPosition;
          const newLength = (this.selectionShape.getAttribute('width') as number) - offset;
          const newX = (this.selectionShape.getAttribute('x') as number) + offset;
          if (newLength > this.minLength && newLength < maxLength && newX >= radius) {
            // TODO 拖拽性能卡顿
            // this.startHandleShape.attr({ x: (this.startHandleShape.getAttribute('x') as number) + offset });
            this.selectionShape.attr({
              x: newX,
              width: newLength,
            });
            this.endHandleShape!.attr({
              x: newLength,
            });
            const startHandleX = (this.selectionShape.getAttribute('x') as number) - radius; // 相对背景的x坐标
            let nearestTimeDataId = Math.round((startHandleX / this.actualLength) * (timeData.length - 1));
            nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
            newSelection[0] = timeData[nearestTimeDataId].date;
            lastPosition = event.x;
          }
        } else if (endHandleDragging && !this.played) {
          const offset = event.canvasX - lastPosition;
          const newLength = (this.selectionShape.getAttribute('width') as number) + offset;
          if (newLength > this.minLength && newLength < maxLength) {
            this.selectionShape.attr({
              width: newLength,
            });
            this.endHandleShape!.attr({
              x: newLength,
            });
            const endHandleX = (this.selectionShape.getAttribute('x') as number) + newLength - radius;
            let nearestTimeDataId = Math.round((endHandleX / this.actualLength) * (timeData.length - 1));
            nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
            newSelection[1] = timeData[nearestTimeDataId].date;
            lastPosition = event.x;
          }
        } else if (selectionDragging) {
          const offset = event.canvasX - lastPosition;
          const newSelectionX = (this.selectionShape.getAttribute('x') as number) + offset;
          const radius = backgroundStyle.radius as number;
          const selectionWidth = this.selectionShape.attributes.width as number;
          if (newSelectionX + selectionWidth > length - radius) return;
          this.selectionShape.attr({
            x: newSelectionX > radius ? newSelectionX : radius,
          });

          const startHandleX = (this.selectionShape.getAttribute('x') as number) - radius; // 相对背景的x坐标
          const endHandleX = startHandleX + (this.selectionShape.getAttribute('width') as number);

          let nearestTimeDataId = Math.round((startHandleX / this.actualLength) * (timeData.length - 1));
          nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
          newSelection[0] = timeData[nearestTimeDataId].date;
          nearestTimeDataId = Math.round((endHandleX / this.actualLength) * (timeData.length - 1));
          nearestTimeDataId = nearestTimeDataId < 0 ? 0 : nearestTimeDataId;
          newSelection[1] = timeData[nearestTimeDataId].date;

          lastPosition = event.canvasX;
        }
        if (selectionDragging || startHandleDragging || endHandleDragging) {
          this.attr({ selection: newSelection });
          isFunction(onSelectionChange) && onSelectionChange(newSelection);
        }
      };
      const onDragEnd = () => {
        if ((startHandleDragging || endHandleDragging || selectionDragging) && this.played) {
          this.play();
        }
        if (startHandleDragging || endHandleDragging || selectionDragging) {
          startHandleDragging = false;
          endHandleDragging = false;
          selectionDragging = false;
          this.cachedSelection = newSelection;
          this.attr({ selection: newSelection });
        }
      };
      this.endHandleShape!.addEventListener('mousedown', onEndHandleDragStart);
      this.startHandleShape!.addEventListener('mousedown', onStartHandleDragStart);
      this.selectionShape.addEventListener('mousedown', onSelectionDragStart);
      this.addEventListener('mousemove', onDragMove);
      document.addEventListener('mouseup', onDragEnd);
      document.addEventListener('mouseleave', onDragEnd);
    }
  }

  private initTimeIndexMap() {
    this.timeIndexMap = new Map<TimeData['date'], number>();
    const { timeData } = this.attributes;
    for (let i = 0; i < timeData.length; i += 1) {
      this.timeIndexMap.set(timeData[i].date, i);
    }
  }

  private createTicks() {
    const { timeData, tickCfg: tickStyle, length, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const actualLength = length - radius * 2;
    if (actualLength > 0) {
      this.ticks = new Ticks({
        style: {
          ...tickStyle,
          startPos: [radius, 0],
          endPos: [radius + actualLength, 0],
          ticks: createTickData(timeData),
        },
      });
      this.appendChild(this.ticks);
    }
  }

  private createSelection() {
    const { length, selectionStyle, timeData, selection, single, handleStyle, backgroundStyle } = this.attributes;
    const radius = backgroundStyle.radius as number;
    const actualLength = length - radius * 2;
    if (Array.isArray(selection) && selection.length === 1 && single) {
      const idx = this.timeIndexMap.get(selection[0]);
      if (idx !== undefined) {
        const startX = (actualLength * idx) / (timeData.length - 1);
        this.selectionShape = new Rect({
          style: { ...(selectionStyle as RectStyleProps), x: startX, width: radius * 2, radius },
        });
        this.backgroundShape.appendChild(this.selectionShape);
      }
    } else if (selection.length === 2 && !single && actualLength > 0) {
      const [start, end] = selection;
      const [startIdx, endIdx] = [this.timeIndexMap.get(start), this.timeIndexMap.get(end)];
      if (startIdx !== undefined && endIdx !== undefined && endIdx > startIdx) {
        const selectionLength = (actualLength * (endIdx - startIdx)) / (timeData.length - 1);
        const startX = radius + (actualLength * startIdx) / (timeData.length - 1);

        this.selectionShape = new Rect({
          style: {
            ...(selectionStyle as RectStyleProps),
            x: startX,
            width: selectionLength,
          },
        });
        this.startHandleShape = new Circle({
          style: {
            ...handleStyle,
            y: (this.selectionShape.getAttribute('height') as number) / 2,
          },
        });
        this.endHandleShape = new Circle({
          style: {
            ...handleStyle,
            x: selectionLength,
            y: (this.selectionShape.getAttribute('height') as number) / 2,
          },
        });
        this.selectionShape.appendChild(this.startHandleShape);
        this.selectionShape.appendChild(this.endHandleShape);
        this.backgroundShape.appendChild(this.selectionShape);
      }
    }
  }

  private createBackground() {
    const { length, backgroundStyle } = this.attributes;
    this.backgroundShape = new Rect({
      style: {
        ...(backgroundStyle as RectStyleProps),
        width: length,
      },
    });
    this.appendChild(this.backgroundShape);
  }
}
