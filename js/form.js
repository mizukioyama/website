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
  if (modal.parentElement !== document.body) document.body.appendChild(modal);

  if (closeButton) {
    closeButton.textContent = "×";
    closeButton.setAttribute("role", "button");
    closeButton.setAttribute("tabindex", "0");
    closeButton.setAttribute("aria-label", "閉じる");
  }

  subjectInput?.closest(".form-field")?.remove();
  if (nameInput) nameInput.maxLength = 100;
  if (emailInput) emailInput.maxLength = 254;
  if (messageInput) {
    messageInput.maxLength = 3000;
    messageInput.required = true;
    const messageLabel = contactForm.querySelector('label[for="message"]');
    if (messageLabel) messageLabel.textContent = "Message（お問い合わせ内容）";
  }

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
      <input type="radio" id="request-other" name="requestCategory" value="その他">
      <label for="request-other">Other<br><span>その他</span></label>
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

  const inputs = contactForm.querySelectorAll(".input-text");
  function toggleLabel(input) { input.classList.toggle("not-empty", input.value.trim() !== ""); }
  inputs.forEach(input => {
    toggleLabel(input);
    input.addEventListener("input", () => toggleLabel(input));
  });

  const style = document.createElement("style");
  style.textContent = `
    .request-options { border: 0; padding: 0; margin: 1.75rem 0 .5rem; color: var(--inv); }
    .request-options[hidden] { display: none !important; }
    .request-options legend { margin-bottom: .85rem; font-size: clamp(.8rem, calc(.7rem + .35vw), 1rem); font-weight: 300; opacity: .65; }
    .request-options legend span { margin-left: .45rem; }
    .request-option-list { display: grid; grid-template-columns: repeat(3, max-content); grid-auto-rows: 1fr; column-gap: 24px; row-gap: 16px; justify-content: start; align-items: stretch; }
    .request-option-list input[type="radio"] { display: none; }
    .request-option-list label { display: flex; flex-direction: column; justify-content: center; width: max-content; max-width: 100%; min-width: 0; min-height: 3.5rem; margin: 0 !important; padding: .35rem 0 .45rem; border: 0; border-bottom: 1px solid transparent; background: transparent; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; font-size: clamp(.75rem, calc(.68rem + .3vw), .95rem); line-height: 1.45; font-weight: 300; opacity: .55; cursor: pointer; transition: opacity .25s ease, border-color .25s ease; box-sizing: border-box; }
    .request-option-list label span { font-size: .88em; }
    .request-option-list input[type="radio"]:checked + label { opacity: 1; background: transparent; border-bottom-color: currentColor; }
    .contact-honeypot { position: absolute !important; width: 1px !important; height: 1px !important; overflow: hidden !important; clip: rect(0 0 0 0) !important; clip-path: inset(50%) !important; white-space: nowrap !important; }
    .form-status { min-height: 1.5em; margin: 1rem 0 0; font-size: clamp(.7rem, calc(.62rem + .3vw), .85rem); opacity: .7; }
    .submit-btn[disabled] { opacity: .4; cursor: wait; }
    #thanksModal { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100dvh !important; min-height: 100dvh !important; padding: 1rem !important; margin: 0 !important; transform: none !important; background: rgba(0, 0, 0, .62) !important; -webkit-backdrop-filter: blur(12px) !important; backdrop-filter: blur(12px) !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; box-sizing: border-box !important; z-index: 2147483000 !important; }
    #thanksModal.show { display: flex !important; opacity: 1 !important; transform: none !important; }
    #thanksModal .modal-content { position: relative !important; inset: auto !important; width: min(90vw, 680px) !important; height: auto !important; max-height: min(74dvh, 680px) !important; margin: 0 !important; padding: clamp(2.5rem, 6vw, 3.25rem) clamp(1.75rem, 5vw, 3rem) clamp(1.75rem, 5vw, 3rem) !important; transform: none !important; overflow-y: auto !important; background: rgba(0, 0, 0, .94) !important; border: 1px solid rgba(255,255,255,.14) !important; box-sizing: border-box !important; }
    #thanksModal .modal-content p { width: 100% !important; min-width: 0 !important; margin-inline: 0 !important; }
    #thanksModal .close { position: absolute !important; top: .8rem !important; right: .9rem !important; display: grid !important; place-items: center !important; margin: 0 !important; padding: 0 !important; float: none !important; width: 2.5rem !important; height: 2.5rem !important; line-height: 1 !important; font-family: Arial, sans-serif !important; font-size: 1.8rem !important; font-weight: 200 !important; color: var(--inv) !important; opacity: .72 !important; cursor: pointer !important; background: transparent !important; border: 0 !important; }
    #thanksModal .close:hover, #thanksModal .close:focus-visible { opacity: 1 !important; outline: 1px solid currentColor; outline-offset: 2px; }
    @media screen and (max-width: 600px) {
      .request-options { margin-top: 1.35rem; }
      .request-option-list { grid-template-columns: repeat(3, max-content); column-gap: 24px; row-gap: 16px; justify-content: start; }
      .request-option-list label { min-height: 3.75rem; margin: 0 !important; padding: .3rem 0 .4rem; background: transparent; font-size: clamp(.68rem, 2.8vw, .82rem); }
      #thanksModal { padding: 1rem !important; }
      #thanksModal .modal-content { width: min(92vw, 34rem) !important; max-height: 76dvh !important; padding: 3rem 1.5rem 1.5rem !important; }
      #thanksModal .close { top: .55rem !important; right: .6rem !important; }
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
    if (selectedType === "依頼" && selectedCategory) {
      formData.set("inquiryType", "依頼");
      formData.set("text", selectedCategory);
      if (messageInput) formData.set("message", `依頼内容：${selectedCategory}\n${messageInput.value.trim()}`);
    } else {
      formData.set("text", "問い合わせ");
    }
    formData.delete("requestCategory");
    formData.delete("website");
    if (submitButton) submitButton.disabled = true;
    status.textContent = "Sending...";
    try {
      const response = await fetch(contactForm.action, { method: "POST", body: formData });
      const result = await response.text();
      if (!response.ok || !result.includes("Successfully submitted")) throw new Error(result || `HTTP ${response.status}`);
      modal.style.display = "flex";
      modal.classList.add("show");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
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
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    setTimeout(() => (modal.style.display = "none"), 300);
  }
  closeButton?.addEventListener("click", closeThanksModal);
  closeButton?.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      closeThanksModal();
    }
  });
  window.addEventListener("click", event => { if (event.target === modal) closeThanksModal(); });
});

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
    if (overlay && overlay.classList.contains("modal-overlay")) overlay.classList.remove("show");
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
    if (overlay?.classList.contains("modal-overlay")) overlay.addEventListener("click", () => closeModal(modal));
    closeBtn?.addEventListener("click", () => closeModal(modal));
  });
});
