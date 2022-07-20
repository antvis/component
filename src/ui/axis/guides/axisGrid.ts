import { Group } from '@antv/g';
import { Grid, GridStyleProps } from '../../grid';
import { maybeAppend } from '../../../util';
import { GUI } from '../../../util/create';

export function renderGrid(container: Group, cfg?: any) {
  if (!cfg) {
    const grid = container.querySelector('.axis-grid');
    if (grid) grid.remove();
    return;
  }
  maybeAppend(container, '.axis-grid', () => new Grid({}))
    .attr('className', 'axis-grid')
    .call((selection) => (selection.node() as GUI<GridStyleProps>).update(cfg));
}
