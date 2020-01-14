export const createDiv = (id: string) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  div.id = id;

  return div;
};
