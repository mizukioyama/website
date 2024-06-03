    const cardModalContents = [
        {
        left: "<img src='https://paradigmart.natureinspire.jp/wp-content/uploads/2023/08/R0022376-Edit.jpg'>",
        right: "当ページは過去作品のまとめページです.",
        button: "カード1のボタン"
        },
        {
        left: "<img src='https://paradigmart.natureinspire.jp/wp-content/uploads/2023/08/PXL_20230717_081904915-Edit.jpg'>左側のコンテンツ2",
        right: "右側のコンテンツ2",
        button: "カード2のボタン"
        },
        {
        left: "<img src='image3.jpg'>左側のコンテンツ3",
        right: "右側のコンテンツ3",
        button: "カード3のボタン"
        },
        {
        left: "<img src='image4.jpg'>左側のコンテンツ4",
        right: "右側のコンテンツ4",
        button: "カード4のボタン"
        }
    ];
    
    let clickedCard; // グローバル変数
    
    function cardClicked(cardNumber) {
        clickedCard = document.querySelector(".card:nth-child(" + cardNumber + ")");
        clickedCard.classList.add("card-clicked");
        rotateCardAndOpenModal(cardNumber);
    }
    
    function rotateCardAndOpenModal(cardNumber) {
        const card = document.querySelector(".card:nth-child(" + cardNumber + ")");
        card.style.transform = "rotateY(180deg)"; // カードを回転
    
        // カードの回転アニメーションが終了した後にモーダルを開く
        card.addEventListener("transitionend", function() {
        openModal(cardNumber);
        }, { once: true });
    
        // クリックされたカード以外のカードを下にスライドアウトさせる
        const cards = document.querySelectorAll(".card:not(.card-clicked)");
        cards.forEach((card) => {
        if (card !== clickedCard) {
            card.style.transform = "translateY(100%)";
        }
        });
    }
    
    function openModal(cardNumber) {
        const modal = document.getElementById("modal");
        modal.style.display = "flex";
        
        // カードごとのモーダルウィンドウのコンテンツを更新
        const modalLeftContent = document.getElementById("modal-left-content");
        const modalRightContent = document.getElementById("modal-right-content");
        modalLeftContent.innerHTML = cardModalContents[cardNumber - 1].left;
        modalRightContent.innerHTML = cardModalContents[cardNumber - 1].right;
    }
    
    function closeModal() {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    
        // カードを元の位置に戻す
        const cards = document.querySelectorAll(".card");
        cards.forEach((card) => {
        card.style.transform = "none";
        card.classList.remove("card-clicked");
        });
    }
    
    // モーダルウィンドウ外のクリックでモーダルを閉じる
    window.addEventListener("click", function(event) {
        const modal = document.getElementById("modal");
        if (event.target === modal) {
        closeModal();
        }
    });
    