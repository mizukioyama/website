import $ from "jquery";

$(document).ready(function () {
    // サイドバーの読み込み
    fetch("sidebar.html")
        .then(response => {
            if (!response.ok) throw new Error('HTTP error: ' + response.status);
            return response.text();
        })
        .then(data => {
            const sidebarContainer = document.getElementById('sidebar-container');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = data;
            }
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
        });


    // フッターの読み込み
    fetch("./footer.html")
        .then(response => {
            if (!response.ok) throw new Error('HTTP error: ' + response.status);
            return response.text();
        })
        .then(data => {
            const footerContainer = document.getElementById('footer-container');
            if (!footerContainer) return;

            footerContainer.innerHTML = data;
            const year = footerContainer.querySelector('#year');
            if (year) {
                year.textContent = String(new Date().getFullYear());
            }
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});
