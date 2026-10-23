
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    menuToggle.textContent = mainNav.classList.contains('open') ? '✕' : '☰';
  });
  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.textContent = '☰';
  }));
}
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
const homeSearch = document.getElementById('homeSearch');
if (homeSearch) {
  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    sessionStorage.setItem('autohausType', tab.dataset.kind || 'all');
  }));
  homeSearch.addEventListener('submit', event => {
    event.preventDefault();
    const params = new URLSearchParams();
    const make = document.getElementById('homeMake').value;
    const model = document.getElementById('homeModel').value;
    const type = document.querySelector('.tab.active')?.dataset.kind || 'all';
    if (make) params.set('make', make);
    if (model) params.set('q', model);
    if (type !== 'all') params.set('type', type);
    const min = document.getElementById('minYear').value;
    const max = document.getElementById('maxYear').value;
    if (min) params.set('minYear', min);
    if (max) params.set('maxYear', max);
    window.location.href = 'inventory.html?' + params.toString();
  });
}
const inventoryGrid = document.getElementById('inventoryGrid');
if (inventoryGrid) {
  const search = document.getElementById('inventorySearch');
  const type = document.getElementById('typeFilter');
  const sort = document.getElementById('sortFilter');
  const count = document.getElementById('resultCount');
  const params = new URLSearchParams(window.location.search);
  if (params.get('q') && search) search.value = params.get('q');
  if (params.get('type') && type) type.value = params.get('type');
  if (params.get('make') && search) search.value = params.get('make') + ' ' + (search.value || '');
  function filterCars() {
    const query = (search?.value || '').toLowerCase().trim();
    const selectedType = type?.value || '';
    const cards = [...inventoryGrid.querySelectorAll('.car-card')];
    cards.forEach(card => {
      const name = card.dataset.name || '';
      const category = card.dataset.type || '';
      const matchesQuery = name.includes(query);
      const matchesType = !selectedType || category === selectedType;
      card.style.display = matchesQuery && matchesType ? '' : 'none';
    });
    if (sort?.value === 'az' || sort?.value === 'za') {
      cards.sort((a,b) => a.dataset.name.localeCompare(b.dataset.name) * (sort.value === 'az' ? 1 : -1));
      cards.forEach(card => inventoryGrid.appendChild(card));
    }
    const visible = cards.filter(card => card.style.display !== 'none').length;
    count.textContent = `Menampilkan ${visible} mobil`;
    let empty = inventoryGrid.querySelector('.empty-state');
    if (!visible && !empty) {
      empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'Mobil tidak ditemukan. Coba kata kunci atau kategori lain.';
      inventoryGrid.appendChild(empty);
    } else if (visible && empty) empty.remove();
  }
  [search, type, sort].filter(Boolean).forEach(el => el.addEventListener('input', filterCars));
  filterCars();
}
const carInterest = document.getElementById('carInterest');
if (carInterest) {
  const car = new URLSearchParams(location.search).get('car');
  if (car) carInterest.value = car;
}
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = contactForm.elements.name.value.trim();
    showToast(`Terima kasih, ${name}! Pesan demo berhasil divalidasi.`);
    contactForm.reset();
  });
}
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { event.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});
