import { dateDiffInMinutes, error, render, getFeed } from "./helpers.js";
import shortcuts from "./shortcuts.js";
import blogs from "./blogs.js";
import abouts from "./about.js";
import projects from "./projects.js";

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

function ls_projects() {
  let projectsOutput = '<div class="shortcuts-container">';
  projects.forEach((s) => {
    projectsOutput += `<div class="shortcuts"><p class="${s.color}">~/${s.category}</p>`;
    Object.entries(s.items).forEach(([name, url_desc]) => {
      projectsOutput += `<p><span class="${s.color}">> </span><a class="shortcut" href="${url_desc["url"]}">${name}</a>: ${url_desc["description"]}</p>`;
    });
    projectsOutput += "</div>";
  });
  render(projectsOutput + "</div>");
}

export default {
  echo: (options) => {
    var echoStr = options.join(" ");
    render(echoStr, true);
  },
  feed: (options) => {
    if (options.length == 0) {
      error("yellow", "Please specify an option.");
      return;
    }
    if (options.length > 1) {
      error("yellow", "More than one option. Abort!");
      return;
    }
    blogs.forEach((s) => {
      Object.entries(s.items).forEach(([blogName, blogInfo]) => {
        let blogNameArray = blogName.split(" ");
        if (blogNameArray[0].toLowerCase() == options[0]) {
          if (!blogInfo.feed) {
            error("yellow", "There is no feed for that blog.");
            return;
          }
          let feedOutput = getFeed(blogInfo.feed, blogName);
          feedOutput.then((html) => {
            if (html == "fetch error</p>") return;
            render(html);
          });
        }
      });
    });
  },
  about: (options) => {
    if (options.length == 0) {
      error("yellow", "Please specify an option.");
    } else if (options.length > 1) {
      error("yellow", "More than one option. Abort!");
    } else {
      let aboutOutput = "";
      abouts.forEach((s) => {
        if (options[0] == s.name) {
          aboutOutput += `<p>${s.info}</p><pre>\n</pre>`;
        }
      });
      if (aboutOutput == "") {
        error("yellow", "Invalid option.");
      } else 
        render(aboutOutput);
    }
  },
  motd: () => {
    let cachedQuote = localStorage.getItem("cachedQuote");
    if (cachedQuote) {
      cachedQuote = JSON.parse(cachedQuote);
      if (dateDiffInMinutes(parseInt(cachedQuote.fetchedAt), Date.now()) < 10) {
        render(`<p>"${cachedQuote.content}" - ${cachedQuote.author}</p>`);
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
      console.log(options);
      if (options[0] == "shortcuts") ls_shortcuts();
      else if (options[0] == "blogs") ls_blogs();
      else if (options[0] == "projects") ls_projects();
      else error("yellow", "Given option invalid.");
    } else {
      error("red", "I don't know what happened.");
    }
  },
  help: (cmdList, options) => {
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
            Object.entries(c.options).forEach(([option_name, option_desc]) => {
              let paddedOption = option_name.padEnd(padToLen, " ").replaceAll(" ", "&nbsp;");
              helpMessage += `<p><span class="purple">${paddedOption}</span>&nbsp;&nbsp;&nbsp;&nbsp;${option_desc.description}</p>`
            });
          }
          helpMessage += `</p>`;
          return;
        }
      });
      if (helpMessage == "") {
        error("yellow", "There is no such option.");
      } else 
        render(helpMessage, false);
    }
  },
  clear: () => {
    output.innerHTML = "";
    input.focus();
  },
};
