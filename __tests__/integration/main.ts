import { Canvas } from '@antv/g';
import { Renderer as CanvasRenderer } from '@antv/g-canvas';
import { Renderer as SVGRenderer } from '@antv/g-svg';
import * as cases from './charts';

type Renderer = 'svg' | 'canvas';

class DemoHandler {
  #selectDemo: HTMLSelectElement;

  #selectRenderer: HTMLSelectElement;

  #canvas!: Canvas;

  #caseNames = Object.keys(cases);

  #render = {
    svg: new SVGRenderer(),
    canvas: new CanvasRenderer(),
  };

  private getCase(key = 'case') {
    return new URLSearchParams(window.location.search).get(key);
  }

  private initCanvas(container: HTMLElement, renderer: SVGRenderer | CanvasRenderer) {
    return new Promise((resolve) => {
      this.#canvas = new Canvas({
        container,
        width: 1000,
        height: 1000,
        renderer,
      });
      this.#canvas.addEventListener('ready', () => {
        resolve(null);
      });
    });
  }

  private selectCase(name: string) {
    const canvas = this.#canvas;
    const select = this.#selectDemo;
    if (!canvas || !this.#caseNames.includes(name)) return;
    canvas.removeChildren();
    // @ts-ignore
    canvas.appendChild(cases[name]());

    select.value = name;
    this.storeStatus(name);
  }

  private initDemoSelect() {
    if (!this.#selectDemo) return;
    this.#caseNames.forEach((caseName) => {
      const option = document.createElement('option');
      option.value = caseName;
      option.innerText = caseName;
      this.#selectDemo.appendChild(option);
    });
    this.#selectDemo.onchange = (e) => {
      const caseName = (e.target as HTMLInputElement).value;
      this.selectCase(caseName);
    };
  }

  private setRenderer(renderer: Renderer) {
    this.#canvas.setRenderer(this.#render[renderer]);
    this.#selectRenderer.value = renderer;
    localStorage.setItem('renderer', renderer);
  }

  private initRendererSelect() {
    Object.entries(this.#render).forEach(([r, i]) => {
      const option = document.createElement('option');
      option.value = r;
      option.innerText = r;
      this.#selectRenderer.appendChild(option);
    });
    const lastRenderer = localStorage.getItem('renderer') || 'svg';
    this.setRenderer(lastRenderer as Renderer);
    this.#selectRenderer.onchange = (e) => {
      const renderer = (e.target as HTMLInputElement).value as Renderer;
      this.setRenderer(renderer);
    };
  }

  private storeStatus(name: string) {
    if (this.getCase() !== name) {
      window.history.pushState({}, '', `${window.location.origin}?case=${name}`);
    }
  }

  private recoverStatus() {
    const lastSelect = this.getCase();
    if (lastSelect) {
      this.selectCase(lastSelect);
    } else {
      this.selectCase(this.#caseNames[0]);
    }
  }

  private onKeyPress(evt: KeyboardEvent) {
    const { key } = evt;
    const index = this.#caseNames.indexOf(this.#selectDemo.value);
    if (key === 's' && index < this.#caseNames.length - 1) {
      this.selectCase(this.#caseNames[index + 1]);
    } else if (key === 'w' && index > 0) {
      this.selectCase(this.#caseNames[index - 1]);
    }
  }

  private connectToPlugins() {
    if (!(window as any).__g_instances__) {
      (window as any).__g_instances__ = [];
    }
    (window as any).__g_instances__.push(this.#canvas);
  }

  constructor(container: HTMLElement) {
    this.#selectDemo = document.querySelector<HTMLSelectElement>('#select')!;
    this.#selectRenderer = document.querySelector<HTMLSelectElement>('#renderer')!;

    this.initCanvas(container, this.#render.svg).then(() => {
      this.initDemoSelect();

      this.initRendererSelect();

      this.connectToPlugins();

      this.recoverStatus();

      window.addEventListener('keypress', this.onKeyPress.bind(this));
    });
  }
}

window.onload = () => {
  const handler = new DemoHandler(document.getElementById('container')!);
};
