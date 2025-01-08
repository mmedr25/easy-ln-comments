const btnTemplate = `
  <li class="comments-quick-comments__list-item flex-shrink-zero comments-quick-comments-hscroll-bar-button--first" data-index="0">
    <button class="comments-quick-comments__reply-button comments-quick-comments__reply-button--dark-mode artdeco-button artdeco-button--muted artdeco-button--2 artdeco-button--secondary ember-view"><!---->
      <span class="ec-btn artdeco-button__text">
        🪄
      </span>
    </button>
  </li>
`;

const observerCallback = (_, __) => {
  const posts = document.querySelectorAll("[data-finite-scroll-hotkey-item]");

  for (const postTag of posts) {
    if (!postTag.querySelector(".ec-btn")) {
      const btnTag = generateHtml(btnTemplate);
      btnTag.addEventListener("click", wandOnClick);
      
      postTag
        ?.querySelector(".comments-quick-comments__container")
        ?.prepend(btnTag);
    }
  }
};

// observer configuration
const MutationObserverConfig = {
  childList: true,
  subtree: true,
};
// Start observing the target node
const observedNode = document.querySelector("main");
const observer = new MutationObserver(observerCallback);
observer.observe(observedNode, MutationObserverConfig);

// document.addEventListener('click',
function wandOnClick(event) {
  const postTag = event.target.closest("[data-finite-scroll-hotkey-item]");
  const inputTag = postTag.querySelector("p");

  const postAuthor = postTag
    .querySelector(".update-components-actor__title .visually-hidden")
    .textContent;
  const imgTag = postTag.querySelector(".ivm-image-view-model img");

  // var postAuthorTagLine = postTag.querySelector('.update-components-actor__description .visually-hidden').textContent;
  const postText = postTag
    .querySelector(".break-words.tvm-parent-container")
    .textContent.trim();

  browser.storage.local.get().then(function (storage) {
    let prompt = storage.config.promptTemplate;
    prompt = prompt.replace("$(AUTHOR)", postAuthor);
    prompt = prompt.replace("$(CONTENT)", postText);

    const url = `${storage.config.llmUrl}/api/generate`;
    const payload = {
      model: storage.config.llmModel,
      system: storage.config.systemPrompt,
      prompt: prompt,
      stream: false,
    };

    console.debug("Payload:", payload);
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async(response) => await response.json())
      .then((data) => {
        inputTag.textContent = parseSuggestion(data.response);
      })
      .catch((error) => {
        alert(error);
      });
  });
}


////////////////// helper functions ////////////////////////////
const generateHtml = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return doc.body.firstChild;
};

const parseSuggestion = (suggestion) => {
  return suggestion.replace(/^\"(.*)\"$/, (_, middleContent) => {
    return middleContent;
  });
};

async function imageToBase64(url) {
  if (!url) return ""; 

  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
}