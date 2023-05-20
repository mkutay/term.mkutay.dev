import { dateDiffInMinutes, error, getWeather, render } from "./helpers.js";
import shortcuts from "./shortcuts.js";
import blogs from "./blogs.js";

function ls_shortcuts() {
  let shortcutsOutput = '<div class="shortcuts-container">';
  shortcuts.forEach((s) => {
    shortcutsOutput += `<div class="shortcuts"><p class="${s.color}">~/${s.category}</p>`;
    Object.entries(s.items).forEach(([name, link]) => {
      shortcutsOutput += `<p><span class="${s.color}">> </span><a class="shortcut" href="${link}">${name}</a></p>`;
    });
    shortcutsOutput += "</div>";
  });
  render(shortcutsOutput + "</div>");
}

function ls_blogs() {
  let blogsOutput = '<div class="shortcuts-container">';
  blogs.forEach((s) => {
    blogsOutput += `<div class="shortcuts"><p class="${s.color}">~/${s.category}</p>`;
    Object.entries(s.items).forEach(([name, url_desc]) => {
      blogsOutput += `<p><span class="${s.color}">> </span><a class="shortcut" href="${url_desc["url"]}">${name}</a>: ${url_desc["description"]}</p>`;
    });
    blogsOutput += "</div>";
  });
  render(blogsOutput + "</div>");
}

export default {
  motd: () => {
    let cachedQuote = localStorage.getItem("cachedQuote");
    if (cachedQuote) {
      cachedQuote = JSON.parse(cachedQuote);
      if (dateDiffInMinutes(parseInt(cachedQuote.fetchedAt), Date.now()) < 10) {
        render(`"${cachedQuote.content}" - ${cachedQuote.author}`);
        return;
      }
    }
    fetch("https://api.quotable.io/random?tags=technology")
      .then((res) => res.json())
      .then((data) => {
        render(`"${data.content}" - ${data.author}`);
        localStorage.setItem(
          "cachedQuote",
          JSON.stringify({
            content: data.content,
            author: data.author,
            fetchedAt: Date.now().toString(),
          })
        );
      });
  },
  weather: (options) => {
    let usage = `
          <p>Usage: weather [set key &lt;key&gt;] [set loc &lt;city,state,country&gt;]</p>
          <p>If no options are provided, the current weather forecast will be displayed</p>
          <p>Options:</p>
          <p>key : obtain a key from <a class="shortcut" href="https://openweathermap.org">https://openweathermap.org</a></p>
          <p>loc : comma-separated list of city name, state code (omit if outside the US), and ISO-3166 country code</p>
           `;
    if (!options || options.length === 0) {
      return getWeather();
    } else if (options[0] === "set") {
      if (options[1] === "key") {
        localStorage.setItem("WEATHER_API_KEY", options[2]);
        render(`Weather API key was set to ${options[2]}`);
      } else if (options[1] === "loc") {
        localStorage.setItem("loc", options[2]);
        render(`Location set to ${options[2]}`);
      } else render(usage, false);
    } else {
      render(usage, false);
    }
  },
  search: (options) => {
    const query = options.join(" ") || null;
    if (query) {
      window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(
        query
      )}`;
    } else {
      render("No query, redirecting to DDG!");
      window.location.href = "https://duckduckgo.com";
    }
  },
  ls: (options) => {
    if (!options) {
      ls_shortcuts();
      return;
    }
    if (options.length > 1) {
      error("yellow", "More than one options. Abort!");
    } else if (shortcuts && options.length === 0) {
      if (shortcuts)
        ls_shortcuts();
      else
        error("yellow", "No shortcuts added.");
    } else if (options.length == 1){
      if (options[0] == "shortcuts") ls_shortcuts();
      else if (options[0] == "blogs") ls_blogs();
      else error("yellow", "Option invalid.");
    } else {
      error("red", "I don't know what happened.");
    }
  },
  help: (cmdList, options) => {
    console.log(cmdList);
    console.log(options);
    if (options.length > 1) {
      error("yellow", "More than one options. Abort!");
    } else if (options.length == 0) {
      let padToLen = Math.max(...cmdList.map((c) => c.name.join("|").length));
      let helpMessage = "";
      cmdList.forEach((c) => {
        let paddedCommand = c.name
          .join("|")
          .padEnd(padToLen, " ")
          .replaceAll(" ", "&nbsp;");
        helpMessage += `<p><span class="cyan">${paddedCommand}</span>&nbsp;&nbsp;&nbsp;&nbsp;${c.description}</p>`;
      });
      render(helpMessage, false);
    } else { // options
      let helpMessage = "";
      cmdList.forEach((c) => {
        if (options[0] == c.name || options[0] in c.name) {
          helpMessage = `<p><span class="cyan">${c.name}</span>: ${c.description}`;
          if (c.options) {
            helpMessage += `<pre>\n</pre>`;
            let padToLen = 0;
            Object.entries(c.options).forEach(([option_name, option_desc]) => {
              padToLen = Math.max(padToLen, option_name.length);
            });
            console.log(padToLen);
            Object.entries(c.options).forEach(([option_name, option_desc]) => {
              let paddedOption = option_name.padEnd(padToLen, " ").replaceAll(" ", "&nbsp;");
              helpMessage += `<p><span class="purple">${paddedOption}</span>&nbsp;&nbsp;&nbsp;&nbsp;${option_desc}</p>`
            });
          }
          helpMessage += `</p>`;
          return;
        }
      });
      render(helpMessage, false);
    }
  },
  clear: () => {
    output.innerHTML = "";
    input.focus();
  },
};
