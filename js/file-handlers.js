// file-handlers.js - File operations

class FileHandler {
  constructor(editorManager) {
    this.editorManager = editorManager;
    this.container = document.getElementById("container");
    this.dragCounter = 0; // Add counter to track drag events
    this.initializeDragAndDrop();
  }

  initializeDragAndDrop() {
    // Prevent default drag behaviors
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      document.body.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    // Handle dragenter
    this.container.addEventListener("dragenter", (e) => {
      e.preventDefault();
      this.dragCounter++; // Increment counter on enter
      if (this.dragCounter === 1) { // Only add class on first enter
        this.container.classList.add("drag-active");
      }
    });

    // Handle dragleave
    this.container.addEventListener("dragleave", (e) => {
      e.preventDefault();
      this.dragCounter--; // Decrement counter on leave
      if (this.dragCounter === 0) { // Only remove class when all drags are done
        this.container.classList.remove("drag-active");
      }
    });

    // Handle drop
    this.container.addEventListener("drop", (e) => {
      e.preventDefault();
      this.dragCounter = 0; // Reset counter
      this.container.classList.remove("drag-active");
      const file = e.dataTransfer.files[0];
      if (file) {
        this.handleDroppedFile(file);
      }
    });
  }
  async handleDroppedFile(file) {
    try {
      // Check if file is text
      if (
        !file.type.startsWith("text/") &&
        !file.name.match(/\.(txt|md|js|py|html|css|json|log|csv)$/i)
      ) {
        throw new Error("Only text files are supported");
      }

      const text = await file.text();
      this.editorManager.setContent(text);

      // Try to set appropriate language mode based on file extension
      const extension = file.name.split(".").pop().toLowerCase();
      const languageMap = {
        "js": "javascript",
        "py": "python",
        "html": "html",
        "css": "css",
        "json": "json",
        "md": "markdown",
        "txt": "text",
      };

      if (languageMap[extension]) {
        this.editorManager.updateLanguage(languageMap[extension]);
        // Update the language selector in UI
        const syntaxSelect = document.getElementById("syntax");
        if (syntaxSelect) {
          syntaxSelect.value = languageMap[extension];
        }
      }
    } catch (error) {
      console.error("Error handling dropped file:", error);
      // You might want to show this error to the user in a more friendly way
      alert(error.message);
    }
  }

  async openFile() {
    try {
      // Try File System Access API first
      if ('showOpenFilePicker' in window) {
        const [fileHandle] = await window.showOpenFilePicker(
          CONFIG.filePickerOptions,
        );
        const fileData = await fileHandle.getFile();
        const fileText = await fileData.text();
        this.editorManager.setContent(fileText);
      } else {
        // Fallback for other browsers
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'text/*,.txt,.md,.js,.py,.html,.css,.json,.log,.csv';

        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            const fileText = await file.text();
            this.editorManager.setContent(fileText);

            // Try to set appropriate language mode based on file extension
            const extension = file.name.split(".").pop().toLowerCase();
            const languageMap = {
              "js": "javascript",
              "py": "python",
              "html": "html",
              "css": "css",
              "json": "json",
              "md": "markdown",
              "txt": "text",
            };

            if (languageMap[extension]) {
              this.editorManager.updateLanguage(languageMap[extension]);
              // Update the language selector in UI
              const syntaxSelect = document.getElementById("syntax");
              if (syntaxSelect) {
                syntaxSelect.value = languageMap[extension];
              }
            }
          }
        };

        input.click();
      }
    } catch (error) {
      console.error("Error opening file:", error);
    }
  }

  async saveFile() {
    try {
      const content = this.editorManager.getCurrentContent();
      const textToSave = typeof content === "string"
        ? content
        : content.modified;

      // Try File System Access API first 
      if ('showSaveFilePicker' in window) {
        const newHandle = await window.showSaveFilePicker(CONFIG.fileSaveOptions);
        const writableStream = await newHandle.createWritable();
        await writableStream.write(textToSave);
        await writableStream.close();
      } else {
        // Fallback for other browsers
        const blob = new Blob([textToSave], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }
}
