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
         1: "オフライン（チラシ、紹介、イベントなど）",
         2: "SNS（Instagram, Twitter, Facebookなど）",
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
      text: "ウェブサイト制作に興味はありますか？ ",
      options: {
         1: "興味があるが、費用が心配",
         2: "興味があるが、メリットがわからない",
         3: "興味があるが、運営方法がわからない",
         4: "特に興味はない",
      },
      next: (answer) => 21 + answer
   },
   ////21-2: "いいえ",
   30: {
      text: "オンライン広告の課題を選んでください。",
      options: {
         1: "広告予算が足りない",
         2: "広告ターゲットの精度が低い",
         3: "広告運用の知識不足"
      },
      next: (answer) => 30 + answer
   },
   //21-1: "興味があるが、費用が心配",
   22: {
      text: "広告運用を改善するために取り組みたい方法を選んでください。",
      options: {
         1: "外部の専門家に依頼",
         2: "オンライン広告のトレーニングを受講",
         3: "広告運用ツールの導入"
      },
      next: (answer) => 40 + answer
   },
   //21-2: "興味があるが、メリットがわからない",
   23: {
      text: "広告運用を改善するために取り組みたい方法を選んでください。",
      options: {
         1: "外部の専門家に依頼",
         2: "オンライン広告のトレーニングを受講",
         3: "広告運用ツールの導入"
      },
      next: () => 99 // 診断結果へ
   },
   //21-3: "興味があるが、運営方法がわからない",
   24: {
      text: "広告運用を改善するために取り組みたい方法を選んでください。",
      options: {
         1: "外部の専門家に依頼",
         2: "オンライン広告のトレーニングを受講",
         3: "広告運用ツールの導入"
      },
      next: () => 99 // 診断結果へ
   },
   //21-4: "特に興味はない",
   25: {
      text: "広告運用を改善するために取り組みたい方法を選んでください。",
      options: {
         1: "外部の専門家に依頼",
         2: "オンライン広告のトレーニングを受講",
         3: "広告運用ツールの導入"
      },
      next: () => 99 // 診断結果へ
   },
   31: {
      text: "新規顧客獲得における現状の課題を選んでください。",
      options: {
         1: "ウェブサイトの訪問者数が少ない",
         2: "ターゲット層の不明確さ",
         3: "顧客体験（UX）の質が低い"
      },
      next: (answer) => 31 + answer
   },
   //質問32
   32: {
      text: "訪問者数が少ない原因を選んでください。",
      options: {
         1: "SEO対策が不十分",
         2: "広告出稿を行っていない",
         3: "ソーシャルメディアでの露出が少ない"
      },
      next: (answer) => 32 + answer
   },
   //質問33
   33: {
      text: "SEO対策を強化するための施策を選んでください。",
      options: {
         1: "キーワード調査の実施",
         2: "高品質なコンテンツの作成",
         3: "外部リンク戦略の見直し"
      },
      next: () => 99 // 診断結果へ
   },
   //質問41
   41: {
      text: "リピート率向上における課題を選んでください。",
      options: {
         1: "リピーター向けの施策がない",
         2: "商品やサービスの満足度が低い",
         3: "メールマーケティングの効果が薄い"
      },
      next: (answer) => 41 + answer
   },
   //質問42
   42: {
      text: "リピーター施策として取り組みたい内容を選んでください。",
      options: {
         1: "ポイント制度の導入",
         2: "パーソナライズされたメールの送付",
         3: "ロイヤリティプログラムの導入"
      },
      next: (answer) => 42 + answer
   },
   //質問43
   43: {
      text: "ポイント制度を成功させるために取り組むべきことを選んでください。",
      options: {
         1: "シンプルで分かりやすいルールの設定",
         2: "ポイント付与条件の見直し",
         3: "キャンペーンの告知強化"
      },
      next: () => 99 // 診断結果へ
   },
   // 最後の質問（結果表示、ID: 99）
   99: {
      text: "診断結果: あなたの課題に対する最適な解決策が見つかりました！",
      options: {} // 結果画面には選択肢がない
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
   resultText.innerHTML = `あなたの回答<br>${formattedAnswers}`;

   // アドバイスを生成して表示
   const advice = generateAdvice();

   document.getElementById("submit-button").onclick = sendToServer;
   document.getElementById("reload-button").onclick = () => location.reload();
}


// アドバイスを生成する関数
function generateAdvice() {
   let advice = "<h2>最終診断結果</h2>";
   for (const questionNumber in selectedAnswers) {
      if (questionNumber !== "address") {
         const answer = selectedAnswers[questionNumber];
      }
   }

   if (selectedAnswers[1] === 1) { // 最初の質問で「ブランドの認知度向上」を選択した場合
      if (selectedAnswers[11] === 1) { // SNS活用を選択
         advice += "<span>SNS活用のアドバイス</span><br>SNSの投稿頻度、ターゲット層へのリーチ、コンテンツの質を見直しましょう。<wbr>データ分析ツールを活用して効果測定を行い、改善を繰り返すことが重要です。";
         if (selectedAnswers[12] === 1) { // 投稿頻度が少ない
            advice += "<span>SNS投稿頻度向上のためのアドバイス</span><br>投稿スケジュールの作成、コンテンツカレンダーの活用、ツールを使った予約投稿などを検討しましょう。<wbr>無理のない頻度で継続することが大切です。";
            if (selectedAnswers[13] === 1) {
               advice += "投稿スケジュールを作成することで、計画的に投稿を行うことができます。<wbr>コンテンツカレンダーやタスク管理ツールを活用しましょう。";
            } else if (selectedAnswers[13] === 2) {
               advice += "チーム内で役割分担を明確にすることで、効率的に作業を進めることができます。<wbr>各メンバーの得意分野を生かした役割分担を行いましょう。";
            } else if (selectedAnswers[13] === 3) {
               advice += "外部リソース（ライター、デザイナーなど）を活用することで、コンテンツ作成の負担を軽減できます。<wbr>予算に合わせて適切なリソースを選びましょう。";
            }
         } else if (selectedAnswers[12] === 2) { // ターゲット層にリーチできていない
            advice += "<span>SNSターゲット層へのリーチ不足のアドバイス</span><br>ターゲット層の分析、ハッシュタグの見直し、インフルエンサーとの連携などを検討しましょう。<wbr>データ分析ツールを使って効果測定を行い、改善を繰り返しましょう。";
         } else if (selectedAnswers[12] === 3) { // コンテンツの質が低い
            advice += "<span>SNSコンテンツの質向上のためのアドバイス</span><br>ユーザーのニーズに応える質の高いコンテンツを作成しましょう。<wbr>競合分析やトレンド調査を行い、魅力的なコンテンツを発信することが重要です。";
         }
      } else if (selectedAnswers[11] === 2) { // オフライン広告を選択
         advice += "<span>オフライン広告のアドバイス</span><br>オフライン広告は、地域密着型のビジネスや特定のターゲット層に有効です。<wbr>費用対効果を考慮し、適切な媒体を選びましょう。<wbr>オンライン広告と組み合わせることで、より効果的なマーケティング戦略を構築できます。";
      } else if (selectedAnswers[11] === 3) { // 他には何もしていないを選択
         advice += "<span>ブランド認知度向上のための最初の一歩</span><br>まずは、自社の状況に合った施策を検討することから始めましょう。<wbr>SNS活用、ウェブサイト改善、PR活動など、できることから取り組みましょう。";
      }
   }

   else if (selectedAnswers[1] === 2) { // 最初の質問で「商品の販売促進」を選択した場合
      if (selectedAnswers[21] === 1) { // オンライン広告の活用不足
         advice += "<span>オンライン広告活用のアドバイス</span><br>オンライン広告の効果を高めるためには、ターゲット設定の見直し、クリエイティブの改善、ランディングページの最適化などが重要です。";
      } //21-1
      else if (selectedAnswers[21] === 2) { // 商品ページの訪問者数が少ない
         advice += "<span>商品ページ訪問者数増加のアドバイス</span><br>商品ページのコンバージョン率を高めるためには、キャッチコピーの見直し、商品の魅力が伝わる写真や動画の追加、レビューの掲載などが効果的です。";
      } //21-2
      else if (selectedAnswers[21] === 3) { // 販促キャンペーンの効果が低い
         advice += "<span>販促キャンペーン効果改善のアドバイス</span><br>過去のキャンペーンデータを分析することで、成功要因と改善点を把握することができます。<wbr>データ分析ツールを活用し、次回のキャンペーンに活かしましょう。";
      } //21-3
      if (selectedAnswers[22] === 1) {
         advice += "広告予算の配分を見直す際には、各広告媒体の費用対効果を分析し、最適な配分を検討しましょう。<wbr>A/Bテストなどを活用して効果測定を行うことが重要です。";
      } //22-1
      else if (selectedAnswers[22] === 2) {
         advice += "ターゲット層を絞り込むことで、広告の費用対効果を高めることができます。<wbr>顧客データや市場調査などを活用し、ターゲット層を明確にしましょう。";
      } //22-2
      else if (selectedAnswers[22] === 3) {
         advice += "オンライン広告に関する知識を深めることで、より効果的な広告戦略を立てることができます。<wbr>セミナーへの参加や書籍を読むなど、学習機会を設けましょう。";
      } //22-3
      if (selectedAnswers[23] === 1) {
         advice += "外部の専門家に依頼することで、高度な知識やノウハウを活用することができます。<wbr>複数の業者から見積もりを取り、比較検討しましょう。";
      } //23-1
      else if (selectedAnswers[23] === 2) {
         advice += "体系的なトレーニングを受けることで、広告運用に必要な知識やスキルを習得することができます。<wbr>オンラインコースやセミナーなどを活用しましょう。";
      } //23-2
      else if (selectedAnswers[23] === 3) {
         advice += "効果測定ツールを導入することで、広告の効果を可視化し、改善点を明確にすることができます。<wbr>Google Analyticsなどのツールを活用しましょう。";
      } //23-3
   }

   else if (selectedAnswers[1] === 3) { // 最初の質問で「新規顧客の獲得」を選択した場合
      if (selectedAnswers[31] === 1) { // ウェブサイトの訪問者数が少ない
         advice += "<span>ウェブサイト訪問者数増加のアドバイス</span><br>ウェブサイトへの集客を増やすためには、SEO対策、コンテンツマーケティング、SNS活用などが有効です。<wbr>ターゲット層に合わせた施策を選びましょう。";
      } else if (selectedAnswers[31] === 2) { // ターゲット層の不明確さ
         advice += "<span>ターゲット層明確化のアドバイス</span><br>ターゲット顧客を明確にすることで、効果的なマーケティング施策を展開することができます。<wbr>顧客データや市場調査などを活用し、ターゲット像を明確にしましょう。";
      } else if (selectedAnswers[31] === 3) { // 顧客体験（UX）の質が低い
         advice += "<span>顧客体験（UX）改善のアドバイス</span><br>ウェブサイトのUI/UXを改善することで、ユーザーの利便性を高め、コンバージョン率を向上させることができます。<wbr>ユーザーテストなどを実施し、課題点を洗い出しましょう。";
      }
      if (selectedAnswers[32] === 1) {
         advice += "SEO対策を強化することで、検索エンジンからの流入を増やすことができます。<wbr>キーワードの見直し、コンテンツの最適化、被リンク獲得などを行いましょう。";
      } else if (selectedAnswers[32] === 2) {
         advice += "広告出稿を増やすことで、ウェブサイトへのアクセス数を増やすことができます。<wbr>ターゲット層に合わせた広告媒体を選び、効果測定を行いながら運用しましょう。";
      } else if (selectedAnswers[32] === 3) {
         advice += "ソーシャルメディアでの露出を増やすことで、ブランド認知度向上やウェブサイトへの集客効果が期待できます。<wbr>ターゲット層に合わせたプラットフォームを選び、積極的に情報発信を行いましょう。";
      }
      if (selectedAnswers[33] === 1) {
         advice += "キーワード調査の実施は、SEO対策の基本です。<wbr>適切なキーワードを選定することで、検索エンジンからの流入を効果的に増やすことができます。";
      } else if (selectedAnswers[33] === 2) {
         advice += "高品質なコンテンツを作成することで、ユーザーの満足度を高め、ウェブサイトの評価を向上させることができます。<wbr>ユーザーにとって有益な情報を提供することを心がけましょう。";
      } else if (selectedAnswers[33] === 3) {
         advice += "外部リンク戦略の見直しは、ウェブサイトの信頼性を高める上で重要です。<wbr>質の高いウェブサイトからの被リンクを獲得することで、検索順位の向上に繋げることができます。";
      }
   } else if (selectedAnswers[1] === 4) { // 最初の質問で「リピーター獲得」を選択した場合
      if (selectedAnswers[41] === 1) { // リピーター向けの施策がない
         advice += "<span>リピーター施策導入のアドバイス</span><br>リピーター向けの施策を充実させることで、顧客ロイヤルティを高め、継続的な売上につなげることができます。<wbr>ポイント制度、メールマガジン、会員限定サービスなどを検討しましょう。";
      } else if (selectedAnswers[41] === 2) { // 商品やサービスの満足度が低い
         advice += "<span>商品・サービス品質改善のアドバイス</span><br>商品・サービスの品質を向上させることは、リピーター獲得の基本です。<wbr>顧客からのフィードバックを収集し、改善に努めましょう。<wbr>顧客アンケートの実施、レビューの分析、競合製品との比較などを行い、具体的な改善点を見つけ出すことが重要です。";
         if (selectedAnswers[42] === 1) {
            advice += "ポイント制度の導入を検討されているとのことですので、顧客にとって魅力的な特典を設定し、リピート購入を促進する仕組みを構築しましょう。<wbr>ポイントの付与率、交換できる商品やサービス、有効期限などを明確にすることが重要です。";
         } else if (selectedAnswers[42] === 2) {
            advice += "パーソナライズされたメールの送付は、顧客エンゲージメントを高める効果的な手段です。<wbr>顧客の属性や購買履歴に基づいて、個別に最適化された情報やオファーを配信することで、顧客との関係性を深め、リピート購入を促進しましょう。顧客データの分析とセグメント配信が重要です。";
         } else if (selectedAnswers[42] === 3) {
            advice += "ロイヤリティプログラムの導入は、顧客の囲い込みに効果的です。<wbr>会員ランク制度、限定イベントへの招待、特別割引などを提供することで、顧客のロイヤルティを高め、長期的な関係を構築しましょう。<wbr>プログラムの設計と特典内容が重要です。";
         }
         if (selectedAnswers[43] === 1) {
            advice += "シンプルで分かりやすいルールを設定することで、顧客はポイント制度を容易に理解し、積極的に利用するようになります。<wbr>複雑なルールは顧客の混乱を招き、利用意欲を低下させる可能性があるため、注意が必要です。";
         } else if (selectedAnswers[43] === 2) {
            advice += "ポイント付与条件の見直しは、顧客の行動を適切に誘導し、リピート購入を促進するために重要です。<wbr>購買金額、購入頻度、特定商品の購入など、顧客にとって魅力的な条件を設定しましょう。";
         } else if (selectedAnswers[43] === 3) {
            advice += "キャンペーンの告知強化は、ポイント制度の利用促進に不可欠です。<wbr>ウェブサイト、メールマガジン、SNSなどを活用し、キャンペーン情報を効果的に伝え、顧客の参加を促しましょう。";
         }

      } else if (selectedAnswers[41] === 3) { // メールマーケティングの効果が薄い
         advice += "<span>メールマーケティング改善のアドバイス</span><br>メールマーケティングを効果的に活用することで、顧客との関係性を維持し、リピート購入を促進することができます。<wbr>セグメント配信、パーソナライズされたコンテンツ、キャンペーン情報などを配信しましょう。<wbr>配信頻度、コンテンツ内容、配信タイミング、件名、デザインなどを見直すことで、開封率やクリック率の改善を図りましょう。";
      }
   }

   // アドバイス内容を HTML に適用
   const adviceContent = document.getElementById("advice-content");
   adviceContent.innerHTML = ""; // 既存内容をクリア
   adviceContent.innerHTML = (selectedAnswers, advice); // 改行を含めたアドバイスを設定

   return advice; // 必要に応じて戻り値として返却
}

submitButton.addEventListener("click", (event) => {
   event.preventDefault(); // フォーム送信のデフォルト動作を防止
   sendToServer();
});


document.addEventListener("DOMContentLoaded", () => {
   const submitButton = document.getElementById("submit-button");
   const reloadButton = document.getElementById("reload-button");

   // 送信中かどうかを判定するフラグ
   let isSubmitting = false;

   // 送信ボタンのクリックイベント
   if (submitButton) {
      // ボタンの type を "button" に変更 (HTMLで対応していない場合の保険)
      submitButton.setAttribute("type", "button");

      // リスナーの重複を防止
      if (!submitButton.hasAttribute("data-listener")) {
         submitButton.setAttribute("data-listener", "true");

         submitButton.addEventListener("click", async () => {
            if (isSubmitting) {
               console.log("送信処理中のため、新たな送信はキャンセルされました。");
               return;
            }
            isSubmitting = true; // フラグを立てる
            submitButton.disabled = true; // ボタンを一時的に無効化

            try {
               await sendToServer();
            } catch (error) {
               console.error("送信中にエラーが発生しました:", error);
            }

            isSubmitting = false; // フラグを解除
            submitButton.disabled = false; // ボタンを再び有効化
         });
      }
   } else {
      console.error("エラー: 'submit-button' が見つかりませんでした。");
   }

   // リロードボタンのクリックイベント
   if (reloadButton) {
      reloadButton.addEventListener("click", () => {
         location.reload();
      });
   }
});


// サーバーにデータを送信する関数
async function sendToServer() {
   const name = document.getElementById("name")?.value.trim() || "";
   const address = document.getElementById("address")?.value.trim() || "";
   const consultation = document.getElementById("consultation")?.value.trim() || "なし"; // 相談内容
   const agreeCheckbox = document.querySelector('input[name="agree"]');
   const freeConsultationCheckbox = document.querySelector('input[name="freeConsultation"]'); // 無料相談

   // アドバイス内容（HTMLタグを含めずテキストのみ）
   const advice = document.getElementById("advice-content")?.textContent.trim() || "なし";

   console.log("入力値", { name, address, consultation, freeConsultation: freeConsultationCheckbox?.checked, advice });

   let errorMsg = "";
   if (!name) errorMsg += "氏名が未入力です。\n";
   if (!address) errorMsg += "メールアドレスが未入力です。\n";
   if (!agreeCheckbox || !agreeCheckbox.checked) errorMsg += "プライバシーポリシーに同意してください。\n";

   if (errorMsg) {
      console.log("エラー:", errorMsg);
      alert("入力エラー\n" + errorMsg);
      return;
   }

   // 選択されたチェックボックスの値を取得
   const selectedAnswersElements = document.querySelectorAll('input[name="advice"]:checked');
   const selectedAnswers = Array.from(selectedAnswersElements).map(el => el.value).join(",") || "なし";

   try {
      // 修正: 相談内容と無料相談希望を追加
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("address", address);
      formData.append("consultation", consultation); // 相談内容を送信
      formData.append("freeConsultation", freeConsultationCheckbox?.checked ? "希望する" : "希望しない"); // チェック有無を送信
      formData.append("advice", advice);

      const response = await fetch("https://script.google.com/macros/s/AKfycbzhxYw9C96Yc2bwS_bDAmSpZBnRcOkpIft7JoHVACqdTfEjYLfsLxBJKvDS3Uc677DP/exec", {
         method: "POST",
         headers: { "Content-Type": "application/x-www-form-urlencoded" },
         body: formData.toString(),
      });

      const responseText = await response.text();
      console.log("サーバーからのレスポンス:", responseText);

      const jsonResponse = JSON.parse(responseText);
      if (jsonResponse.success) {
         showSuccessModal(); // 送信成功時にモーダルを表示
      } else {
         alert("サーバーエラー:\n" + jsonResponse.message);
      }
   } catch (error) {
      console.error("ネットワークエラー:", error);
      alert("ネットワークエラー:\n" + error.message);
   }
}


// 送信成功時にモーダルを表示する関数
function showSuccessModal() {
   const modal = document.getElementById("successModal");
   const modalMessage = document.getElementById("modalMessage");
   modalMessage.textContent = "送信完了しました！";
   modal.style.display = "block";

   // モーダルを閉じる処理
   document.getElementById("closeModal").addEventListener("click", function () {
      modal.style.display = "none";
   });
}


//送信完了後＝モーダルとメッセージ「送信完了しました」