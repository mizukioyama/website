let isAnimating = false;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[data-section]').forEach(link => {
        link.addEventListener("click", (event) => {
            // `_blank` で開くリンクは制御しない
            if (event.currentTarget.target === "_blank") {
                return;
            }

            event.preventDefault(); // デフォルト動作を防ぐ
            console.log("Clicked:", event.currentTarget); // デバッグ用
            const sectionId = event.currentTarget.getAttribute("data-section");
            if (sectionId) {
                console.log("Target Section ID:", sectionId); // デバッグ用
                showSection(sectionId);
            } else {
                window.location.href = event.currentTarget.href; // 通常のリンクはそのまま開く
            }
        });
    });
});


function showSection(sectionId) {
    if (isAnimating) return; // アニメーション中はクリックを無効化
    isAnimating = true;

    const currentSection = document.querySelector('.displayed-section');
    const nextSection = document.getElementById(sectionId);

    if (!nextSection || currentSection === nextSection) {
        isAnimating = false;
        return; // 無効なセクション or 同じセクションなら何もしない
    }

    // メニュー項目のアクティブ状態を更新
    updateActiveMenu(sectionId);

    // ステップ1: 表示中のセクションを縮小
    currentSection.classList.add('shrink');
    setTimeout(() => {
        // ステップ2: 表示中のセクションを左にスライドして非表示
        currentSection.classList.add('slide-left');
        setTimeout(() => {
            // ステップ3: 新しいセクションを右から縮小状態で中央へスライド
            nextSection.classList.remove('next-section');
            nextSection.classList.add('slide-center');
            setTimeout(() => {
                // ステップ4: 新しいセクションを拡大して表示
                nextSection.classList.remove('slide-center');
                nextSection.classList.add('displayed-section', 'expand');

                // アニメーションが完了したら不要なクラスを削除し、アニメーションフラグをリセット
                currentSection.classList.remove('displayed-section', 'shrink', 'slide-left');
                currentSection.classList.add('next-section');
                nextSection.classList.remove('expand');
                isAnimating = false;
            }, 380);
        }, 400);
    }, 380);
}

function updateActiveMenu(activeSectionId) {
    document.querySelectorAll('.menu a').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('section').forEach(section => section.classList.remove('active-section', 'next-section'));

    const activeSection = document.getElementById(activeSectionId);
    const activeLink = document.querySelector(`a[data-section="${activeSectionId}"]`);

    if (activeSection) activeSection.classList.add('active-section');
    if (activeLink) activeLink.classList.add('active');

    document.querySelectorAll('section').forEach(section => {
        if (section !== activeSection) {
            section.classList.add('next-section');
        }
    });
}
