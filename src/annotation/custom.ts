import { IGroup } from '@antv/g-base';
import { isFunction, noop } from '@antv/util';

import GroupComponent from '../abstract/group-component';
import { CustomAnnotationCfg } from '../types';

export default class CustomAnnotation extends GroupComponent<CustomAnnotationCfg> {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      name: 'annotation',
      type: 'custom',
      draw: noop,
    };
  }

  protected renderInner(group: IGroup) {
    const render = this.get('render');
    if (isFunction(render)) {
      render(group);
    }
  }
}
