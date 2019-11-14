/**
 * @fileoverview 使用 G.Group 的组件
 * @author dxq613@gmail.com
 */
import { IElement, IGroup } from '@antv/g-base/lib/interfaces';
import { each, mix } from '@antv/util';
import { BBox, GroupComponentCfg, Point } from '../types';
import { getMatrixByTranslate } from '../util/matrix';
import Component from './component';
type Callback = (evt: object) => void;

const STATUS_UPDATE = 'update_status';
const COPY_POPERTYS = ['visible', 'tip', 'delegationObject']; // 更新对象时需要复制的属性

abstract class GroupComponent<T extends GroupComponentCfg = GroupComponentCfg> extends Component {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      container: null,
      /**
       * @private
       * 缓存图形的 Map
       */
      shapesMap: {},
      group: null,
      capture: true,
      /**
       * @private 组件或者图形是否
       * @type {false}
       */
      isRegister: false,
    };
  }

  public remove() {
    this.clear();
    const group = this.get('group');
    group.remove();
  }

  public clear() {
    const group = this.get('group');
    group.clear();
    this.set('shapesMap', {});
  }

  public getElementById(id) {
    return this.get('shapesMap')[id];
  }

  public getContainer(): IGroup {
    return this.get('container') as IGroup;
  }

  public update(cfg: Partial<T>) {
    super.update(cfg);
    const group = this.get('group');
    const newGroup = this.createOffScreenGroup();
    this.renderInner(newGroup);
    this.applyOffset();
    this.updateElements(newGroup, group);
    this.deleteElements();
    newGroup.destroy(); // 销毁虚拟分组
  }

  public render() {
    this.set('isRegister', true);
    const group = this.get('group');
    this.renderInner(group);
    this.applyOffset();
    this.set('isRegister', false);
  }

  public show() {
    const group = this.get('group');
    group.show();
    this.set('visible', true);
  }

  public hide() {
    const group = this.get('group');
    group.hide();
    this.set('visible', false);
  }

  public destroy() {
    this.removeEvent();
    this.remove();
    super.destroy();
  }

  public getBBox(): BBox {
    return this.get('group').getCanvasBBox();
  }

  // 复写 on, off, emit 透传到 group
  public on(evt: string, callback: Callback, once?: boolean): this {
    const group = this.get('group');
    group.on(evt, callback, once);
    return this;
  }

  public off(evt?: string, callback?: Callback): this {
    const group = this.get('group');
    group && group.off(evt, callback);
    return this;
  }

  public emit(eventName: string, eventObject: object) {
    const group = this.get('group');
    group.emit(eventName, eventObject);
  }

  // 创建离屏的 group ,不添加在 canvas 中
  protected createOffScreenGroup() {
    const group = this.get('group');
    const GroupClass = group.getGroupBase(); // 获取分组的构造函数
    const newGroup = new GroupClass({
      delegationObject: this.getDelegationObject(), // 生成委托事件触发时附加的对象
    });
    return newGroup;
  }

  protected getElementByLocalId(localId) {
    const id = this.getElementId(localId);
    return this.getElementById(id);
  }

  // 应用 offset
  protected applyOffset() {
    const offsetX = this.get('offsetX');
    const offsetY = this.get('offsetY');
    this.moveElementTo(this.get('group'), {
      x: offsetX,
      y: offsetY,
    });
  }

  protected init() {
    this.initGroup();
    this.initEvent();
  }

  protected initGroup() {
    const container = this.get('container');
    this.set(
      'group',
      container.addGroup({
        id: this.get('id'),
        name: this.get('name'),
        capture: this.get('capture'),
        visible: this.get('visible'),
        delegationObject: this.getDelegationObject(),
      })
    );
  }

  /**
   * @protected
   * 在组件上添加分组，主要解决 isReigeter 的问题
   * @param {IGroup} parent 父元素
   * @param {object} cfg    分组的配置项
   */
  protected addGroup(parent: IGroup, cfg) {
    this.appendDelegationObject(parent, cfg);
    const group = parent.addGroup(cfg);
    if (this.get('isRegister')) {
      this.registerElement(group);
    }
    return group;
  }

  /**
   * @protected
   * 在组件上添加图形，主要解决 isReigeter 的问题
   * @param {IGroup} parent 父元素
   * @param {object} cfg    分组的配置项
   */
  protected addShape(parent: IGroup, cfg) {
    this.appendDelegationObject(parent, cfg);
    const shape = parent.addShape(cfg);
    if (this.get('isRegister')) {
      this.registerElement(shape);
    }
    return shape;
  }

  protected initEvent() {}

  protected removeEvent() {
    const group = this.get('group');
    group.off();
  }

  protected getElementId(localId) {
    const id = this.get('id'); // 组件的 Id
    const name = this.get('name'); // 组件的名称
    return `${id}-${name}-${localId}`;
  }

  protected registerElement(element) {
    const id = element.get('id');
    this.get('shapesMap')[id] = element;
  }

  protected unregisterElement(element) {
    const id = element.get('id');
    delete this.get('shapesMap')[id];
  }

  // 移动元素
  protected moveElementTo(element: IElement, point: Point) {
    const matrix = getMatrixByTranslate(point);
    element.attr('matrix', matrix);
  }

  /**
   * 内部的渲染
   * @param {IGroup} group 图形分组
   */
  protected abstract renderInner(group);

  /**
   * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
   * @protected
   * @param {string} elmentName 图形元素名称
   * @param {IElement} newElement  新的图形元素
   * @param {object} animateCfg 动画的配置项
   */
  protected addAnimation(elmentName, newElement, animateCfg) {
    // 缓存透明度
    const originOpacity = newElement.attr('opacity');
    newElement.attr('opacity', 0);
    newElement.animate({ opacity: originOpacity }, animateCfg);
  }

  /**
   * 图形元素新出现时的动画，默认图形从透明度 0 到当前透明度
   * @protected
   * @param {string} elmentName 图形元素名称
   * @param {IElement} originElement 要删除的图形元素
   * @param {object} animateCfg 动画的配置项
   */
  protected removeAnimation(elementName, originElement, animateCfg) {
    originElement.animate({ opacity: 0 }, animateCfg);
  }

  /**
   * 图形元素的更新动画
   * @param {string} elmentName 图形元素名称
   * @param {IElement} originElement 现有的图形元素
   * @param {object} newAttrs  新的图形元素
   * @param {object} animateCfg 动画的配置项
   */
  protected updateAnimation(elementName, originElement, newAttrs, animateCfg) {
    originElement.animate(newAttrs, animateCfg);
  }

  // 更新组件的图形
  protected updateElements(newGroup, originGroup) {
    const animate = this.get('animate');
    const animateCfg = this.get('animateCfg');
    const children = newGroup.getChildren().slice(0); // 创建一个新数组，防止添加到 originGroup 时， children 变动
    let preElement; // 前面已经匹配到的图形元素，用于
    each(children, (element) => {
      const elementId = element.get('id');
      const originElement = this.getElementById(elementId);
      const elementName = element.get('name');
      if (originElement) {
        const replaceAttrs = this.getReplaceAttrs(originElement, element);
        // 更新
        if (animate) {
          // 没有动画
          this.updateAnimation(elementName, originElement, replaceAttrs, animateCfg);
        } else {
          // originElement.attrs = replaceAttrs; // 直接替换
          originElement.attr(replaceAttrs);
        }
        // 如果是分组，则继续执行
        if (element.isGroup()) {
          this.updateElements(element, originElement);
        }
        // 复制属性
        each(COPY_POPERTYS, (name) => {
          originElement.set(element.get(name));
        });

        preElement = originElement;
        // 执行完更新后设置状态位为更新
        originElement.set(STATUS_UPDATE, 'update');
      } else {
        // 没有对应的图形，则插入当前图形
        originGroup.add(element); // 应该在 group 加个 insertAt 的方法
        const siblings = originGroup.getChildren(); // 兄弟节点
        siblings.splice(siblings.length - 1, 1); // 先从数组中移除，然后放到合适的位置
        if (preElement) {
          // 前面已经有更新的图形或者插入的图形，则在这个图形后面插入
          const index = siblings.indexOf(preElement);
          siblings.splice(index + 1, 0, element); // 在已经更新的图形元素后面插入
        } else {
          siblings.unshift(element);
        }
        this.registerElement(element); // 注册节点
        element.set(STATUS_UPDATE, 'add'); // 执行完更新后设置状态位为添加
        if (element.isGroup()) {
          // 如果元素是新增加的元素，则遍历注册所有的子节点
          this.registerNewGroup(element);
        }

        preElement = element;
        if (animate) {
          this.addAnimation(elementName, element, animateCfg);
        }
      }
    });
  }

  protected clearUpdateStatus(group: IGroup) {
    const children = group.getChildren();
    each(children, (el) => {
      el.set(STATUS_UPDATE, null); // 清理掉更新状态
    });
  }

  // 获取发生委托时的对象，在事件中抛出
  private getDelegationObject() {
    const name = this.get('name');
    const delegationObject = {
      [name]: this,
    };
    return delegationObject;
  }

  // 附加委托信息，用于事件
  private appendDelegationObject(parent: IGroup, cfg) {
    const parentObject = parent.get('delegationObject');
    if (!cfg.delegationObject) {
      cfg.delegationObject = {};
    }
    mix(cfg.delegationObject, parentObject); // 将父元素上的委托信息复制到自身
  }

  // 获取需要替换的属性，如果原先图形元素存在，而新图形不存在，则设置 undefined
  private getReplaceAttrs(originElement: IElement, newElement: IElement) {
    const originAttrs = originElement.attr();
    const newAttrs = newElement.attr();
    each(originAttrs, (v, k) => {
      if (newAttrs[k] === undefined) {
        newAttrs[k] = undefined;
      }
    });
    return newAttrs;
  }

  private registerNewGroup(group) {
    const children = group.getChildren();
    each(children, (element) => {
      this.registerElement(element); // 注册节点
      element.set(STATUS_UPDATE, 'add'); // 执行完更新后设置状态位为添加
      if (element.isGroup()) {
        this.registerNewGroup(element);
      }
    });
  }

  // 移除多余的元素
  private deleteElements() {
    const shapesMap = this.get('shapesMap');
    const deleteArray = [];
    // 遍历获取需要删除的图形元素
    each(shapesMap, (element, id) => {
      if (!element.get(STATUS_UPDATE) || element.destroyed) {
        deleteArray.push([id, element]);
      } else {
        element.set(STATUS_UPDATE, null); // 清理掉更新状态
      }
    });
    const animate = this.get('animate');
    const animateCfg = this.get('animateCfg');
    // 删除图形元素
    each(deleteArray, (item) => {
      const [id, element] = item;
      if (!element.destroyed) {
        const elementName = element.get('name');
        if (animate) {
          // 需要动画结束时移除图形
          const callbackAnimCfg = mix(
            {
              callback() {
                element.remove();
              },
            },
            animateCfg
          );
          this.removeAnimation(elementName, element, callbackAnimCfg);
        } else {
          element.remove();
        }
      }
      delete shapesMap[id]; // 从缓存中移除
    });
  }
}

export default GroupComponent;
