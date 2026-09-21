class CustomTextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________!())>>"<-0120__10010//01.#11001,';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => (this.resolve = resolve));
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.el.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

const customPhrases = [
    '当ページは抽象画Artsit / OyamaのPortfolioサイトです。',
    '作品についてのお問い合わせは問い合わせはお問い合わせはContactページのFormから受付けています。',
    'Oyamaの作品は抽象, 幻想, 次元, 自然, 生命, 影響,',
    '固定観念や固定化された概念からの脱却.',
    'をThemeに個々の思想や価値観に訴える作品を制作してます。',
    'This page is the Portfolio site of Abstract Painting Artsit / Oyama.',
    'If you have any questions about the work, please contact us using the form on the Contact page.',
    'Oyama work explores abstraction, illusion, dimension, nature, life, and impact.',
    'With the theme of breaking away from stereotypes and fixed concepts, ',
    'I create works that appeal to individual thoughts and values.'

];

const customEl = document.querySelector('.custom-text');
const customFx = new CustomTextScramble(customEl);

let customCounter = 0;

const customNext = () => {
    customFx.setText(customPhrases[customCounter]).then(() => {
        setTimeout(customNext, 4000);
    });
    customCounter = (customCounter + 1) % customPhrases.length;
};

customNext();
