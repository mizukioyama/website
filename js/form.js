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