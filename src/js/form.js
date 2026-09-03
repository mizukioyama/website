document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) {
    return;
  }

  const inputs = contactForm.querySelectorAll(".input-text");
  const modal = document.getElementById("thanksModal");
  const closeButton = modal ? modal.querySelector(".close") : null;
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const status = document.getElementById("form-status");
  const fallbackEndpoint = "https://script.google.com/macros/s/AKfycbwFuUPAnQG0oZ0bU_vN2rRMBo7f3_CjGq2dNUTc9XZDAr84K5f9nmUXxF0S5uPpZsjjtQ/exec";
  const endpoint = contactForm.getAttribute("action") || fallbackEndpoint;

  function toggleLabel(input) {
    input.classList.toggle("not-empty", input.value.trim() !== "");
  }

  function setStatus(message, isError) {
    if (!status) {
      return;
    }
    status.textContent = message;
    status.dataset.state = isError ? "error" : "success";
  }

  function closeModal() {
    if (!modal) {
      return;
    }
    modal.classList.remove("show");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
  }

  function openModal() {
    if (!modal) {
      return;
    }
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("show");
    if (closeButton) {
      closeButton.focus();
    }
  }

  inputs.forEach(input => {
    toggleLabel(input);
    input.addEventListener("input", () => toggleLabel(input));
  });

  contactForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (typeof contactForm.reportValidity === "function" && !contactForm.reportValidity()) {
      return;
    }

    const originalButtonLabel = submitButton ? submitButton.textContent : "";
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "送信中…";
    }
    setStatus("", false);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: new FormData(contactForm)
      });
      const responseText = await response.text();
      let payload = null;

      try {
        payload = JSON.parse(responseText);
      } catch (_error) {
        // The current Apps Script endpoint returns plain text on success.
      }

      const explicitlyFailed = payload && payload.success === false;
      const explicitlySucceeded = payload && payload.success === true;
      const textSucceeded = /successfully\s+submitted|送信完了|status\s*["']?\s*:\s*["']success/i.test(responseText);
      const textFailed = /(?:error|failed|failure|invalid)/i.test(responseText) && !textSucceeded;

      if (!response.ok || explicitlyFailed || textFailed || (!explicitlySucceeded && !textSucceeded && responseText.trim() !== "")) {
        throw new Error(`Contact form request failed (${response.status})`);
      }

      contactForm.reset();
      inputs.forEach(toggleLabel);
      setStatus("送信しました。", false);
      openModal();
    } catch (error) {
      setStatus("送信に問題が発生しました。時間をおいて再度お試しください。", true);
      console.error("Contact form submission failed:", error);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonLabel;
      }
    }
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });
  }
});
