/* eslint-disable no-restricted-syntax */
import * as fs from 'fs';
import { Canvas, resetEntityCounter } from '@antv/g';
import { serializeToString } from 'xmlserializer';
import { optimize } from 'svgo';
import * as tests from './components';
import { renderCanvas, sleep } from './canvas';
import { fetch } from './fetch';

const format = (svg: SVGElement) => {
  return optimize(serializeToString(svg as any), {
    js2svg: {
      pretty: true,
      indent: 2,
    },
    plugins: [
      'cleanupIds',
      'cleanupAttrs',
      'sortAttrs',
      'sortDefsChildren',
      'removeUselessDefs',
      {
        name: 'convertPathData',
        params: {
          floatPrecision: 4,
          forceAbsolutePath: true,

          applyTransforms: false,
          applyTransformsStroked: false,
          straightCurves: false,
          convertToQ: false,
          lineShorthands: false,
          convertToZ: false,
          curveSmoothShorthands: false,
          smartArcRounding: false,
          removeUseless: false,
          collapseRepeated: false,
          utilizeAbsolute: false,
          negativeExtraSpace: false,
        },
      },
      {
        name: 'convertTransform',
        params: {
          floatPrecision: 4,

          convertToShorts: false,
          matrixToTransform: false,
          shortTranslate: false,
          shortScale: false,
          shortRotate: false,
          removeUseless: false,
          collapseIntoOne: false,
        },
      },
      {
        name: 'cleanupNumericValues',
        params: {
          floatPrecision: 4,
        },
      },
    ],
  }).data;
};

// @ts-ignore
global.fetch = fetch;

describe('integration', () => {
  const onlyTests = Object.entries(tests).filter(
    // @ts-ignore
    ([, { only = false }]) => only
  );

  const finalTests = onlyTests.length === 0 ? tests : Object.fromEntries(onlyTests);

  if (!fs.existsSync(`${__dirname}/snapshots`)) {
    fs.mkdirSync(`${__dirname}/snapshots`);
  }

  for (const [name, target] of Object.entries(finalTests)) {
    // @ts-ignore
    if (!target.skip) {
      it(`[Canvas]: ${name}`, async () => {
        resetEntityCounter();
        let canvas: Canvas | undefined;
        let actual: string;
        try {
          const actualPath = `${__dirname}/snapshots/${name}-actual.svg`;
          const expectedPath = `${__dirname}/snapshots/${name}.svg`;
          const options = target();
          // @ts-ignore
          const wait = target.wait;
          canvas = await renderCanvas(options, wait);
          const container = canvas.getConfig().container as HTMLElement;
          const dom = container.querySelector('svg');

          actual = format(dom as SVGElement);

          // Remove ';' after format by babel.
          if (actual !== 'null') actual = actual.slice(0, -2);

          // Generate golden png if not exists.
          if (!fs.existsSync(expectedPath)) {
            if (process.env.CI === 'true') {
              throw new Error(`Please generate golden image for ${name}`);
            }
            console.warn(`! generate ${name}`);
            fs.writeFileSync(expectedPath, actual);
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
