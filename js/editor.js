// editor.js - Monaco editor setup and management
class EditorManager {
  constructor() {
    this.container = document.getElementById("container");
    this.currentEditor = null;
    this.settings = {
      language: CONFIG.editorDefaults.language,
      wordWrap: CONFIG.editorDefaults.wordWrap,
      theme: CONFIG.editorDefaults.theme,
    };

    this.initMonaco();
  }

  async initMonaco() {
    require.config({
      paths: { vs: "node_modules/monaco-editor/min/vs" },
    });

    await require(["vs/editor/editor.main"], () => {
      this.createEditor(true);
    });
  }

  createEditor(init=false) {
    this.clearEditors();
    this.currentEditor = monaco.editor.create(this.container, {
      value: init ? CONFIG.defaultText : "",
      language: this.settings.language,
      wordWrap: this.settings.wordWrap,
    });
  }

  createDiffEditor(originalText, modifiedText) {
    this.clearEditors();

    const originalModel = monaco.editor.createModel(
      originalText,
      this.settings.language,
    );
    const modifiedModel = monaco.editor.createModel(
      modifiedText,
      this.settings.language,
    );

    this.currentEditor = monaco.editor.createDiffEditor(this.container, {
      originalEditable: true,
      readOnly: false,
    });

    this.currentEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    this.currentEditor.updateOptions({ wordWrap: this.settings.wordWrap });
  }

  clearEditors() {
    monaco.editor.getEditors().forEach((editor) => editor.dispose());
    monaco.editor.getDiffEditors().forEach((editor) => editor.dispose());
  }

  getCurrentContent() {
    if (this.currentEditor.getEditorType() === "vs.editor.IDiffEditor") {
      return {
        original: this.currentEditor.getOriginalEditor().getValue(),
        modified: this.currentEditor.getModifiedEditor().getValue(),
      };
    }
    return this.currentEditor.getValue();
  }

  setContent(content) {
    if (typeof content === "string") {
      if (this.currentEditor.getEditorType() === "vs.editor.IDiffEditor") {
        this.currentEditor.getOriginalEditor().setValue(content);
        this.currentEditor.getModifiedEditor().setValue(content);
      } else {
        this.currentEditor.setValue(content);
      }
    }
  }

  updateLanguage(language) {
    this.settings.language = language;
    monaco.editor.setModelLanguage(this.currentEditor.getModel(), language);
  }

  toggleWordWrap() {
    this.settings.wordWrap = this.settings.wordWrap === "on" ? "off" : "on";
    this.currentEditor.updateOptions({ wordWrap: this.settings.wordWrap });
  }

  toggleTheme() {
    this.settings.theme = this.settings.theme === "vs" ? "vs-dark" : "vs";
    monaco.editor.setTheme(this.settings.theme);
  }
}
