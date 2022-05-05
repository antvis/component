import { Text } from '@antv/g';
import autoEllipsis from './autoEllipsis';
import autoHide from './autoHide';
import autoRotate from './autoRotate';

export type OverlapCallback = (orient: string | null, labels: Text[], cfg?: any) => any;
const OverlapUtils = new Map<
  string,
  {
    getDefault: any;
    [k: string]: OverlapCallback | any;
  }
>([
  ['autoHide', autoHide],
  ['autoRotate', autoRotate],
  ['autoEllipsis', autoEllipsis],
]);

export { OverlapUtils };
