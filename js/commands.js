import executor from "./executors.js";

export default [
  {
    name: ["ls"],
    description: "Lists available shortcuts",
    options: {
      "blogs": {
        description: "Outputs a list of great blogs chosen by me."
      },
      "shortcuts": {
        description: "Outputs the shortcut list"
      },
    },
    execute: executor.ls,
  },
  {
    name: ["help"],
    description: "Lists available commands",
    execute: executor.help,
  },
  {
    name: ["clear"],
    description: "Clears the output history",
    execute: executor.clear,
  },
  {
    name: ["motd"],
    description: "Displays a random famous quote",
    execute: executor.motd,
  },
  {
    name: ["about"],
    description: "Prints information about anything",
    options: {
      "me": {
        description: "Information about me.",
      }
    },
    execute: executor.about,
  },
  {
    name: ["feed"],
    description: "Gets the latest blog posts of added blogs.",
    execute: executor.feed,
  }
];
