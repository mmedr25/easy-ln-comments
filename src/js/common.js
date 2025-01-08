const defaultLlmUrl = "http://localhost:11434"
const defaultLlmModel = "llama3.2"
const defaultSystemPromt = `You are an AI agent helping the user in writing comments to Linkedin posts. The user will give the content of a post and/or its comments and you must produce comment.
Please apply the following rules on your writing:
- Answers must be under 500 characters
- Apply a decontracted tuned maybe with some humor
`
const defaultPromptTemplate = `$(CONTENT)
`

$(".btnSaveProfile").on("click", function(e) {
  browser.storage.local.get().then(function (storage) {
    storage.config.llmUrl = $('[name="llmUrl"]').val();
    storage.config.llmModel = $('[name="llmModel"]').val();
    storage.config.systemPrompt = $('[name="systemPrompt"]').val();
    storage.config.promptTemplate = $('[name="promptTemplate"]').val();
    browser.storage.local.set(storage);
  });
});

$(function() {
  browser.storage.local.get().then(function (storage) {
    storage.config = storage.config || {}
    $('[name="llmUrl"]').val(storage.config.llmUrl || defaultLlmUrl);
    $('[name="llmModel"]').val(storage.config.llmModel || defaultLlmModel);
    $('[name="systemPrompt"]').val(storage.config.systemPrompt || defaultSystemPromt);
    $('[name="promptTemplate"]').val(storage.config.promptTemplate || defaultPromptTemplate);
    browser.storage.local.set(storage);
  });
});
