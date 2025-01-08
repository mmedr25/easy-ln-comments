const defaultConfig = {
  llmUrl: "http://localhost:11434",
  llmModel: "llama3.2",
  promptTemplate: `$(CONTENT)`,
  systemPrompt: `
    You are an AI agent helping the user in writing comments to Linkedin posts. The user will give the content of a post and/or its comments and you must produce comment.
    Please apply the following rules on your writing:
    - Answers must be under 500 characters
    - Apply a decontracted tuned maybe with some humor
  `,
}

 function saveButtonOnClick(e) {
  browser.storage.local.get().then(function (storage) {
    storage.config.llmUrl = document.querySelector('[name="llmUrl"]').value;
    storage.config.llmModel = document.querySelector('[name="llmModel"]').value;
    storage.config.systemPrompt = document.querySelector('[name="systemPrompt"]').value;
    storage.config.promptTemplate = document.querySelector('[name="promptTemplate"]').value;
    
    browser.storage.local.set(storage);
  });
}

const initConfig = () => {
  browser.storage.local.get().then(function (storage) {
    storage.config = storage?.config || {...defaultConfig}
    
    document.querySelector('[name="llmUrl"]').value = storage.config.llmUrl;
    document.querySelector('[name="llmModel"]').value = storage.config.llmModel;
    document.querySelector('[name="systemPrompt"]').value = storage.config.systemPrompt;
    document.querySelector('[name="promptTemplate"]').value = storage.config.promptTemplate;
    
    browser.storage.local.set(storage);
  });
};

window.addEventListener('DOMContentLoaded', () => {
  initConfig()

  document
    .querySelector(".btnSaveProfile")
    .addEventListener("click", saveButtonOnClick)
})