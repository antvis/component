import { Category } from '../../src/ui/legend/category';
import { createCanvas } from '../utils/render';

const canvas = createCanvas(800, undefined, true);
describe('Legend', () => {
  it('legend `autoWrap` without specify `maxRows`', () => {
    const legend = canvas.appendChild(
      new Category({
        style: {
          y: 5,
          items: [
            { id: 'Wholesale and Retail Trade', name: 'Wholesale and Retail Trade', color: '#5B8FF9' },
            { id: 'Manufacturing', name: 'Manufacturing', color: '#CDDDFD' },
            { id: 'Leisure and hospitality', name: 'Leisure and hospitality', color: '#5AD8A6' },
            { id: 'Business services', name: 'Business services', color: '#CDF3E4' },
            { id: 'Construction', name: 'Construction', color: '#5D7092' },
            { id: 'Education and Health', name: 'Education and Health', color: '#CED4DE' },
            { id: 'Government', name: 'Government', color: '#F6BD16' },
            { id: 'Finance', name: 'Finance', color: '#FCEBB9' },
            { id: 'Self-employed', name: 'Self-employed', color: '#6F5EF9' },
            { id: 'Other', name: 'Other', color: '#D3CEFD' },
            { id: 'Transportation and Utilities', name: 'Transportation and Utilities', color: '#6DC8EC' },
            { id: 'Information', name: 'Information', color: '#D3EEF9' },
            { id: 'Agriculture', name: 'Agriculture', color: '#945FB9' },
            { id: 'Mining and Extraction', name: 'Mining and Extraction', color: '#DECFEA' },
          ],
          maxWidth: 165,
          maxHeight: 64,
          // autoWrap: true,
          pageNavigator: {
            pageFormatter: (c, t) => `${c} / ${t}`,
          },
        },
      })
    );

    const pageInfo = legend.querySelector('.page-info')! as any;
    expect(pageInfo).toBeDefined();
    expect(pageInfo.style.text).not.toBe('1 / 1');
  });
});
