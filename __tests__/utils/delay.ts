/**
 * 延迟函数
 * @param ms
 * @returns
 */
export async function delay(ms: number = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}
