type RGB = [number, number, number];

export function gradient(startColor: RGB, endColor: RGB, step: number) {
  const rStep = (endColor[0] - startColor[0]) / step;
  const gStep = (endColor[1] - startColor[1]) / step;
  const bStep = (endColor[2] - startColor[2]) / step;

  const gradientColorArr: RGB[] = [];
  for (let i = 0; i < step; i++) {
    gradientColorArr.push([
      Math.floor(rStep * i + startColor[0]),
      Math.floor(gStep * i + startColor[1]),
      Math.floor(bStep * i + startColor[2]),
    ]);
  }
  return gradientColorArr;
}
