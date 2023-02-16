/* global Keyframe */
import type { DisplayObject } from '@antv/g';
import { isNil } from '@antv/util';
import type { GUI } from '../core';
import type { AnimationOption, AnimationResult, GenericAnimation, StandardAnimationOption } from './types';

export function parseAnimationOption(option: AnimationOption): StandardAnimationOption {
  if (!option)
    return {
      enter: false,
      update: false,
      exit: false,
    };

  if ('enter' in option || 'update' in option || 'exit' in option) {
    if (Object.keys(option).length > 3) {
      const inferOption = Object.fromEntries(
        Object.entries(option).filter(([k, v]) => !['enter', 'update', 'exit'].includes(k))
      );
      return { enter: false, update: inferOption, exit: false };
    }
    return option as StandardAnimationOption;
  }

  return {
    enter: option,
    update: option,
    exit: option,
  };
}

export function onAnimateFinished(animation: AnimationResult, callback: () => void) {
  if (!animation) callback();
  else animation.finished.then(callback);
}

function attr(target: DisplayObject | GUI<any>, value: Record<string, any>) {
  if ('update' in target) target.update(value);
  else target.attr(value);
}

export function animate(target: DisplayObject | GUI<any>, keyframes: Keyframe[], options: GenericAnimation) {
  if (keyframes.length === 0) return null;
  if (!options) {
    const state = keyframes.slice(-1)[0];
    attr(target, { style: state });
    return null;
  }
  return target.animate(keyframes, options);
}

/**
 * execute transition animation on element
 * @description in the current stage, only support the following properties:
 * x, y, width, height, opacity, fill, stroke, lineWidth, radius
 * @param target element to be animated
 * @param state target properties or element
 * @param options transition options
 * @param animate whether to animate
 * @returns transition instance
 */
export function transition(
  target: DisplayObject | GUI<any>,
  state: Record<string, any> | (DisplayObject | GUI<any>),
  options: GenericAnimation
) {
  const from: typeof state = {};
  const to: typeof state = {};
  Object.entries(state).forEach(([key, tarStyle]) => {
    const currStyle = target.attr(key);
    if (!isNil(tarStyle) && !isNil(currStyle) && currStyle !== tarStyle) {
      from[key] = currStyle;
      to[key] = tarStyle;
    }
  });

  if (!options) {
    attr(target, to);
    return null;
  }

  return animate(target, [from, to], { fill: 'both', ...options });
}
