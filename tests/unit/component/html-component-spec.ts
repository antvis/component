import { isNil } from '@antv/util';
import HtmlComponent from '../../../src/abstract/html-component';
import { createBBox } from '../../../src/util/util';

const div = document.createElement('div');
div.id = 'pid';
document.body.appendChild(div);
class AComponent extends HtmlComponent {
  public getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    return {
      ...cfg,
      type: 'a',
      showA: true,
      text: '',
    };
  }
  public renderA() {
    const container = this.get('container');
    const el = document.createElement('div');
    el.innerText = this.get('text');
    container.appendChild(el);
    this.set('aDom', el);
  }

  public render() {
    if (this.get('showA')) {
      this.renderA();
    }
  }

  public update(cfg) {
    super.update(cfg);
    if (!isNil(cfg.showA)) {
      if (!cfg.showA) {
        const aDom = this.get('aDom');
        aDom && aDom.remove();
      } else {
        this.renderA();
      }
    }
    if (cfg.text) {
      const aDom = this.get('aDom');
      if (aDom) {
        aDom.innerText = cfg.text;
      }
    }
  }

  public clear() {
    super.clear();
    this.set('aDom', null); // 清理
  }
}

describe('test html component create', () => {
  it('parent is string, container null', () => {
    const component = new AComponent({
      containerTpl: '<div class="my-test"></div>',
      parent: 'pid',
    });
    component.init();
    const container = component.getContainer();
    expect(container.className).toBe('my-test');
    expect(component.getBBox()).toEqual(createBBox(0, 0, container.clientWidth, container.clientHeight));
  });

  it('parent is dom, container is null', () => {
    const component = new AComponent({
      containerTpl: '<div class="my-test"></div>',
      parent: div,
    });
    component.init();
    const container = component.getContainer();
    expect(container.className).toBe('my-test');
  });

  it('container is string', () => {
    const component = new AComponent({
      container: 'pid',
    });
    component.init();
    const container = component.getContainer();
    expect(container.id).toBe('pid');
  });
  it('container is dom', () => {
    const component = new AComponent({
      container: div,
    });
    component.init();
    const container = component.getContainer();
    expect(container.id).toBe('pid');
    expect(component.get('capture')).toBe(true);
  });
  it('init visible false', () => {
    const component = new AComponent({
      parent: div,
      visible: false,
    });
    component.init();
    const container = component.getContainer();
    expect(container.style.display).toBe('none');
  });
  it('init capture false', () => {
    const component = new AComponent({
      parent: div,
      capture: false,
      visible: false,
    });
    component.init();
    const container = component.getContainer();
    expect(container.style.pointerEvents).toBe('none');
  });
});

describe('test html component methods', () => {
  const component = new AComponent({
    containerTpl: '<div class="my-test"></div>',
    parent: 'pid',
    text: 'abc',
  });
  it('init', () => {
    component.init();
    expect(component.get('type')).toBe('a');
  });

  it('render', () => {
    component.render();
    const container = component.get('container');
    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].innerText).toBe('abc');
  });

  it('update', () => {
    component.update({
      text: 'bcd',
    });
    const container = component.get('container');
    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].innerText).toBe('bcd');

    component.update({
      showA: false,
    });
    expect(container.childNodes.length).toBe(0);

    component.update({
      showA: true,
      text: 'cde',
    });

    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].innerText).toBe('cde');
  });
  it('capture', () => {
    const container = component.get('container');
    expect(container.style.pointerEvents).toBe('auto');
    component.setCapture(false);
    expect(component.get('capture')).toBe(false);
    expect(container.style.pointerEvents).toBe('none');
    component.setCapture(true);
    expect(component.get('capture')).toBe(true);
    expect(container.style.pointerEvents).toBe('auto');
  });

  it('clear', () => {
    component.clear();
    const container = component.get('container');
    expect(container.childNodes.length).toBe(0);
  });

  it('rerender', () => {
    const container = component.get('container');
    component.render();
    expect(container.childNodes.length).toBe(1);
    expect(container.childNodes[0].innerText).toBe(component.get('text'));
  });

  it('destroy', () => {
    component.destroy();
    expect(component.destroyed).toBe(true);
    expect(component.get('container')).toEqual(undefined);
  });
});
