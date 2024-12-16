// config.js - Configuration and constants
const CONFIG = {
  defaultText: `# Codepad
This is a simple web based text editor that is like a mashup of Window's notepad and Visual Studio Code. 

This brings advanced text editing tools like multi-line editing, regex search, code folding, variable suggestion to you. While in the editor, F1 will activate the Command Palette.

This may be installed as a PWA so that it can be used without an internet connection.

# Features
* No Autosaving - Restart from default text every time!
* Open - Open a text file from disk.
* Save As - Save any text you have to your disk.
* Edit Mode - A single editor pane
* Compare Mode - Splits the editor into two, so that lines may be compared
* Word Wrap - For those text files that don't respect your horizontal space.
* Dark Mode - Invert the color scheme
* Language Selection - Syntax highlighting from some popular coding languages

\`\`\` rust
// Use a markdown code block for other languages
\`\`\`

# Issues & Feature Requests \nIf you find any bugs, log it to the [issue page](https://github.com/asalimian/codepad/issues).`, // Your default text here

  editorDefaults: {
    language: "markdown",
    wordWrap: "on",
    theme: "vs",
  },

  filePickerOptions: {
    types: [{
      description: "Text",
      accept: {
        "text/*": [".txt", ".csv", ".log"],
      },
    }],
    excludeAcceptAllOption: true,
    multiple: false,
  },

  fileSaveOptions: {
    types: [{
      description: "Text file",
      accept: { "text/plain": [".txt"] },
    }],
  },
};
