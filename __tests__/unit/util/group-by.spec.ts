import { groupBy } from '../../../src/util';

describe('group by', () => {
  const data = [
    { id: '1', index: 0, style: { label: '1-label' }, page: 0, row: 0, col: 0 },
    { id: '2', index: 1, style: { label: '2-label' }, page: 0, row: 0, col: 1 },
    { id: '3', index: 2, style: { label: '3-label' }, page: 0, row: 0, col: 2 },
    { id: '4', index: 3, style: { label: '4-label' }, page: 0, row: 0, col: 3 },
    { id: '5', index: 4, style: { label: '5-label' }, page: 0, row: 0, col: 4 },
    { id: '6', index: 5, style: { label: '6-label' }, page: 0, row: 0, col: 5 },
    { id: '7', index: 6, style: { label: '7-label' }, page: 0, row: 0, col: 6 },
    { id: '8', index: 7, style: { label: '8-label' }, page: 0, row: 0, col: 7 },
    { id: '9', index: 8, style: { label: '9-label' }, page: 0, row: 1, col: 0 },
    { id: '10', index: 9, style: { label: '10-label' }, page: 0, row: 1, col: 1 },
    { id: '11', index: 10, style: { label: '11-label' }, page: 0, row: 1, col: 2 },
    { id: '12', index: 11, style: { label: '12-label' }, page: 0, row: 1, col: 3 },
    { id: '13', index: 12, style: { label: '13-label' }, page: 0, row: 1, col: 4 },
    { id: '14', index: 13, style: { label: '14-label' }, page: 0, row: 1, col: 5 },
    { id: '15', index: 14, style: { label: '15-label' }, page: 0, row: 1, col: 6 },
    { id: '16', index: 15, style: { label: '16-label' }, page: 0, row: 1, col: 7 },
    { id: '17', index: 16, style: { label: '17-label' }, page: 1, row: 0, col: 0 },
    { id: '18', index: 17, style: { label: '18-label' }, page: 1, row: 0, col: 1 },
    { id: '19', index: 18, style: { label: '19-label' }, page: 1, row: 0, col: 2 },
    { id: '20', index: 19, style: { label: '20-label' }, page: 1, row: 0, col: 3 },
  ];

  const target = {
    '0': [
      { id: '1', index: 0, style: { label: '1-label' }, page: 0, row: 0, col: 0 },
      { id: '2', index: 1, style: { label: '2-label' }, page: 0, row: 0, col: 1 },
      { id: '3', index: 2, style: { label: '3-label' }, page: 0, row: 0, col: 2 },
      { id: '4', index: 3, style: { label: '4-label' }, page: 0, row: 0, col: 3 },
      { id: '5', index: 4, style: { label: '5-label' }, page: 0, row: 0, col: 4 },
      { id: '6', index: 5, style: { label: '6-label' }, page: 0, row: 0, col: 5 },
      { id: '7', index: 6, style: { label: '7-label' }, page: 0, row: 0, col: 6 },
      { id: '8', index: 7, style: { label: '8-label' }, page: 0, row: 0, col: 7 },
      { id: '9', index: 8, style: { label: '9-label' }, page: 0, row: 1, col: 0 },
      { id: '10', index: 9, style: { label: '10-label' }, page: 0, row: 1, col: 1 },
      { id: '11', index: 10, style: { label: '11-label' }, page: 0, row: 1, col: 2 },
      { id: '12', index: 11, style: { label: '12-label' }, page: 0, row: 1, col: 3 },
      { id: '13', index: 12, style: { label: '13-label' }, page: 0, row: 1, col: 4 },
      { id: '14', index: 13, style: { label: '14-label' }, page: 0, row: 1, col: 5 },
      { id: '15', index: 14, style: { label: '15-label' }, page: 0, row: 1, col: 6 },
      { id: '16', index: 15, style: { label: '16-label' }, page: 0, row: 1, col: 7 },
    ],
    '1': [
      { id: '17', index: 16, style: { label: '17-label' }, page: 1, row: 0, col: 0 },
      { id: '18', index: 17, style: { label: '18-label' }, page: 1, row: 0, col: 1 },
      { id: '19', index: 18, style: { label: '19-label' }, page: 1, row: 0, col: 2 },
      { id: '20', index: 19, style: { label: '20-label' }, page: 1, row: 0, col: 3 },
    ],
  };

  it('should group by page', () => {
    expect(groupBy(data, 'page')).toEqual(target);
  });
});
