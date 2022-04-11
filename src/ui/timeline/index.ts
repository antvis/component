import { deepMix, isFunction, isNumber } from '@antv/util';
import { GUIOption } from 'types';
import { AABB, DisplayObject, Rect } from '@antv/g';
import { GUI } from '../../core/gui';
import { Checkbox, CheckboxOptions } from '../checkbox';
import type { CellAxisCfg, LayoutRowData, SliderAxisCfg, SpeedControlCfg, TimelineCfg, TimelineOptions } from './types';
import { CellAxis } from './cell-axis';
import { SliderAxis } from './slider-axis';
import { SpeedControl } from './speedcontrol';
import { Button, ButtonCfg } from '../button';
import { FunctionalSymbol, Marker } from '../marker';

export type { TimelineOptions };

const SPACING = 8;

export class Timeline extends GUI<Required<TimelineCfg>> {
  /**
   * 组件 timeline
   */
  public static tag = 'timeline';

  private singleTimeCheckbox: Checkbox | undefined;

  private cellAxis: CellAxis | undefined;

  private sliderAxis: SliderAxis | undefined;

  private playBtn: Button | undefined;

  private prevBtn: Button | undefined;

  private nextBtn: Button | undefined;

  private speedControl: SpeedControl | undefined;

  /**
   * 默认配置项
   */
  public static defaultOptions: GUIOption<TimelineCfg> = {
    type: Timeline.tag,
    style: {
      x: 0,
      y: 0,
      width: 500,
      height: 40,
      dataPerStep: 1,
      data: [],
      orient: { layout: 'row', controlButtonAlign: 'left' },
      playMode: 'fixed',
      loop: true,
      type: 'cell',
      speed: 1,
      single: false,
      controls: {
        singleModeControl: {
          style: {
            label: {
              text: '单一时间',
            },
          },
        },
        controlButton: {
          playBtn: {
            buttonStyle: {
              default: {
                fill: '#F7F7F7',
                stroke: '#bfbfbf',
                radius: 10,
              },
              active: {
                fill: 'rgba(52, 113, 249, 0.1)',
                stroke: '#3471F9',
                radius: 10,
              },
            },
            markerStyle: {
              default: {
                stroke: '#bfbfbf',
              },
              active: {
                stroke: '#3471F9',
              },
            },
          },
          prevBtn: {
            markerStyle: {
              default: {
                stroke: '#bfbfbf',
              },
              active: {
                stroke: '#3471F9',
              },
            },
            buttonStyle: {
              default: {
                stroke: 'none',
              },
              selected: {
                stroke: 'none',
              },
              active: {
                stroke: 'none',
              },
            },
          },
          nextBtn: {
            markerStyle: {
              default: {
                stroke: '#bfbfbf',
              },
              active: {
                stroke: '#3471F9',
              },
            },
            buttonStyle: {
              default: {
                stroke: 'none',
              },
              selected: {
                stroke: 'none',
              },
              active: {
                stroke: 'none',
              },
            },
          },
        },
      },
    },
  };

  public delay = 800;

  public duration = 200;

  private played: boolean = false;

  private playListener: () => void = () => {};

  private cachedSelection: [string] | [string, string] | undefined;

  public get isPlayed() {
    return this.played;
  }

  public get components() {
    return {
      sliderAxis: this.sliderAxis,
      cellAxis: this.cellAxis,
      speedControl: this.speedControl,
      playBtn: this.playBtn,
      prevBtn: this.prevBtn,
      nextBtn: this.nextBtn,
      singleTimeCheckbox: this.singleTimeCheckbox,
    };
  }

  constructor(options: TimelineOptions) {
    super(deepMix({}, Timeline.defaultOptions, options));
    this.init();
  }

  public init() {
    this.createControl();
    this.createAxis();
    this.layout();
    this.bindCustomEvents();
    // this.drawBB(this.playBtn);
    // this.cellAxis && this.drawBB(this.cellAxis.cellBackground);
  }

  public update(cfg: Partial<Required<TimelineCfg>>): void {
    this.attr(deepMix({}, this.attributes, cfg));
    this.clear();
    this.init();
    this.played = false;
  }

  public clear() {
    this.removeChildren();
  }

  public drawBB(shape: DisplayObject | undefined) {
    if (!shape) return;
    const bounding = shape.getBounds() as AABB;
    const { center, halfExtents } = bounding;
    const bounds = new Rect({
      style: {
        stroke: 'blue',
        lineWidth: 2,
        width: halfExtents[0] * 2,
        height: halfExtents[1] * 2,
      },
    });
    this.appendChild(bounds);
    bounds.setPosition(center[0] - halfExtents[0], center[1] - halfExtents[1]);
  }

  private bindCustomEvents() {
    this.addEventListener('replay', () => {
      if (!this.attributes.loop) return;
      if (this.sliderAxis) {
        // this.sliderAxis.update({ selection: this.cachedSelection });
      }
    });
  }

  private play() {
    const { dataPerStep, playMode, loop, speed } = this.attributes;
    const axis = this.cellAxis ? this.cellAxis : this.sliderAxis;
    if (!axis) return;
    if (this.cellAxis) {
      this.cellAxis.attr({ dataPerStep, loop, playMode, interval: 1000 / speed });
      this.cellAxis.play();
    }
    if (this.sliderAxis) {
      this.sliderAxis.attr({ duration: this.duration / speed, delay: this.delay / speed, dataPerStep, loop, playMode });
      this.sliderAxis.play();
    }
  }

  public setSelection(selection: [string, string] | [string]) {
    const { onSelectionChange } = this.attributes;
    const axis = this.cellAxis ? this.cellAxis : this.sliderAxis;
    if (axis) {
      const { single } = axis.attributes;
      // 若正在播放，关闭播放，避免动画出错。
      if (this.played) {
        this.playListener();
      }
      if ((single && selection.length === 1) || (!single && selection.length === 2))
        axis.update({
          selection,
        });
    }
    isFunction(onSelectionChange) && onSelectionChange(selection);
  }

  public togglePlay() {
    if (this.playBtn) {
      this.playListener();
    }
  }

  private createAxis() {
    const { type, cellAxisCfg, sliderAxisCfg, data, onSelectionChange, width, single } = this.attributes;
    if (type === 'cell') {
      this.cellAxis = new CellAxis({
        style: { ...(cellAxisCfg as CellAxisCfg), length: width, timeData: data, onSelectionChange, single },
      });
    } else {
      this.sliderAxis = new SliderAxis({
        style: {
          ...(sliderAxisCfg as SliderAxisCfg),
          timeData: data,
          onSelectionChange,
          single,
        },
      });
    }
    this.cellAxis && this.appendChild(this.cellAxis);
    this.sliderAxis && this.appendChild(this.sliderAxis);
  }

  private createControl() {
    const { controls } = this.attributes;
    if (controls === false) return;

    const { singleModeControl, controlButton, speedControl } = controls;
    if (singleModeControl !== false) {
      this.createSingleModeControl(singleModeControl);
    }
    if (controlButton !== false) {
      controlButton?.playBtn !== false && this.createPlayBtn(controlButton?.playBtn);
      controlButton?.prevBtn !== false && this.createPrevBtn(controlButton?.prevBtn);
      controlButton?.nextBtn !== false && this.createNextBtn(controlButton?.nextBtn);
    }
    if (speedControl !== false) {
      this.createSpeedControl(speedControl || undefined);
    }
  }

  private createNextBtn(nextBtnCfg: Omit<ButtonCfg, 'onClick'> | undefined) {
    const { onForward } = this.attributes;
    const nextMarker: FunctionalSymbol = (x: number, y: number) => {
      return [
        ['M', x, y + 6],
        ['L', x + 6, y],
        ['L', x, y - 6],
        ['M', x - 6, y + 6],
        ['L', x, y],
        ['L', x - 6, y - 6],
      ];
    };
    const forwardListener = () => {
      if (this.attributes.playMode === 'fixed') {
        this.cellAxis?.moveDistance(1);
        this.sliderAxis?.moveDistance(1);
      } else {
        this.cellAxis?.increase(1);
        this.sliderAxis?.increase(1);
      }
      isFunction(onForward) && onForward();
    };
    this.nextBtn = new Button({
      style: {
        ...nextBtnCfg,
        width: 12,
        marker: nextMarker,
        onClick: forwardListener,
      },
    });
    this.appendChild(this.nextBtn);
  }

  private createPrevBtn(prevBtnCfg: Omit<ButtonCfg, 'onClick'> | undefined) {
    const { onBackward } = this.attributes;
    const prevMarker: FunctionalSymbol = (x: number, y: number) => {
      return [
        ['M', x + 6, y + 6],
        ['L', x, y],
        ['L', x + 6, y - 6],
        ['M', x, y + 6],
        ['L', x - 6, y],
        ['L', x, y - 6],
      ];
    };
    const backwardListener = () => {
      if (this.attributes.playMode === 'fixed') {
        this.cellAxis?.moveDistance(-1);
        this.sliderAxis?.moveDistance(-1);
      } else {
        this.cellAxis?.increase(-1);
        this.sliderAxis?.increase(-1);
      }
      isFunction(onBackward) && onBackward();
    };
    this.prevBtn = new Button({
      style: {
        ...prevBtnCfg,
        width: 12,
        marker: prevMarker,
        onClick: backwardListener,
      },
    });
    this.appendChild(this.prevBtn);
  }

  public get timeSelection() {
    if (this.cellAxis) {
      return this.cellAxis.attributes.selection;
    }
    if (this.sliderAxis) {
      return this.sliderAxis.attributes.selection;
    }
    return undefined;
  }

  private createPlayBtn(playBtnCfg: Omit<ButtonCfg, 'onClick'> | undefined) {
    const { onPlay } = this.attributes;
    const playMarker: FunctionalSymbol = (x: number, y: number) => {
      return [['M', x + 3, y], ['L', x - 1.5, y - 1.5 * Math.sqrt(3)], ['L', x - 1.5, y + 1.5 * Math.sqrt(3)], ['Z']];
    };
    const stopMarker: FunctionalSymbol = (x: number, y: number) => {
      return [
        ['M', x + 2, y + 3],
        ['L', x + 2, y - 3],
        ['M', x - 2, y + 3],
        ['L', x - 2, y - 3],
      ];
    };
    this.playBtn = new Button({
      style: {
        ...playBtnCfg,
        onClick: onPlay,
        width: 20,
        height: 20,
        marker: playMarker,
      },
    });
    // this.playBtn.scale(2 / 3, 2 / 3);

    this.playListener = () => {
      this.played = !this.played;
      if (this.played) {
        this.cachedSelection = this.timeSelection as [string] | [string, string];
        this.play();
        isFunction(this.attributes.onPlay) && this.attributes?.onPlay();
      } else {
        this.stop();
        isFunction(this.attributes.onStop) && this.attributes?.onStop();
      }
      this.playBtn?.update({
        marker: this.played ? stopMarker : playMarker,
      });
    };
    this.playBtn.addEventListener('click', this.playListener);
    this.appendChild(this.playBtn);
  }

  private stop() {
    this.played = false;
    this.cellAxis?.stop();
    this.sliderAxis?.stop();
    if (this.cellAxis) this.cellAxis.played = false;
    if (this.sliderAxis) this.sliderAxis.played = false;
  }

  private createSingleModeControl(options: CheckboxOptions | undefined) {
    const { onSingleTimeChange, data, single } = this.attributes;
    const singleListener = (single: boolean) => {
      if (single) {
        this.sliderAxis?.update({
          single,
          selection: [data[0].date],
        });

        this.cellAxis?.update({
          single,
          selection: [data[0].date],
        });
      } else {
        this.sliderAxis?.update({
          single,
          selection: [data[0].date, data[data.length - 1].date],
        });

        this.cellAxis?.update({
          single,
          selection: [data[0].date, data[data.length - 1].date],
        });
      }
      if (this.played) this.playListener();
      isFunction(onSingleTimeChange) && onSingleTimeChange(single);
    };
    this.singleTimeCheckbox = new Checkbox({
      ...options,
      ...{
        style: {
          checked: single,
          label: {
            text: '单一时间',
          },
          onChange: singleListener,
        },
      },
    });
    this.appendChild(this.singleTimeCheckbox);
  }

  private createSpeedControl(cfg: Omit<SpeedControlCfg, 'onSpeedChange'> | undefined) {
    const { onSpeedChange, speed } = this.attributes;
    const speedListener = (idx: number) => {
      if (this.speedControl) {
        const { speeds } = this.speedControl.attributes;
        this.attr({ speed: speeds[idx] });
        isFunction(onSpeedChange) && onSpeedChange(idx);
        if (this.played) {
          this.playListener();
        }
      }
    };
    this.speedControl = new SpeedControl({
      style: { ...cfg, width: 35, onSpeedChange: speedListener },
    });
    const { speeds } = this.speedControl.attributes;
    const currIdx = speeds.findIndex((val) => val === speed);
    currIdx !== -1 && this.speedControl.update({ currentSpeedIdx: currIdx });
    this.appendChild(this.speedControl);
  }

  private layout() {
    if (this.attributes.orient.layout === 'row') {
      this.layoutRow(); // 横向排版
    } else {
      this.layoutCol(); // 竖向
    }
    // 最后要根据ticks调整整体位置，使得一开始的y在左上角
    if (this.cellAxis) {
      const offsetY =
        (this.cellAxis.cellBackground?.getBounds()?.min[1] as number) -
        (this.cellAxis.cellTicks?.getBounds()?.min[1] as number);
      this.children.forEach((child: any) => {
        child.translate(0, offsetY);
      });
    } else if (this.sliderAxis) {
      const offsetY =
        (this.sliderAxis.sliderBackground?.getBounds()?.min[1] as number) -
        (this.sliderAxis.sliderTicks?.getBounds()?.min[1] as number);
      this.children.forEach((child: any) => {
        child.translate(0, offsetY);
      });
    }
  }

  private layoutCol() {
    const { orient, width, x } = this.attributes;
    let y = 0;
    if (this.sliderAxis) {
      this.sliderAxis.update({
        length: width,
      });
      y = this.getHeight(this.sliderAxis.sliderBackground) + SPACING;
    }
    if (this.cellAxis) {
      this.cellAxis.update({
        length: width,
      });
      y = this.getHeight(this.cellAxis.cellBackground) + SPACING;
    }

    // if (orient.controlButtonAlign === 'normal') {
    // 先水平从右到左排版
    const rightElements: DisplayObject[] = [];

    this.speedControl && rightElements.push(this.speedControl);
    this.singleTimeCheckbox && rightElements.push(this.singleTimeCheckbox);

    let totalWidth = 0;
    for (let i = 0; i < rightElements.length; i += 1) {
      if (i !== rightElements.length - 1) totalWidth += this.getWidth(rightElements[i]) + SPACING;
      else totalWidth += this.getWidth(rightElements[i]);
      this.verticalCenter(rightElements[i]);
    }
    if (rightElements.length === 1) {
      rightElements[0].translate(width - totalWidth, y);
    } else if (rightElements.length === 2) {
      rightElements[0].translate(width - totalWidth, y);
      rightElements[1].translate(width - this.getWidth(rightElements[1]), y);
    }

    const group: DisplayObject[] = [];
    this.prevBtn && group.push(this.prevBtn);
    this.playBtn && group.push(this.playBtn);
    this.nextBtn && group.push(this.nextBtn);
    let startX = 0;
    for (let i = 0; i < group.length; i += 1) {
      this.verticalCenter(group[i]);
      (group[i] as DisplayObject).translate(startX);
      startX += this.getWidth(group[i] as DisplayObject) + SPACING;
    }

    // 移到水平位置的中心处，并且竖直方向与axis的中心对齐 再移动到axis正下方
    const offsetX = 0.5 * (width - startX + SPACING);
    // const offsetX = (width - startX - this.getWidth(group[group.length - 1])) / 2;
    for (let i = 0; i < group.length; i += 1) {
      (group[i] as DisplayObject).translate(offsetX, y);
    }
    // }
  }

  private getWidth(shape: DisplayObject) {
    return (shape.getBounds()?.halfExtents[0] as number) * 2;
  }

  private getHeight(shape: DisplayObject) {
    return (shape.getBounds()?.halfExtents[1] as number) * 2;
  }

  private getVerticalCenter(shape: DisplayObject) {
    return shape.getBounds()?.center[1] as number;
  }

  private verticalCenter(shape: DisplayObject) {
    const centerY = this.cellAxis
      ? this.cellAxis.backgroundVerticalCenter
      : (this.sliderAxis?.backgroundVerticalCenter as number);
    const shapeCenterY = this.getVerticalCenter(shape);
    const offset = centerY - shapeCenterY;
    shape.translate(0, offset);
  }

  private layoutVertical() {
    this.prevBtn && this.verticalCenter(this.prevBtn);
    this.playBtn && this.verticalCenter(this.playBtn);
    this.nextBtn && this.verticalCenter(this.nextBtn);
    this.speedControl && this.verticalCenter(this.speedControl);
    this.singleTimeCheckbox && this.verticalCenter(this.singleTimeCheckbox);
  }

  private layoutRow() {
    const {
      orient: { controlButtonAlign },
      width,
    } = this.attributes;

    // 存放所有存在的shape
    const existShapes: LayoutRowData[] = [];

    if (controlButtonAlign === 'left') {
      this.prevBtn && existShapes.push({ shape: this.prevBtn, width: this.getWidth(this.prevBtn) });
      this.playBtn && existShapes.push({ shape: this.playBtn, width: this.getWidth(this.playBtn) });
      this.nextBtn && existShapes.push({ shape: this.nextBtn, width: this.getWidth(this.nextBtn) });
      this.cellAxis && existShapes.push({ shape: this.cellAxis, width: 'auto' });
      this.sliderAxis && existShapes.push({ shape: this.sliderAxis, width: 'auto' });
      this.speedControl && existShapes.push({ shape: this.speedControl, width: this.getWidth(this.speedControl) });
      this.singleTimeCheckbox &&
        existShapes.push({ shape: this.singleTimeCheckbox, width: this.getWidth(this.singleTimeCheckbox) });
    } else if (controlButtonAlign === 'right') {
      this.cellAxis && existShapes.push({ shape: this.cellAxis, width: 'auto' });
      this.sliderAxis && existShapes.push({ shape: this.sliderAxis, width: 'auto' });
      this.prevBtn && existShapes.push({ shape: this.prevBtn, width: this.getWidth(this.prevBtn) });
      this.playBtn && existShapes.push({ shape: this.playBtn, width: this.getWidth(this.playBtn) });
      this.nextBtn && existShapes.push({ shape: this.nextBtn, width: this.getWidth(this.nextBtn) });
      this.speedControl && existShapes.push({ shape: this.speedControl, width: this.getWidth(this.speedControl) });
      this.singleTimeCheckbox &&
        existShapes.push({ shape: this.singleTimeCheckbox, width: this.getWidth(this.singleTimeCheckbox) });
    } else {
      this.playBtn && existShapes.push({ shape: this.playBtn, width: this.getWidth(this.playBtn) });
      this.prevBtn && existShapes.push({ shape: this.prevBtn, width: this.getWidth(this.prevBtn) });
      this.cellAxis && existShapes.push({ shape: this.cellAxis, width: 'auto' });
      this.sliderAxis && existShapes.push({ shape: this.sliderAxis, width: 'auto' });
      this.nextBtn && existShapes.push({ shape: this.nextBtn, width: this.getWidth(this.nextBtn) });
      this.speedControl && existShapes.push({ shape: this.speedControl, width: this.getWidth(this.speedControl) });
      this.singleTimeCheckbox &&
        existShapes.push({ shape: this.singleTimeCheckbox, width: this.getWidth(this.singleTimeCheckbox) });
    }

    let accumulatedWidth = 0;

    existShapes.forEach((data) => {
      data.shape.setAttribute('x', accumulatedWidth);
      accumulatedWidth += isNumber(data.width) ? data.width : 0;
      accumulatedWidth += SPACING;
    });

    const restWidth = width - accumulatedWidth;

    if ((this.cellAxis || this.sliderAxis) && restWidth > 0) {
      this.cellAxis?.update({
        length: restWidth,
      });
      this.sliderAxis?.update({
        length: restWidth,
      });
      let axisIdx = existShapes.findIndex((val) => val.shape === this.cellAxis || val.shape === this.sliderAxis);
      axisIdx += 1;
      for (; axisIdx < existShapes.length; axisIdx += 1) {
        existShapes[axisIdx].shape.translate(restWidth);
      }
    }
    this.layoutVertical();
  }
}
