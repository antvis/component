import type { PathStyleProps, RectStyleProps, TextStyleProps } from '@antv/g';
import type { GenericAnimation } from '../../animation';
import type { ComponentOptions } from '../../core';
import type { PrefixObject } from '../../types';

export type NavigatorStyleProps = {
  formatter?: (curr: number, total: number) => string;
  animate?: GenericAnimation;
  style: Omit<RectStyleProps, 'width' | 'height'> &
    PrefixObject<PathStyleProps & { size?: number }, 'button'> &
    PrefixObject<TextStyleProps, 'pageNum'> & {
      /** once pageWidth is not provided, it will be set to bbox shape */ pageWidth?: number;
      /** infer to pageWidth */
      pageHeight?: number;
      orientation?: 'horizontal' | 'vertical';
      initPage?: number;
      loop?: boolean;
      /** padding between buttons and page number  */
      controllerPadding?: number;
      /** spacing between controller and page content */
      controllerSpacing?: number;
    };
};

export type NavigatorOptions = ComponentOptions<NavigatorStyleProps>;
