import type { GroupStyleProps, DisplayObjectConfig } from '../../shapes';
import type { LayoutElementConfig } from '../../util/layout';
import type { SeriesAttr } from '../../util/series';

export type LayoutStyleProps = GroupStyleProps &
  LayoutElementConfig & {
    width: number;
    height: number;
    margin?: SeriesAttr;
    border?: SeriesAttr;
    padding?: SeriesAttr;
  };

export type LayoutOptions = DisplayObjectConfig<LayoutStyleProps>;
