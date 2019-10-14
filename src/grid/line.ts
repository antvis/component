
import GroupComponent from '../abstract/group-component';

class Grid extends GroupComponent {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      /**
       * 绘制 grid 需要的点
       */
      girdPoints: [],
      
    }
  }

  protected renderInner(group) {

  }

}