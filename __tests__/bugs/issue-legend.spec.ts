import { Category } from '../../src/ui/legend/category';
import { createCanvas } from '../utils/render';

const canvas = createCanvas(800, 'svg', true);
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
          pageNavigator: {
            pageFormatter: (c: any, t: any) => `${c} / ${t}`,
          },
        },
      })
    );

    const pageInfo = legend.querySelector('.page-info')! as any;
    expect(pageInfo).toBeDefined();
    expect(pageInfo.style.text).not.toBe('1 / 1');

    legend.update({ maxWidth: 565, maxItemWidth: 120, itemWidth: 120, autoWrap: true, maxRows: 3 });
    const items = legend.querySelectorAll('.legend-item') as any[];
    expect(items[1].getLocalBounds().min[0]).toBe(items[5].getLocalBounds().min[0]);

    legend.destroy();
  });

  it('legend do not show pageNavigator when maxPages is 1.', () => {
    const legend = canvas.appendChild(
      new Category({
        style: {
          x: 0,
          y: 5,
          items: [
            { name: '事例一', color: '#4982f8' },
            { name: '事例二', color: '#41d59c' },
            { name: '事例三', color: '#516587' },
            { name: '事例四', color: '#f9b41b' },
            { name: '事例五', color: '#624ef7' },
          ],
          maxWidth: 220,
          autoWrap: true,
        },
      })
    );

    expect((legend.querySelector('.page-button-group') as any)!.style.visibility).toBe('hidden');
  });
});
