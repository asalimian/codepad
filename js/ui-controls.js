// ui-controls.js - UI event handling and controls
class UIController {
  constructor(editorManager, fileHandler) {
    this.editorManager = editorManager;
    this.fileHandler = fileHandler;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // File operations
    document.getElementById("newPage").addEventListener("click", () => {
      this.editorManager.createEditor();
    });

    document.getElementById("openFile").addEventListener("click", () => {
      this.fileHandler.openFile();
    });

    document.getElementById("saveFile").addEventListener("click", () => {
      this.fileHandler.saveFile();
    });

    // Editor mode toggle
    document.getElementById("toggle").addEventListener("change", (e) => {
      if (e.target.checked) {
        this.enableDiffMode();
      } else {
        this.enableEditMode();
      }
    });

    document.getElementById("editModeBtn").addEventListener("click", () => {
      document.getElementById("toggle").checked = false;
      this.enableEditMode();
    });

    document.getElementById("compareModeBtn").addEventListener("click", () => {
      document.getElementById("toggle").checked = true;
      this.enableDiffMode();
    });

    // Syntax highlighting
    document.getElementById("syntax").addEventListener("change", (e) => {
      this.editorManager.updateLanguage(e.target.value);
    });

    // Theme toggle
    document.getElementById("themeToggle").addEventListener("click", (e) => {
      this.editorManager.toggleTheme();
      this.updateThemeUI(e.target);
    });

    // Word wrap toggle
    document.getElementById("wrapToggle").addEventListener("click", (e) => {
      this.editorManager.toggleWordWrap();
      console.log(e.target);
      this.updateWrapUI(e.target);
    });

    // Window resize handler
    self.addEventListener("resize", () => {
      this.editorManager.currentEditor?.layout();
    });
  }

  enableDiffMode() {
    const content = this.editorManager.getCurrentContent();
    let originalText, modifiedText;

    if (typeof content === "string" && content.includes("<<<<<<< Original")) {
      // Split the concatenated content
      const parts = content.split("\n");
      let isOriginal = false;
      let isModified = false;

      originalText = [];
      modifiedText = [];

      for (const line of parts) {
        if (line === "<<<<<<< Original") {
          isOriginal = true;
          continue;
        }
        if (line === "=======") {
          isOriginal = false;
          isModified = true;
          continue;
        }
        if (line.startsWith(">>>>>>>")) {
          isModified = false;
          continue;
        }

        if (isOriginal) {
          originalText.push(line);
        }
        if (isModified) {
          modifiedText.push(line);
        }
      }

      originalText = originalText.join("\n").trim();
      modifiedText = modifiedText.join("\n").trim();
    } else {
      // If no conflict markers, use same content for both sides
      originalText = typeof content === "string" ? content : content.original;
      modifiedText = typeof content === "string" ? content : content.modified;
    }

    this.editorManager.createDiffEditor(originalText, modifiedText);
  }

  enableEditMode() {
    const content = this.editorManager.getCurrentContent();
    let finalText;

    if (typeof content === "object" && content.original !== content.modified) {
      // Concatenate original and modified versions with conflict markers
      finalText = [
        "<<<<<<< Original",
        content.original.trim(),
        "=======",
        content.modified.trim(),
        ">>>>>>>",
      ].join("\n");
    } else {
      // If content is the same in both panes or it's just a string,
      // use the modified version or the string itself
      finalText = typeof content === "object" ? content.modified : content;
    }

    this.editorManager.createEditor();
    this.editorManager.setContent(finalText);
  }

  updateThemeUI(themeButton) {
    const isDark = this.editorManager.settings.theme === "vs-dark";
    themeButton.textContent = isDark ? "dark_mode" : "light_mode";
    document.body.classList.toggle("dark-mode", isDark);
    document.querySelectorAll("button, select").forEach((el) => {
      el.classList.toggle("dark-mode", isDark);
    });
  }

  updateWrapUI(themeButton) {
    const isWrapped = this.editorManager.settings.wordWrap === "on";
    themeButton.textContent = isWrapped ? "wrap_text" : "subject";
    //document.body.classList.toggle("dark-mode", isWrapped);
    //document.querySelectorAll("button, select").forEach((el) => {
    //  el.classList.toggle("dark-mode", isWrapped);
    //});
  }
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  const editorManager = new EditorManager();
  const fileHandler = new FileHandler(editorManager);
  const uiController = new UIController(editorManager, fileHandler);
});
