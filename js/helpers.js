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

const getFeed = (feedUrl, blogName) => {
  let errorFlag = false;
  let html = `<p><span class="purple">Latest blog posts for ${blogName}:</span><pre>\n</pre>`;
  let count = -1;
  fetch(feedUrl)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
      const items = data.querySelectorAll("link");
      items.forEach(el => {
        count++;
        if (count < 2 || count > 4) return;
        console.log(el);
        let itemLink = el.attributes[0].textContent;
        if (el.attributes[3]) {
          let itemTitle = el.attributes[3].textContent;
          html += `<p><a class="shortcut" href="${itemLink}">${itemTitle}</a></p>`;
        }
      });
    })
    .catch((e) => {
      error("red", "Couldn't fetch data from feed.xml.");
      errorFlag = true;
      console.log(e);
    });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      html += `</p>`;
      resolve(html, errorFlag);
    }, 1000);
  });
};

export { render, error, getDate, dateDiffInMinutes, getFeed };


