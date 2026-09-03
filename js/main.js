document.addEventListener('DOMContentLoaded', function() {
  const perPage = 4; // 1ページあたりの作品数

  let currentCategory = 'all';
  let currentPage = 1;

  const gallery = document.querySelector('.gallery');
  const catLinks = document.querySelectorAll('.category-link');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  const pageButtons = document.querySelector('.page-buttons');

  function filterWorks() {
    const arr = worksData.filter(w =>
      currentCategory === 'all' || w.category === currentCategory
    );
    const total = Math.ceil(arr.length / perPage);

    function renderGallery() {
      gallery.innerHTML = '';
      const slice = arr.slice((currentPage-1)*perPage, currentPage*perPage);
      slice.forEach(w => {
        const div = document.createElement('div');
        div.className = 'work';
        div.innerHTML = `
          <img src="${w.img}" alt="${w.title}" style="width:100%">
          <strong>${w.title}</strong><br><em>${w.year}</em>`;
        gallery.appendChild(div);
      });
    }

    function renderPagination() {
      pageButtons.innerHTML = '';
      for(let i=1; i<=total; i++){
        const a = document.createElement('a');
        a.textContent = i;
        a.href = '#';
        a.dataset.page = i;
        a.className = i===currentPage ? 'disabled' : '';
        a.addEventListener('click', ev => {
          ev.preventDefault();
          currentPage = i;
          update();
        });
        pageButtons.appendChild(a);
      }
      leftArrow.disabled = currentPage === 1;
      rightArrow.disabled = currentPage === total;
    }

    function update() {
      renderGallery();
      renderPagination();
    }

    leftArrow.onclick = () => { if(currentPage>1){currentPage--; update();}};
    rightArrow.onclick = () => { if(currentPage<total){currentPage++; update();}};
    update();
  }

  catLinks.forEach(a=>{
    a.addEventListener('click', ev=>{
      ev.preventDefault();
      catLinks.forEach(x=>x.classList.remove('disabled'));
      a.classList.add('disabled');
      currentCategory = a.dataset.page;
      currentPage = 1;
      filterWorks();
    });
    if(a.dataset.page === 'all') a.classList.add('disabled');
  });

  // 初期表示
  filterWorks();
});
