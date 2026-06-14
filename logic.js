// =============================================
//  logic.js — 메인 페이지 로직
//  Supabase에서 데이터를 가져와 각 섹션을 렌더링
// =============================================

// ── Supabase 초기화 ──────────────────────────
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── 기본값 (Supabase 연결 전 또는 데이터 없을 때 표시) ──
const DEFAULTS = {
  hero: {
    eyebrow:  '한국 전통 숯불구이',
    title:    '불판의 정석',
    subtitle: '30년 내공의 불맛, 그 한 점에 담다',
    bg_image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=1600&q=80',
  },
  about: {
    title:      '진심을 담은 한 점',
    desc:       '1994년부터 한자리를 지켜온 불판의 정석입니다. 매일 아침 직접 고른 신선한 국내산 한우만을 사용하며, 30년 넘게 변함없이 이어온 비법 양념과 참숯 화로로 최고의 맛을 선사합니다.',
    image:      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    stat_year:      '30+',
    stat_customers: '50만+',
    stat_award:     '12회',
  },
  contact: {
    title:     '찾아오세요',
    address:   '서울특별시 마포구 어울마당로 123',
    phone:     '02-1234-5678',
    hours:     '매일 11:30 – 22:00 (브레이크 15:00–17:00)',
    transport: '합정역 2번 출구 도보 5분',
  },
  menu: [
    { name: '한우 꽃등심', desc: '1++ 등급 한우 꽃등심, 참숯 직화', price: '75,000원 / 200g', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80' },
    { name: '한우 갈비살', desc: '촉촉한 마블링의 최상급 갈비살', price: '68,000원 / 200g', image: 'https://images.unsplash.com/photo-1567364816519-cbc9c4ffe1eb?w=600&q=80' },
    { name: '목살 구이', desc: '비법 양념에 재운 제주 흑돼지 목살', price: '18,000원 / 200g', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80' },
  ],
  gallery: [
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1000&q=80',
    'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80',
  ],
};

// ── 유틸 ─────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el && value) el.textContent = value;
}

function setImage(id, url) {
  const el = document.getElementById(id);
  if (el && url) el.src = url;
}

function setBg(id, url) {
  const el = document.getElementById(id);
  if (el && url) {
    el.style.backgroundImage = `url('${url}')`;
    setTimeout(() => el.classList.add('loaded'), 100);
  }
}

// ── HERO 렌더링 ───────────────────────────────
function renderHero(data) {
  const d = { ...DEFAULTS.hero, ...data };
  setText('hero-eyebrow', d.eyebrow);
  setText('hero-title',   d.title);
  setText('hero-subtitle', d.subtitle);
  setBg('hero-bg', d.bg_image);

  // 페이지 탭 제목 & 로고도 업데이트
  document.getElementById('page-title').textContent = d.title;
  document.getElementById('nav-logo').textContent   = d.title;
}

// ── ABOUT 렌더링 ──────────────────────────────
function renderAbout(data) {
  const d = { ...DEFAULTS.about, ...data };
  setText('about-title',      d.title);
  setText('about-desc',       d.desc);
  setImage('about-image',     d.image);
  setText('stat-year',        d.stat_year);
  setText('stat-customers',   d.stat_customers);
  setText('stat-award',       d.stat_award);
}

// ── MENU 렌더링 ───────────────────────────────
function renderMenu(items) {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;

  const list = (items && items.length > 0) ? items : DEFAULTS.menu;

  grid.innerHTML = list.map(item => `
    <div class="menu-card reveal">
      <div class="menu-card-img">
        <img src="${item.image || ''}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="menu-card-body">
        <p class="menu-card-name">${item.name}</p>
        <p class="menu-card-desc">${item.desc}</p>
        <p class="menu-card-price">${item.price}</p>
      </div>
    </div>
  `).join('');

  // 새로 생성된 카드에도 스크롤 reveal 적용
  observeReveal();
}

// ── GALLERY 렌더링 ────────────────────────────
function renderGallery(items) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  const list = (items && items.length > 0)
    ? items.map(i => i.image_url || i)
    : DEFAULTS.gallery;

  grid.innerHTML = list.map((url, idx) => `
    <div class="gallery-item reveal" style="transition-delay: ${idx * 0.08}s">
      <img src="${url}" alt="갤러리 이미지 ${idx + 1}" loading="lazy" />
    </div>
  `).join('');

  observeReveal();
}

// ── CONTACT 렌더링 ────────────────────────────
function renderContact(data) {
  const d = { ...DEFAULTS.contact, ...data };
  setText('contact-title',     d.title);
  setText('contact-address',   d.address);
  setText('contact-phone',     d.phone);
  setText('contact-hours',     d.hours);
  setText('contact-transport', d.transport);
}

// ── Supabase fetch ────────────────────────────
async function fetchAll() {
  try {
    // 각 테이블에서 병렬로 가져오기
    const [heroRes, aboutRes, menuRes, galleryRes, contactRes] = await Promise.all([
      db.from('site_hero').select('*').single(),
      db.from('site_about').select('*').single(),
      db.from('site_menu').select('*').order('order_num', { ascending: true }),
      db.from('site_gallery').select('*').order('order_num', { ascending: true }),
      db.from('site_contact').select('*').single(),
    ]);

    renderHero(heroRes.data);
    renderAbout(aboutRes.data);
    renderMenu(menuRes.data);
    renderGallery(galleryRes.data);
    renderContact(contactRes.data);

  } catch (err) {
    // Supabase 연결 전이거나 오류 시 기본값으로 렌더링
    console.warn('Supabase 연결 없음 — 기본값으로 표시합니다:', err.message);
    renderHero(null);
    renderAbout(null);
    renderMenu(null);
    renderGallery(null);
    renderContact(null);
  }
}

// ── 스크롤 Reveal 애니메이션 ──────────────────
function observeReveal() {
  const targets = document.querySelectorAll('.reveal:not(.observed)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach(el => {
    el.classList.add('observed');
    observer.observe(el);
  });
}

// ── 네비게이션: 모바일 햄버거 ─────────────────
function initNav() {
  const btn    = document.getElementById('nav-hamburger');
  const mobile = document.getElementById('nav-mobile');
  if (!btn || !mobile) return;

  btn.addEventListener('click', () => {
    mobile.classList.toggle('open');
  });

  // 모바일 메뉴 링크 클릭 시 닫기
  mobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobile.classList.remove('open'));
  });
}

// ── 네비게이션: 부드러운 스크롤 오프셋 ──────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 68;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });
}

// ── 초기 reveal 대상 등록 ─────────────────────
function initReveal() {
  document.querySelectorAll(
    '.about-grid, .about-text, .section-header, .contact-list, .contact-map'
  ).forEach(el => el.classList.add('reveal'));
  observeReveal();
}

// ── 진입점 ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSmoothScroll();
  initReveal();
  fetchAll();
});
