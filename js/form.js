document.addEventListener("DOMContentLoaded", function () {
  const inputs = document.querySelectorAll(".input-text");
  const modal = document.getElementById('thanksModal');
  const closeButton = document.querySelector('.close');
  const contactForm = document.getElementById('contactForm');

  modal.style.display = "none";

  function toggleLabel(input) {
    if (input.value.trim() !== "") {
      input.classList.add("not-empty");
    } else {
      input.classList.remove("not-empty");
    }
  }

  inputs.forEach(input => {
    toggleLabel(input);
    input.addEventListener("input", () => toggleLabel(input));
  });

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

  fetch(form.action, {
    method: 'POST',
    body: formData
  }).then(response => response.text())
    .then(result => {
      if (result.includes("Successfully submitted")) {
        // 送信成功
        modal.style.display = "block";
        modal.classList.add("show");
        form.reset();
        document.querySelectorAll('.input-text').forEach(input => {
          input.classList.remove('not-empty');
        });
      } else {
        alert("送信に問題が発生しました。");
        console.error("送信エラー:", result);
      }
    }).catch(error => {
      alert("送信に問題が発生しました（ネットワークエラーの可能性）。");
      console.error("ネットワークエラー:", error);
    });
  });

  closeButton.onclick = () => {
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 300);
  };

  window.onclick = event => {
    if (event.target == modal) {
      modal.classList.remove("show");
      setTimeout(() => (modal.style.display = "none"), 300);
    }
  };
});


//modal
document.addEventListener('DOMContentLoaded', function () {

   // モーダルを開く関数
   function openModal(modalId) {
      const modal = document.getElementById(modalId);
      const overlay = modal?.previousElementSibling;

      if (modal && overlay?.classList.contains('modal-overlay')) {
         modal.classList.add('show');
         overlay.classList.add('show');
      }
   }

   // モーダルを閉じる関数（単一対象）
   function closeModal(modalElement) {
      modalElement.classList.remove('show');
      const overlay = modalElement.previousElementSibling;
      if (overlay && overlay.classList.contains('modal-overlay')) {
         overlay.classList.remove('show');
      }
   }

   // 開くボタン処理
   document.querySelectorAll('.button[data-modal]').forEach(function (button) {
      button.addEventListener('click', function (e) {
         e.preventDefault();
         const modalId = button.getAttribute('data-modal');
         openModal(modalId);
      });
   });

   // 各モーダルに閉じるイベントを追加（オーバーレイと close）
   document.querySelectorAll('.modal').forEach(function (modal) {
      const overlay = modal.previousElementSibling;
      const closeBtn = modal.querySelector('.close');

      if (overlay && overlay.classList.contains('modal-overlay')) {
         overlay.addEventListener('click', function () {
            closeModal(modal);
         });
      }

      if (closeBtn) {
         closeBtn.addEventListener('click', function () {
            closeModal(modal);
         });
      }
   });

});