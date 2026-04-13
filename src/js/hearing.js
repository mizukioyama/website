// ページ読み込み時に最初の質問を表示
document.addEventListener("DOMContentLoaded", () => {
   displayQuestion();
});

// 状態管理用変数
let currentQuestion = 1; // 現在の質問番号
let selectedAnswers = {}; // 選択された回答を格納するオブジェクト

const questions = {
   1: {
      text: "現在、どのような方法で集客していますか？",
      options: {
         1: "チラシ、紹介、イベントなど",
         2: "SNS（Instagram, X, Facebookなど）",
         3: "Webサイト（ブログ、LP、広告など）",
         4: "特に何もしていない"
      },
      //next: (answer) => [11, 21, 31, 41][answer - 1] || null
      next: () => 11
   },
   //1: "オフライン（チラシ、紹介、イベントなど）",
   11: {
      text: "集客状況に満足していますか？",
      options: {
         1: "はい",
         2: "いいえ"
      },
      next: (answer) => [99, 21][answer - 1] || null
   },
   //11-1: "はい",
   21: {
      text: "Webサイトの制作を検討していますか？ ",
      options: {
         1: "検討しているが、費用が心配",
         2: "検討しているが、運営方法がわからない",
         3: "興味があるが、メリットがわからない",
         4: "特に検討していない"
      },
      next: (answer) => [22, 22, 22, 99][answer - 1] || null
   },
   ////21-2: "いいえ",
   22: {
      text: "Webサイトを作る際、以下の中で最も不安な点を教えてください。",
      options: {
         1: "制作費用が高そう",
         2: "制作後の運用が難しそう",
         3: "ウェブやネットに関する知識が少ない",
         4: "必要性を感じていない"
      },
      next: (answer) => [23, 23, 23, 99][answer - 1] || null
   },
   //21-1: "興味があるが、費用が心配",
   23: {
      text: "Webサイト制作に使える予算はどのくらいですか？",
      options: {
         1: "予算がほとんどない",
         2: "5万円以下",
         3: "10万円以下",
         4: "10万円以上"
      },
      next: (answer) => [99, 24, 24, 24][answer - 1] || null
   },
   //21-2: "興味があるが、メリットがわからない",
   24: {
      text: "制作後の運営や更新に使えるリソースはどのくらいですか？",
      options: {
         1: "自分でできる時間がある",
         2: "外注を検討している",
         3: "リソースがなく心配"
      },
      next: () => 25
   },
   //21-3: "興味があるが、運営方法がわからない",
   25: {
      text: "Webサイトを作るとしたら、どのような効果を期待しますか？",
      options: {
         1: "集客力を高める",
         2: "ブランドイメージの向上",
         3: "商品やサービスの販売",
         4: "他社との差別化",
         5: "特に期待することはない"
      },
      next: () => 26 // 診断結果へ
   },
   //21-4: "特に興味はない",
   26: {
      text: "Webサイトに設置したい機能は何ですか？",
      options: {
         1: "お問い合わせフォーム",
         2: "オンライン販売機能（EC）",
         3: "予約システム",
         4: "ブログや情報（お知らせ）発信機能"
      },
      next: () => 27 // 診断結果へ
   },
   27: {
      text: "Web制作や運営にどれくらいのサポートがあると安心ですか？",
      options: {
         1: "分からないことを全て教えてほしい",
         2: "最低限のサポートだけでよい",
         3: "サポートは不要、自分で進められる",
         4: "運用を任せたい"
      },
      next: () => 28
   },
   //質問32
   28: {
      text: "Web制作後、定期的な運用や改善のサポートがあると安心ですか？",
      options: {
         1: "はい",
         2: "時々あればよい",
         3: "いいえ"
      },
      next: () => 29
   },
   //質問33
   29: {
      text: "もし、Webサイトを制作するタイミングはいつ頃になりますか？",
      options: {
         1: "すぐに取り組みたい",
         2: "1〜3ヶ月以内",
         3: "半年〜1年以内",
         4: "まだ具体的には決めていない"
      },
      next: () => 99 // 診断結果へ
   }
};

// ページ読み込み時に最初の質問を表示
window.onload = displayQuestion;

// 質問を表示する関数
function displayQuestion() {
   const questionContainer = document.getElementById("question-container");
   const resultContainer = document.getElementById("result-container");

   questionContainer.style.display = "block";
   resultContainer.style.display = "none";

   const question = questions[currentQuestion];
   if (!question) {
      console.error("質問が存在しません");
      return;
   }

   const questionText = questionContainer.querySelector(".question");
   const optionsContainer = questionContainer.querySelector(".options");

   questionText.textContent = question.text;
   optionsContainer.innerHTML = "";

   Object.entries(question.options).forEach(([key, value]) => {
      const li = document.createElement("li");
      const button = document.createElement("button");
      button.textContent = value;
      button.onclick = () => handleAnswer(parseInt(key, 10));
      li.appendChild(button);
      optionsContainer.appendChild(li);
   });
}

// 回答を処理する関数
function handleAnswer(answer) {
   selectedAnswers[currentQuestion] = answer;

   const nextQuestion = questions[currentQuestion]?.next(answer);

   if (nextQuestion === 99) {
      showContactForm();
   } else if (questions[nextQuestion]) {
      currentQuestion = nextQuestion;
      displayQuestion();
   } else {
      displayResult();
   }
}

// 追加情報入力フォームの表示
function showContactForm() {
   const contactInfo = document.getElementById("contact-info");
   contactInfo.style.display = "block";
   displayResult();
}

// 結果を表示する関数
function displayResult() {
   const questionContainer = document.getElementById("question-container");
   const resultContainer = document.getElementById("result-container");
   const resultText = document.getElementById("result-text");
   //   const adviceContent = document.getElementById("advice-content");

   questionContainer.style.display = "none";
   resultContainer.style.display = "block";

   // 選択された回答をフォーマット
   const formattedAnswers = Object.entries(selectedAnswers)
      .map(([index, answer]) => {
         const question = questions[index];
         const answerText = question.options[answer];
         return `質問：${question.text}<br>選んだ答え：${answerText}`;
      })
      .join("<br><br>");

   // 回答結果を表示
   resultText.innerHTML = `<span>あなたの回答</span><br>${formattedAnswers}`;

   // アドバイスを生成して表示
   const advice = generateAdvice();

   document.getElementById("submit-button").onclick = sendToServer;
   document.getElementById("reload-button").onclick = () => location.reload();
}


// アドバイスを生成する関数
function generateAdvice() {
   // アドバイス内容を定義
   let advice = "<h2>最終診断結果</h2>";
   advice += "<span>ご回答ありがとうございます。</span><br>今後のステップとしては、最適なマーケティング戦略の検討や、具体的な行動計画の策定をお勧めします。<br>";
   advice += "<span>どのような施策を選択するにせよ、継続的な努力が成功の鍵となります。</span>";

   // アドバイスをHTMLに表示
   const adviceElement = document.getElementById("advice"); // IDが"advice"の要素を取得
   if (adviceElement) {
      adviceElement.innerHTML = advice; // アドバイスを表示
   }

   // もし"advice-content"要素にも設定する必要がある場合
   const adviceContentElement = document.getElementById("advice-content");
   if (adviceContentElement) {
      adviceContentElement.innerHTML = advice; // アドバイスを設定
   }

   return advice; // 必要に応じて戻り値として返却
}


submitButton.addEventListener("click", (event) => {
   event.preventDefault(); // フォーム送信のデフォルト動作を防止
   sendToServer();
});


document.addEventListener("DOMContentLoaded", () => {
   console.log("DOMが読み込まれました");

   const submitButton = document.getElementById("submit-button");
   const reloadButton = document.getElementById("reload-button");
   const modal = document.getElementById("modal");
   const closeModal = document.getElementById("close-modal");
   const modalMessage = document.getElementById("modal-message");

   if (!submitButton || !modal || !closeModal || !modalMessage) {
      console.error("エラー: 必須要素が見つかりません。");
      return;
   }

   let isSubmitting = false;

   submitButton.addEventListener("click", async () => {
      console.log("送信ボタンがクリックされました");

      if (isSubmitting) {
         console.warn("送信中のため、新しいリクエストはキャンセルされました。");
         return;
      }

      isSubmitting = true;
      submitButton.disabled = true;

      try {
         const result = await sendToServer();
         if (result.success) {
            console.log("送信成功:", result.message);
            modalMessage.textContent = result.message;
            modal.style.display = "flex"; // display: flex に変更
         } else {
            console.error("送信失敗:", result.message);
            alert(result.message);
         }
      } catch (error) {
         console.error("システムエラー:", error);
         alert("システムエラーが発生しました: " + error.message);
      }

      isSubmitting = false;
      submitButton.disabled = false;
   });

   reloadButton.addEventListener("click", () => {
      console.log("リロードボタンがクリックされました");
      location.reload();
   });

   closeModal.addEventListener("click", () => {
      console.log("モーダルを閉じます");
      modal.style.display = "none";
      window.scrollTo(0, 0); // ページトップに移動
   });
});

// サーバーにデータを送信する関数
async function sendToServer() {
   const name = document.getElementById("name")?.value.trim() || "";
   const address = document.getElementById("address")?.value.trim() || "";
   const agreeCheckbox = document.querySelector('input[name="agree"]');

   console.log("入力値", { name, address, agree: agreeCheckbox?.checked });

   let errorMsg = "";
   if (!name) errorMsg += "氏名が未入力です。\n";
   if (!address) errorMsg += "メールアドレスが未入力です。\n";
   if (!agreeCheckbox || !agreeCheckbox.checked) errorMsg += "プライバシーポリシーに同意してください。\n";

   if (errorMsg) {
      alert("入力エラー\n" + errorMsg);
      return { success: false, message: errorMsg };
   }

   try {
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("address", address);

      const response = await fetch("https://script.google.com/macros/s/AKfycbzdbfYEbffzfLjlUrELooWM7pe5ASngNc8lQlcXapHtKEzoHQ0WPudxTFrvJIi-r2-r/exec", {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: formData.toString(),
      });

      const responseText = await response.text();
      console.log("サーバーからのレスポンス:", responseText);

      const jsonResponse = JSON.parse(responseText);
      if (jsonResponse.success) {
         return { success: true, message: "送信完了しました！" };
      } else {
         return { success: false, message: "サーバーエラー:\n" + jsonResponse.message };
      }
   } catch (error) {
      console.error("ネットワークエラー:", error);
      return { success: false, message: "ネットワークエラー:\n" + error.message };
   }
}


//上記に下記を追加
//チェックボックス必須
//送信完了後＝送信完了しました（モーダルで表示）＝＞Topに戻る
//「回答結果、アドバイスを」入力されたAddressへ送信

//0224
//モーダルの表示がされない
//内容が送信されない