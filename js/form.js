document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("thanksModal");
  const closeButton = document.querySelector("#thanksModal .close");
  const contactForm = document.getElementById("contactForm");

  if (!contactForm || !modal) return;

  const primaryGroup = contactForm.querySelector(".radio-group");
  const requestRadio = contactForm.querySelector('input[name="inquiryType"][value="依頼"]');
  const inquiryRadio = contactForm.querySelector('input[name="inquiryType"][value="問い合わせ"]');
  const subjectInput = contactForm.querySelector('#text[name="text"]');
  const nameInput = contactForm.querySelector('#name[name="name"]');
  const emailInput = contactForm.querySelector('#email[name="email"]');
  const messageInput = contactForm.querySelector('#message[name="message"]');
  const submitButton = contactForm.querySelector('.submit-btn');

  modal.style.display = "none";

  // Keep the existing Apps Script payload compatible while improving validation.
  if (subjectInput) subjectInput.maxLength = 120;
  if (nameInput) nameInput.maxLength = 100;
  if (emailInput) emailInput.maxLength = 254;
  if (messageInput) {
    messageInput.maxLength = 3000;
    messageInput.required = true;
  }

  // Request sub-category UI. This stays client-side so the current Apps Script does not need to change.
  const requestOptions = document.createElement("fieldset");
  requestOptions.className = "request-options";
  requestOptions.hidden = true;
  requestOptions.setAttribute("aria-label", "依頼内容");
  requestOptions.innerHTML = `
    <legend>Request type <span>依頼内容</span></legend>
    <div class="request-option-list">
      <input type="radio" id="request-order" name="requestCategory" value="オーダー制作">
      <label for="request-order">Commission<br><span>オーダー制作</span></label>

      <input type="radio" id="request-purchase" name="requestCategory" value="作品購入">
      <label for="request-purchase">Purchase<br><span>作品購入</span></label>

      <input type="radio" id="request-exhibition" name="requestCategory" value="展示・出展について">
      <label for="request-exhibition">Exhibition<br><span>展示・出展について</span></label>

      <input type="radio" id="request-work" name="requestCategory" value="仕事・制作のご依頼">
      <label for="request-work">Work<br><span>仕事・制作のご依頼</span></label>
    </div>
  `;

  if (primaryGroup) primaryGroup.insertAdjacentElement("afterend", requestOptions);

  const requestCategoryInputs = Array.from(requestOptions.querySelectorAll('input[name="requestCategory"]'));

  function setRequestMode(isRequest) {
    requestOptions.hidden = !isRequest;
    requestCategoryInputs.forEach(input => {
      input.required = isRequest;
      if (!isRequest) input.checked = false;
    });
  }

  requestRadio?.addEventListener("change", () => setRequestMode(true));
  inquiryRadio?.addEventListener("change", () => setRequestMode(false));
  setRequestMode(Boolean(requestRadio?.checked));

  // Lightweight honeypot. No paid anti-spam service is required.
  const honeypotWrap = document.createElement("div");
  honeypotWrap.className = "contact-honeypot";
  honeypotWrap.setAttribute("aria-hidden", "true");
  honeypotWrap.innerHTML = '<label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
  contactForm.appendChild(honeypotWrap);
  const honeypot = honeypotWrap.querySelector("input");

  const status = document.createElement("p");
  status.className = "form-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  submitButton?.insertAdjacentElement("beforebegin", status);

  // Keep visual labels in sync with filled fields.
  const inputs = contactForm.querySelectorAll(".input-text");
  function toggleLabel(input) {
    input.classList.toggle("not-empty", input.value.trim() !== "");
  }
  inputs.forEach(input => {
    toggleLabel(input);
    input.addEventListener("input", () => toggleLabel(input));
  });

  // Small scoped styles for the new conditional UI only.
  const style = document.createElement("style");
  style.textContent = `
    .request-options { border: 0; padding: 0; margin: 1.75rem 0 .5rem; color: var(--inv); }
    .request-options[hidden] { display: none !important; }
    .request-options legend { margin-bottom: .85rem; font-size: clamp(.8rem, calc(.7rem + .35vw), 1rem); font-weight: 300; opacity: .65; }
    .request-options legend span { margin-left: .45rem; }
    .request-option-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; }
    .request-option-list input[type="radio"] { display: none; }
    .request-option-list label { display: block; min-width: 0; padding: .8rem .9rem; border-bottom: 1px solid rgba(220,220,220,.32); background: rgba(0,0,0,.16); font-size: clamp(.75rem, calc(.68rem + .3vw), .95rem); line-height: 1.45; font-weight: 300; opacity: .55; cursor: pointer; transition: opacity .25s ease, background .25s ease, border-color .25s ease; }
    .request-option-list label span { font-size: .88em; }
    .request-option-list input[type="radio"]:checked + label { opacity: 1; background: rgba(0,0,0,.38); border-color: currentColor; }
    .contact-honeypot { position: absolute !important; width: 1px !important; height: 1px !important; overflow: hidden !important; clip: rect(0 0 0 0) !important; clip-path: inset(50%) !important; white-space: nowrap !important; }
    .form-status { min-height: 1.5em; margin: 1rem 0 0; font-size: clamp(.7rem, calc(.62rem + .3vw), .85rem); opacity: .7; }
    .submit-btn[disabled] { opacity: .4; cursor: wait; }
    @media screen and (max-width: 600px) {
      .request-options { margin-top: 1.35rem; }
      .request-option-list { grid-template-columns: 1fr; gap: .45rem; }
      .request-option-list label { padding: .7rem .75rem; }
    }
  `;
  document.head.appendChild(style);

  contactForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (honeypot?.value) return;

    if (!contactForm.reportValidity()) return;

    const selectedType = contactForm.querySelector('input[name="inquiryType"]:checked')?.value || "";
    const selectedCategory = contactForm.querySelector('input[name="requestCategory"]:checked')?.value || "";

    if (selectedType === "依頼" && !selectedCategory) {
      status.textContent = "依頼内容を選択してください。";
      requestOptions.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const formData = new FormData(contactForm);

    // Existing Apps Script currently stores six fields. Preserve compatibility by
    // prefixing the request category into the existing subject field.
    if (selectedType === "依頼" && selectedCategory && subjectInput) {
      formData.set("text", `[${selectedCategory}] ${subjectInput.value.trim()}`);
    }

    // requestCategory and honeypot are client-side helpers, not backend schema fields.
    formData.delete("requestCategory");
    formData.delete("website");

    if (submitButton) submitButton.disabled = true;
    status.textContent = "Sending...";

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData
      });
      const result = await response.text();

      if (!response.ok || !result.includes("Successfully submitted")) {
        throw new Error(result || `HTTP ${response.status}`);
      }

      modal.style.display = "block";
      modal.classList.add("show");
      contactForm.reset();
      setRequestMode(false);
      inputs.forEach(input => input.classList.remove("not-empty"));
      status.textContent = "送信しました。";
    } catch (error) {
      status.textContent = "送信できませんでした。時間をおいて再度お試しください。";
      console.error("Contact form submission error:", error);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });

  function closeThanksModal() {
    modal.classList.remove("show");
    setTimeout(() => (modal.style.display = "none"), 300);
  }

  closeButton?.addEventListener("click", closeThanksModal);
  window.addEventListener("click", event => {
    if (event.target === modal) closeThanksModal();
  });
});

// Generic modal handling used elsewhere on the contact page.
document.addEventListener("DOMContentLoaded", function () {
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = modal?.previousElementSibling;
    if (modal && overlay?.classList.contains("modal-overlay")) {
      modal.classList.add("show");
      overlay.classList.add("show");
    }
  }

  function closeModal(modalElement) {
    modalElement.classList.remove("show");
    const overlay = modalElement.previousElementSibling;
    if (overlay && overlay.classList.contains("modal-overlay")) {
      overlay.classList.remove("show");
    }
  }

  document.querySelectorAll(".button[data-modal]").forEach(button => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      openModal(button.getAttribute("data-modal"));
    });
  });

  document.querySelectorAll(".modal").forEach(modal => {
    const overlay = modal.previousElementSibling;
    const closeBtn = modal.querySelector(".close");

    if (overlay?.classList.contains("modal-overlay")) {
      overlay.addEventListener("click", () => closeModal(modal));
    }
    closeBtn?.addEventListener("click", () => closeModal(modal));
  });
});
