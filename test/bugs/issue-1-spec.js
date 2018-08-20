const expect = require('chai').expect;
const component = require('../../src/index');

describe('#1', () => {
  it('description', () => {
    expect('component').to.be.a('string');
    expect(component).to.be.an('object');
  });
});
