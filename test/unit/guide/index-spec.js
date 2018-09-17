const expect = require('chai').expect;
const Index = require('../../../src/guide/index');

describe('Guide', () => {
  it('Guide', () => {
    expect(Index).to.have.all.keys('Guide', 'Arc', 'DataMarker', 'DataRegion', 'Html', 'Image', 'Line', 'Region', 'Text');
  });
});
