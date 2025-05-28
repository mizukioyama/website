  const slides = [
    {
      img: "/src/assets/images/pd-bg-img.jpg",
      title: "作品タイトル 1",
      text: "ここにテキストが入る 1\nテキスト 1 行目\nテキスト 2 行目",
      bg: "rgba(30, 30, 30, 0.5)",
      background: "/src/assets/images/pd-bg-img.jpg",
      line: "2021"
    },
    {
      img: "/src/assets/images/pd-body-bg.jpg",
      title: "作品タイトル 2",
      text: "ここにテキストが入る 2\nアートの説明が入ります",
      bg: "#512da8",
      background: "/src/assets/images/pd-bg-img.jpg",
      line: "2022"
    },
    {
      img: "/src/assets/images/pd-body-bg.jpg",
      title: "作品タイトル 3",
      text: "ここにテキストが入る 3\n写真解説など入ります",
      bg: "#00695c",
      background: "/src/assets/images/pd-bg-img.jpg",
      line: "2023"
    }
  ];

  let current = 0;

  function updateSlide(index) {
    const image = document.getElementById("slide");
    const container = document.getElementById("image-container");
    const body = document.body;
    const text = document.getElementById("text");
    const line = document.getElementById("line");
    const lineInner = line.querySelector(".line-inner");

    container.classList.add("fade-out");
    text.style.opacity = 0;
    text.style.transform = "translateY(20px)";

    lineInner.classList.remove("line-animate");
    void lineInner.offsetWidth;
    lineInner.classList.add("line-animate");

    setTimeout(() => {
      const slide = slides[index];

      image.src = slide.img;
      text.innerHTML = `<h2 id="title">${slide.title}</h2>${slide.text.replace(/\n/g, "<br>")}`;

      // 背景画像またはグラデーション背景の設定
      if (slide.background) {
        body.style.backgroundImage = slide.background;
        body.style.backgroundSize = "cover";
        body.style.backgroundPosition = "top center";
        body.style.backgroundRepeat = "no-repeat";
        body.style.backgroundColor = slide.bg || "rgba(30,30,30, 0.5)";
      } else {
        body.style.background = `linear-gradient(120deg, ${slide.bg}, rgba(30,30,30, 0.5))`;
        body.style.backgroundImage = "none";
      }

      line.childNodes[line.childNodes.length - 1].textContent = slide.line;

      container.classList.remove("fade-out");
      text.style.opacity = 1;
      text.style.transform = "translateY(0)";
    }, 400);
  }

  function nextSlide() {
    current = (current + 1) % slides.length;
    updateSlide(current);
  }

  function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    updateSlide(current);
  }

  function triggerLineAnimation() {
    const lineInner = document.querySelector(".line-inner");

    lineInner.classList.remove("line-animate");
    void lineInner.offsetWidth;
    lineInner.classList.add("line-animate");

    lineInner.addEventListener("animationend", onAnimationEnd);

    function onAnimationEnd() {
      lineInner.removeEventListener("animationend", onAnimationEnd);
      nextSlide();
      setTimeout(triggerLineAnimation, 500);
    }
  }

  window.onload = () => {
    updateSlide(0);
    setTimeout(triggerLineAnimation, 500);
  };