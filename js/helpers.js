const dateDiffInMinutes = (a, b) => {
  a = parseInt(a);
  b = parseInt(b);
  const _MS_PER_MIN = 1000 * 60;
  let res = Math.floor((b - a) / _MS_PER_MIN);
  return res;
};

const render = (text, needsMarkup = true) => {
  if (needsMarkup) {
    output.innerHTML += `<p>${text}</p>`;
  } else {
    output.innerHTML += text;
  }
  input.focus();
};

const error = (color, message) => {
  render(`<p><span class="${color}">${message}</span></p>`);
};

const getDate = () => {};

export { render, error, getDate, dateDiffInMinutes };
