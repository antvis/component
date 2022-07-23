import { Group } from '@antv/g';
import { renderLabels, LabelAttrs } from '../../../util/primitive/labels';
import { AxisLabelCfg } from '../types';

/**
 * Display labels by default.
 */
export function renderAxisLabels(container: Group, labels: LabelAttrs[], cfg: AxisLabelCfg | null = {}) {
  renderLabels(container, 'axis-label', cfg ? labels : [], cfg, { fill: '#000', fontWeight: 'lighter' });
}
