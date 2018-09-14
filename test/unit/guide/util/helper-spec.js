const expect = require('chai').expect;
const Helper = require('../../../../src/guide/util/helper');

describe('Helper', () => {
  it('getFirstScale', () => {
    const scales = {
      a: 2,
      b: 3
    };
    const result = Helper.getFirstScale(scales);
    expect(result).to.equal(2);
  });
});
