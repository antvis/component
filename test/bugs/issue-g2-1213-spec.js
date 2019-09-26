const expect = require('chai').expect;
const G = require('@antv/g');
const Label = require('../../src/label');

const div = document.createElement('div');
div.id = 'defaultLabel';
document.body.appendChild(div);

const canvas = new G.Canvas({
  containerDOM: div,
  width: 990,
  height: 366
});

describe('G2 #1213', () => {
  it('label container dom leak', () => {
    const items = [
      { year: '1991',
        value: 15468,
        x: 80,
        y: 196.10128,
        text: '15468',
        start: { x: 80, y: 216.10128 },
        textAlign: 'center',
        _id: 'chart-geom1-line-glabel-0-15468',
        labelLine: false,
        htmlTemplate: '<div class="g-label" style="position:absolute;">{text}</div>'
      }];
    let label = new Label({
      canvas,
      items,
      config: false,
      useHtml: true
    });

    label.render();
    label.clear();
    expect(document.querySelectorAll('.g-labels').length).to.be.eql(1);

    label.destroy();
    expect(document.querySelectorAll('.g-labels').length).to.be.eql(0);

    label = new Label({
      canvas,
      items,
      config: false,
      useHtml: true
    });

    label.render();
    label.destroy();
    expect(document.querySelectorAll('.g-labels').length).to.be.eql(0);
  });
});
