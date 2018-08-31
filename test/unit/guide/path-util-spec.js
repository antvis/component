const expect = require('chai').expect;
const PathUtil = require('../../../src/guide/path-util');

describe('convertPolarPath', () => {
  it('convertPolarPath', function() {
    const coord = {
      start: { x: 0, y: 0 },
      end: { x: 200, y: 200 },
      center: { x: 100, y: 100 },
      circleCentre: { x: 100, y: 100 },
      startAngle: -0.5 * Math.PI,
      endAngle: 1.5 * Math.PI,
      isPolar: true,
      isTransposed: false,
      x: { start: -0.5 * Math.PI, end: 1.5 * Math.PI },
      y: { start: 0, end: 100 },
      convertDim(percent, dim) {
        const { start, end } = this[dim];
        return start + percent * (end - start);
      },
      convert(point) {
        const center = this.center;
        let x = this.isTransposed ? point.y : point.x;
        let y = this.isTransposed ? point.x : point.y;

        x = this.convertDim(x, 'x');
        y = this.convertDim(y, 'y');

        return {
          x: center.x + Math.cos(x) * y,
          y: center.y + Math.sin(x) * y
        };
      },
      convertPoint(point) {
        const center = this.center;
        let x = this.isTransposed ? point.y : point.x;
        let y = this.isTransposed ? point.x : point.y;

        x = this.convertDim(x, 'x');
        y = this.convertDim(y, 'y');

        return {
          x: center.x + Math.cos(x) * y,
          y: center.y + Math.sin(x) * y
        };
      },
      getCenter() {
        return this.circleCentre;
      }
    };
    const path = [[ 'M', 0, 0 ], [ 'L', 0, 1 ], [ 'L', 0.25, 1 ]];
    const toPath = PathUtil.convertPolarPath(coord, path);
    expect(toPath).eqls([[ 'M', 100, 100 ], [ 'L', 100, 0 ], [ 'A', 100, 100, 0, 0, 1, 200, 100 ]]);
  });
});
