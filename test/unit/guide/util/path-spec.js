const expect = require('chai').expect;
const Coord = require('@antv/coord');
const PathUtil = require('../../../../src/guide/util/path');

describe('convertPolarPath', () => {
  it('convertPolarPath', function() {
    const coord = new Coord.Polar({
      start: { x: 0, y: 0 },
      end: { x: 200, y: 200 },
      startAngle: -0.5 * Math.PI,
      endAngle: 1.5 * Math.PI
    });
    const path = [[ 'M', 0, 0 ], [ 'L', 0, 1 ], [ 'L', 0.25, 1 ]];
    const toPath = PathUtil.convertPolarPath(coord, path);
    expect(toPath).eqls([[ 'M', 100, 100 ], [ 'L', 100, 0 ], [ 'A', 100, 100, 0, 0, 1, 200, 100 ]]);
  });
});
