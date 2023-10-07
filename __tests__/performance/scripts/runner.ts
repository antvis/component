type Program = (start: () => void, end: () => void) => void;

function runner(program: Program) {
  return new Promise<number>((resolve) => {
    const key = new Date().getTime().toString();
    const start = () => performance.mark(key);
    const end = () => {
      performance.mark(`${key}-end`);
      const { duration } = performance.measure(key, key, `${key}-end`);
      resolve(duration);
    };
    program(start, end);
  });
}

export function scheduler(
  times: number = 1,
  options?: {
    beforeEach?: (taskIndex: number, iteraIndex: number) => Promise<void>;
    afterEach?: (taskIndex: number, iteraIndex: number) => Promise<void>;
  }
) {
  const tasks: Program[] = [];
  let running = false;
  return {
    async add(...task: Program[]): Promise<{ results: number[]; stat: Statistics }> {
      const results: number[] = [];
      let resolve: any;
      const promise = new Promise<{ results: number[]; stat: Statistics }>((r) => {
        resolve = r;
      });

      tasks.push(...task);
      if (!running) {
        running = true;
        const next = async () => {
          const task = tasks.shift();
          let index = 0;
          if (task) {
            const res: number[] = [];
            for (let i = 0; i < times; i += 1) {
              await options?.beforeEach?.(index, i);
              res.push(await runner(task));
              await options?.afterEach?.(index, i);
            }

            results.push(...res);
            index += 1;
            next();
          } else {
            running = false;
            resolve({ results, stat: statistic(results) });
          }
        };
        await next();
      }

      return promise;
    },
  };
}

type Statistics = {
  sum: number;
  mean: number;
  max: number;
  min: number;
  itera: number;
  median: number;
};

export function statistic(results: number[]): Statistics {
  const sum = results.reduce((acc, cur) => acc + cur, 0);
  const mean = sum / results.length;
  const max = Math.max(...results);
  const min = Math.min(...results);
  const median = results.sort((a, b) => a - b)[Math.floor(results.length / 2)];
  return { sum, mean, max, min, median, itera: results.length };
}
