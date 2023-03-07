import { Canvas as GCanvas, CanvasEvent, Circle, ElementEvent, Path, Rect, Text, type DisplayObject } from '@antv/g';
import { Renderer } from '@antv/g-canvas';
import { scheduler } from './runner';

import * as _Cases from '../../integration/components';

const Cases = {
  ..._Cases,
  Rect: () => {
    return new Rect({
      style: {
        x: 100 * Math.random(),
        y: 100 * Math.random(),
        width: 100 * Math.random(),
        height: 100 * Math.random(),
        fill: 'red',
      },
    });
  },
  Circle: () => {
    return new Circle({
      style: {
        cx: 100 * Math.random(),
        cy: 100 * Math.random(),
        r: 100 * Math.random(),
        fill: 'red',
      },
    });
  },
  Text: () => {
    return new Text({
      style: {
        x: 100 * Math.random(),
        y: 100 * Math.random(),
        text: Math.random().toString(36).substring(2, 15),
      },
    });
  },
  Path: () => {
    return new Path({
      style: {
        path: [
          ['M', 100 * Math.random(), 100 * Math.random()],
          ['L', 100 * Math.random(), 100 * Math.random()],
          ['L', 100 * Math.random(), 100 * Math.random()],
          ['Z'],
        ],
      },
    });
  },
};

let casesToRun: Record<string, any> = Cases;

window.onload = async () => {
  const commitId = await getCommitId();
  document.getElementById('commit-id')?.appendChild(document.createTextNode(`commitId: ${commitId}`));
  renderSelect();
  bindEvents();
};

let wait = 0;

async function getCommitId() {
  const commitId = await fetch('http://localhost:3000/commitId');
  return commitId.text();
}

function bindEvents() {
  // #preview is checkbox
  document.getElementById('preview')?.addEventListener('click', async (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) wait = 20;
    else wait = 0;
  });

  document.getElementById('launch')?.addEventListener('click', async () => {
    const result = await launch(10);
    report(result);
  });

  document.getElementById('select')?.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const name = target.value;
    if (name !== '全量测试') casesToRun = { [name]: (Cases as any)[name] };
    else casesToRun = Cases;
  });
}

class Canvas {
  private container: HTMLDivElement;

  private canvas: GCanvas;

  private nodes: DisplayObject[] = [];

  public readonly ready: Promise<void>;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.canvas = new GCanvas({ container, width: 800, height: 600, renderer: new Renderer() });
    // (window as any).__g_instances__ = [this.canvas];
    let resolveReady: () => void;
    this.ready = new Promise((resolve) => {
      resolveReady = resolve;
    });
    this.canvas.addEventListener(CanvasEvent.READY, () => {
      resolveReady();
    });
  }

  public async destroyCanvas() {
    await this.destroyChildren();
    this.canvas.destroy();
    this.container.innerHTML = '';
  }

  public async destroyChildren() {
    const promises: Promise<any>[] = [];
    const resolves: ((value: null) => void)[] = [];
    this.nodes.forEach((node, i) => {
      const promise = new Promise((resolve) => {
        resolves[i] = resolve;
      });
      promises.push(promise);
      node.addEventListener(ElementEvent.DESTROY, () => {
        resolves[i](null);
      });
    });
    this.canvas.destroyChildren();
    await Promise.all(promises);
    this.nodes = [];
  }

  public render(node: DisplayObject, clear: boolean = false): Promise<null> {
    return new Promise((resolve) => {
      if (clear) this.canvas.destroyChildren();
      node.isMutationObserved = true;
      node.addEventListener(ElementEvent.MOUNTED, () => {
        resolve(null);
      });
      this.canvas.appendChild(node);
    });
  }
}

function initCanvas() {
  const container = document.getElementById('container') as HTMLDivElement;
  const canvas = new Canvas(container);
  return canvas;
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function renderSelect() {
  const select = document.getElementById('select') as HTMLSelectElement;
  const options = ['全量测试', ...Object.keys(Cases)].map((name) => {
    const option = document.createElement('option');
    option.value = name;
    option.innerText = name;
    return option;
  });
  select.append(...options);
}

async function dispatcher(tasks: Record<string, () => DisplayObject>, itera: number) {
  (globalThis as any).disableInterval = true;
  const s = scheduler(itera, {
    afterEach: async () => {
      if (wait) await sleep(wait);
      return Promise.resolve();
    },
  });

  const results: Record<string, any> = {};
  const total = Object.keys(tasks).length;
  let curr = 1;
  for (const [name, task] of Object.entries(tasks)) {
    const canvas = initCanvas();
    await canvas.ready;
    console.log(
      'progress: ',
      `${curr}/${total}`,
      ', task: ',
      name,
      ', memory: ',
      // @ts-ignore
      `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`
    );

    const result = await s.add(async (start, end) => {
      start();
      await canvas.render(task());
      end();
    });
    await canvas.destroyCanvas();
    results[name] = result;
    curr += 1;
  }
  document.dispatchEvent(new CustomEvent('start-task', { detail: { name: 'done', total, curr } }));
  document.dispatchEvent(new CustomEvent('all-task-done'));
  return results;
}

async function launch(itera = 1) {
  const result = await dispatcher(Object.fromEntries(Object.entries(casesToRun)), itera);
  return result;
}

function uploadReport(data: Record<string, any>) {
  const button = document.getElementById('upload')!;
  button.onclick = async () => {
    const res = await fetch('http://localhost:3000/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    console.log(json);

    if (json.success) {
      alert('上传成功');
      const redirect = window.confirm('是否跳转到报告页面？');
      if (redirect) {
        window.open(`${window.location.origin}/report.html`, '_blank');
      }
    }
  };
}

function visualize(result: Record<string, any>) {
  // render chart
  let container = document.getElementById('chart');
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.id = 'chart';
  container.style.width = '600px';
  container.style.height = '400px';

  const { Chart } = (window as any).G2;
  const chart = new Chart({ container, autoFit: true, title: '测试结果' });
  chart
    .interval()
    .data(Object.entries(result).map(([name, res]) => ({ name, ...res.stat })))
    .encode('x', 'name')
    .encode('y', 'median');
  chart.interaction('tooltip');
  chart.render();

  // create html table
  container = document.getElementById('table');
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.id = 'table';
  container.style.maxHeight = '400px';
  container.style.overflow = 'auto';
  container.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>任务</th>
          <th>最小值</th>
          <th>最大值</th>
          <th>中位数</th>
          <th>平均值</th>
          <th>测试次数</th>
        </tr>
      </thead>
      <tbody>
        ${Object.entries(result)
          .map(([name, res]) => {
            const { stat } = res;
            return `
              <tr>
                <td>${name}</td>
                <td>${stat.min.toFixed(4)}</td>
                <td>${stat.max.toFixed(4)}</td>
                <td>${stat.median.toFixed(4)}</td>
                <td>${stat.mean.toFixed(4)}</td>
                <td>${stat.itera}</td>
              </tr>
            `;
          })
          .join('')}
      </tbody>
    </table>
  `;
}

async function report(result: Record<string, any>) {
  visualize(result);
  uploadReport(result);
}
