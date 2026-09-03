document.addEventListener("DOMContentLoaded", function () {
  let chatLoadPromise = null;
  let chatControlsInitialized = false;

  function getChatWindow() {
    return document.getElementById("chat-window");
  }

  function setChatWindowVisibility(visible) {
    const chatWindow = getChatWindow();
    if (chatWindow) {
      chatWindow.style.display = visible ? "block" : "none";
    }
  }

  function initializeChatBot() {
    const chatWindow = getChatWindow();
    if (!chatWindow || chatControlsInitialized) {
      return;
    }

    chatControlsInitialized = true;

    const closeButton = document.getElementById("close-button");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        setChatWindowVisibility(false);
      });
    }

    // Keep the existing jQuery chatbot behavior without throwing on pages
    // where jQuery is not available.
    const $ = window.jQuery;
    if (!$) {
      return;
    }

    const chatMessages = $("#chat");
    const categoryRadio = $('input[name="category"]');
    const keywordRadioContainer = $(".keyword-options");
    const sendButton = $("#send-button");
    const clearButton = $("#clear-button");

    function appendMessage(sender, message) {
      const messageDiv = $("<p>").addClass(sender).text(message);
      chatMessages.append(messageDiv);
      if (chatMessages[0]) {
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
      }
    }

    function addKeywordOptions(keywords) {
      keywords.forEach(keyword => {
        const label = $("<label>");
        $("<input>", {
          type: "radio",
          name: "keyword",
          value: keyword
        }).appendTo(label);
        $("<span>", { text: keyword }).appendTo(label);
        keywordRadioContainer.append(label);
      });
    }

    function updateKeywordOptions() {
      const selectedCategory = categoryRadio.filter(":checked").val();
      keywordRadioContainer.empty();

      if (selectedCategory === "about") {
        addKeywordOptions(["想い", "目的", "活動"]);
      } else if (selectedCategory === "works") {
        addKeywordOptions(["PDでできること", "事業内容", "作業の流れ"]);
      } else if (selectedCategory === "その他") {
        addKeywordOptions(["相談", "申込み", "料金"]);
      }
    }

    function generateResponse(category, keyword) {
      const displayCategory = category === "about" || category === "works"
        ? category
        : "その他";
      return `カテゴリー：${displayCategory}, キーワード：${keyword}`;
    }

    updateKeywordOptions();
    categoryRadio.on("change", updateKeywordOptions);

    sendButton.on("click", function () {
      const selectedCategory = categoryRadio.filter(":checked").val();
      if (!selectedCategory) {
        appendMessage("bot", "カテゴリーを選択してください。");
        return;
      }

      const selectedKeyword = keywordRadioContainer
        .find('input[name="keyword"]:checked')
        .val();
      if (!selectedKeyword) {
        appendMessage("bot", "キーワードを選択してください。");
        return;
      }

      appendMessage("bot", generateResponse(selectedCategory, selectedKeyword));
    });

    clearButton.on("click", function () {
      chatMessages.empty();
    });
  }

  function loadChatBotTemplate() {
    if (chatLoadPromise) {
      return chatLoadPromise;
    }

    chatLoadPromise = fetch("bot.html")
      .then(response => {
        if (!response.ok) {
          throw new Error(`Chatbot template request failed (${response.status})`);
        }
        return response.text();
      })
      .then(data => {
        // Avoid inserting a second copy if multiple clicks arrive while the
        // template is loading or another script inserted it first.
        if (!getChatWindow()) {
          document.body.insertAdjacentHTML("beforeend", data);
        }
        initializeChatBot();
        return getChatWindow();
      })
      .catch(error => {
        console.error("Error loading chatbot template:", error);
        chatLoadPromise = null;
        return null;
      });

    return chatLoadPromise;
  }

  function toggleChatWindow() {
    const chatWindow = getChatWindow();
    if (!chatWindow) {
      loadChatBotTemplate().then(loadedWindow => {
        if (loadedWindow) {
          setChatWindowVisibility(true);
        }
      });
      return;
    }

    const isVisible = window.getComputedStyle(chatWindow).display !== "none";
    setChatWindowVisibility(!isVisible);
  }

  // Header/footer fragments are loaded asynchronously. Delegation handles a
  // later-added icon without polling or duplicate click listeners.
  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!target || target.nodeType !== 1 || typeof target.closest !== "function") {
      return;
    }

    const chatIcon = target.closest("#chat-icon");
    if (chatIcon) {
      event.preventDefault();
      toggleChatWindow();
    }
  });
});
