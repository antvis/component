import { Group } from '@antv/g';
import { Grid } from '../../grid';
import { maybeAppend } from '../../../util';

export function renderGrid(container: Group, cfg?: any) {
  if (!cfg) {
    const grid = container.querySelector('.axis-grid');
    if (grid) grid.remove();
    return;
  }
  maybeAppend(container, '.axis-grid', () => new Grid({}))
    .attr('className', 'axis-grid')
    .call((selection) => (selection.node() as Grid).update(cfg));
}
