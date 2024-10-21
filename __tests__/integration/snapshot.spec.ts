import * as fs from 'fs';
import { Canvas, resetEntityCounter } from '@antv/g';
import { format } from 'prettier';
import xmlserializer from 'xmlserializer';
import * as tests from './components';
import { renderCanvas, sleep } from './canvas';
import { fetch } from './fetch';

// @ts-ignore
global.fetch = fetch;

const removeId = (svg: string, reserved?: Map<string, number>) => {
  if (!reserved) return svg.replace(/ *id="[^"]*" */g, ' ');
  return svg.replace(/ *id="([^"]*)" *| *href="#([^"]*)" *|url\(#([^"]*)\)/g, (match, id, href, url) => {
    const value = id || href || url;
    const index = reserved.get(value);
    if (index !== undefined) return match.replace(value, `ref-${index}`);
    return ' ';
  });
};

const formatSVG = (svg: string) => {
  if (!svg.includes('<defs>')) return svg; // svg defs, it's a little complex to handle

  let counter = 0;
  const refs = new Map<string, number>();

  svg.match(/href="#[^"]*"/g)?.forEach((ref) => refs.set(ref.slice(7, -1), counter++));

  const [before, after] = svg.split('</defs>');

  return `${before}</defs>${removeId(after, refs)}`.replace(/\r\n|\n\s+\n/g, '\n');
};

describe('integration', () => {
  const onlyTests = Object.entries(tests).filter(
    // @ts-ignore
    ([, { only = false }]) => only
  );

  const finalTests = onlyTests.length === 0 ? tests : Object.fromEntries(onlyTests);

  if (!fs.existsSync(`${__dirname}/snapshots`)) {
    fs.mkdirSync(`${__dirname}/snapshots`);
  }

  beforeEach(() => {
    resetEntityCounter();
  });

  for (const [name, target] of Object.entries(finalTests)) {
    // @ts-ignore
    if (!target.skip) {
      it(`[Canvas]: ${name}`, async () => {
        let canvas: Canvas | undefined;
        let actual: string;
        try {
          const actualPath = `${__dirname}/snapshots/${name}-actual.svg`;
          const expectedPath = `${__dirname}/snapshots/${name}.svg`;
          const options = await target();
          // @ts-ignore
          const wait = target.wait;
          canvas = await renderCanvas(options, wait);
          const container = canvas.getConfig().container as HTMLElement;
          const dom = container.querySelector('svg');

          actual = await format(formatSVG(xmlserializer.serializeToString(dom as any)), {
            parser: 'babel',
          });

          // Remove ';' after format by babel.
          if (actual !== 'null') actual = actual.slice(0, -2);

          // Generate golden png if not exists.
          if (!fs.existsSync(expectedPath)) {
            if (process.env.CI === 'true') {
              throw new Error(`Please generate golden image for ${name}`);
            }
            console.warn(`! generate ${name}`);
            await fs.writeFileSync(expectedPath, actual);
          } else {
            const expected = fs.readFileSync(expectedPath, {
              encoding: 'utf8',
              flag: 'r',
            });

            if (actual === expected) {
              if (fs.existsSync(actualPath)) fs.unlinkSync(actualPath);
            } else {
              if (actual) fs.writeFileSync(actualPath, actual);
            }

            expect(expected).toBe(actual);
          }
        } finally {
          if (canvas) canvas.destroy();
          sleep(100);
        }
      });
    }
  }

  afterAll(() => {
    // @ts-ignore
    delete global.fetch;
  });
});
