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

const getFeed = (feedUrl) => {
  let posts = [];
  fetch(feedUrl)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("link");
      items.forEach(el => {
        let itemLink = el.attributes[0].textContent;
        let itemTitle = ""
        if (el.attributes[3]) {
          itemTitle = el.attributes[3].textContent;
        }
        posts.push([itemLink, itemTitle]);
      });
    });
  return posts;
};

export { render, error, getDate, dateDiffInMinutes, getFeed };


