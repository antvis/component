import type { AnimationOption, StandardAnimationOption, AnimationResult } from './types';

export function parseAnimationOption(option: AnimationOption): StandardAnimationOption {
  if (!option)
    return {
      enter: false,
      update: false,
      exit: false,
    };

  if ('enter' in option || 'update' in option || 'exit' in option) {
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
