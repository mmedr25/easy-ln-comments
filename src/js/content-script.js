const observerCallback = (_, __) => {
    const posts = document.querySelectorAll("[data-finite-scroll-hotkey-item]");

    for (const postTag of posts) {
        if (!postTag.getElementsByClassName("ec-btn").length) {
            const btnTag = `<li class="comments-quick-comments__list-item flex-shrink-zero comments-quick-comments-hscroll-bar-button--first" data-index="0">
            <button class="comments-quick-comments__reply-button comments-quick-comments__reply-button--dark-mode artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--secondary ember-view"><!---->
            <span class="ec-btn artdeco-button__text">
              🪄
            </span></button>
            </li>`
            const toolbarTag = postTag.querySelector('.comments-quick-comments__container')
            if (toolbarTag) {
              toolbarTag.innerHTML = btnTag + toolbarTag.innerHTML
            }
        }
    }
};
// observer configuration
const MutationObserverConfig = {
    childList: true,
    subtree: true,
};
// Start observing the target node
const observedNode = document.querySelector("main")
const observer = new MutationObserver(observerCallback);
observer.observe(observedNode, MutationObserverConfig);


document.addEventListener('click', function(event) {
    if (!event.target.matches('.ec-btn')) return;
    event.preventDefault();
    var postTag = event.target.closest('[data-finite-scroll-hotkey-item]');
    var inputTag = postTag.querySelector('p');

    var postAuthor = postTag.querySelector('.update-components-actor__title .visually-hidden').textContent;
    var imgTag = postTag.querySelector('.ivm-image-view-model img') 

    // var postAuthorTagLine = postTag.querySelector('.update-components-actor__description .visually-hidden').textContent;
    var postText = postTag.querySelector('.break-words.tvm-parent-container').textContent.trim();

    browser.storage.local.get().then(function (storage) {
      var prompt = storage.config.promptTemplate
      prompt = prompt.replace('$(AUTHOR)', postAuthor)
      prompt = prompt.replace('$(CONTENT)', postText)
      var url = `${storage.config.llmUrl}/api/generate`
      var payload = {
          "model": storage.config.llmModel,
          "system": storage.config.systemPrompt,
          "prompt": prompt,
          "stream": false
      }
      console.debug("Payload:", payload)
      fetch(url, {
          method: 'POST',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
      })
          .then((response) => {
              return response
          })
          .then((response) => response.json())
          .then((data) => {
              inputTag.textContent = data.response;
          })
          .catch((error) => {
              alert(error)
          })
    })
}, false);
