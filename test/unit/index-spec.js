const expect = require('chai').expect;
const component = require('../../src/index');

describe('sample', () => {
  it('component', () => {
    expect('component').to.be.a('string');
    expect(component).to.be.an('object');
  });
});
