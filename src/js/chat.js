document.addEventListener('DOMContentLoaded', function () {
  function loadChatBotTemplate() {
    fetch('bot.html')
      .then(response => response.text())
      .then(data => {
        document.body.insertAdjacentHTML('beforeend', data);
        initializeChatBot();
      })
      .catch(error => console.error('Error loading chatbot template:', error));
  }

  function toggleChatWindow() {
    let chatWindow = document.getElementById('chat-window');

    if (!chatWindow) {
      loadChatBotTemplate();
      setTimeout(() => {
        chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
          chatWindow.style.display = 'block';
        }
      }, 500);
    } else {
      chatWindow.style.display = chatWindow.style.display === 'block' ? 'none' : 'block';
    }
  }

  function initializeChatBot() {
    console.log("ChatBot initialized");

    const chatIcon = document.getElementById('chat-icon');
    const closeButton = document.getElementById('close-button');

    if (chatIcon) {
      chatIcon.addEventListener('click', toggleChatWindow);
    }

    if (closeButton) {
      closeButton.addEventListener('click', toggleChatWindow);
    }

    jQuery.noConflict();
    jQuery(document).ready(function ($) {
      const chatWindow = $('#chat');
      const categoryRadio = $('input[name="category"]');
      const keywordRadioContainer = $('.keyword-options');
      const sendButton = $('#send-button');
      const clearButton = $('#clear-button');

      // **fetch完了後にキーワード選択肢を更新**
      updateKeywordOptions();

      sendButton.on('click', function () {
        const selectedCategory = categoryRadio.filter(':checked').val();
        if (!selectedCategory) {
          appendMessage('bot', 'カテゴリーを選択してください。');
          return;
        }
        const selectedKeyword = keywordRadioContainer.find('input[name="keyword"]:checked').val();
        if (!selectedKeyword) {
          appendMessage('bot', 'キーワードを選択してください。');
          return;
        }
        const botResponse = generateResponse(selectedCategory, selectedKeyword);
        appendMessage('bot', botResponse);
      });

      clearButton.on('click', function () {
        chatWindow.html('');
      });

      function appendMessage(sender, message) {
        const messageDiv = $('<p>').addClass(sender).text(message);
        chatWindow.append(messageDiv);
        chatWindow.scrollTop(chatWindow[0].scrollHeight);
      }

      function generateResponse(category, keyword) {
        if (category === 'about') {
          return `カテゴリー：${category}, キーワード：${keyword}`;
        } else if (category === 'works') {
          return `カテゴリー：${category}, キーワード：${keyword}`;
        } else {
          return `カテゴリー：その他, キーワード：${keyword}`;
        }
      }

      categoryRadio.on('change', function () {
        updateKeywordOptions();
      });

      function updateKeywordOptions() {
        const selectedCategory = categoryRadio.filter(':checked').val();
        keywordRadioContainer.empty();

        if (selectedCategory === 'about') {
          addKeywordOptions(['想い', '目的', '活動']);
        } else if (selectedCategory === 'works') {
          addKeywordOptions(['PDでできること', '事業内容', '作業の流れ']);
        } else if (selectedCategory === 'その他') {
          addKeywordOptions(['相談', '申込み', '料金']);
        }
      }

      function addKeywordOptions(keywords) {
        for (const keyword of keywords) {
          const label = $('<label>').html(`
            <input type="radio" name="keyword" value="${keyword}">
            <span>${keyword}</span>
          `);
          keywordRadioContainer.append(label);
        }
      }
    });
  }

  // **header.html内のボタンが確実にロードされるようにする**
  let interval = setInterval(() => {
    let chatIcon = document.getElementById('chat-icon');
    if (chatIcon) {
      chatIcon.addEventListener('click', toggleChatWindow);
      clearInterval(interval);
    }
  }, 500);
});
