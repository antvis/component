window.onload = () => statistic();

async function statistic() {
  const res = await fetch(`http://localhost:3000/statistic`, {
    method: 'POST',
  });
  const data = await res.json();

  const container = document.getElementById('container') as HTMLDivElement;
  container.style.height = '600px';
  container.style.width = '800px';

  const { Chart } = (window as any).G2;
  const chart = new Chart({
    container,
    autoFit: true,
  });

  const finalData = data
    .map(({ time, commitId, data: d }: any) =>
      d.map((datum: any) => ({ time: new Date(+time).toLocaleString(), commitId, ...datum }))
    )
    .flat();

  chart
    .interval()
    .data(finalData)
    .transform({ type: 'sortX', by: 'y', reverse: true, slice: 20 })
    .transform({ type: 'dodgeX' })
    .encode('x', 'name')
    .encode('y', 'median')
    .encode('color', 'time');

  chart.interaction('tooltip');

  chart.render();
}
