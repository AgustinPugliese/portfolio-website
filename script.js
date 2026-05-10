/* ════════════════════════════════════════════════════════════════
   SCROLL SUAVE A SECCIONES
════════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    const offset = window.innerWidth <= 640 ? 76 : 96;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════════════════════════════
   INTERSECTION OBSERVER — fade-in al hacer scroll
   FIX: el selector era '.card' que no existe; ahora usa [data-fade]
════════════════════════════════════════════════════════════════ */
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // FIX: ahora sí selecciona los elementos correctos
  document.querySelectorAll('[data-fade]').forEach((el) => io.observe(el));
}

/* ════════════════════════════════════════════════════════════════
   HEADER — clase 'scrolled' al bajar de 60px
════════════════════════════════════════════════════════════════ */
const header = document.getElementById('main-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ════════════════════════════════════════════════════════════════
   EFECTO TILT 3D EN TARJETAS (solo desktop con hover)
════════════════════════════════════════════════════════════════ */
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.project-card').forEach((card) => {
    const shine = card.querySelector('.project-shine');

    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;

      const rotateY = ((x - cx) / cx) * 7;
      const rotateX = -((y - cy) / cy) * 5;

      card.style.transform =
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (shine) {
        const shineX = (x / rect.width)  * 100;
        const shineY = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(
          circle at ${shineX}% ${shineY}%,
          rgba(255,255,255,0.14) 0%,
          transparent 55%
        )`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition =
        'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease, border-color 0.3s ease';
      card.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition =
        'transform 0.1s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   SKILLS CAROUSEL — navegación e interactividad
════════════════════════════════════════════════════════════════ */
const carousel = {
  currentGroup: 0,
  itemsPerGroup: 3,
  autoplayInterval: null,

  init() {
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.dot');

    if (!track || items.length === 0) return;

    // Establecer items activos iniciales
    this.updateActiveItems(items);

    // Event listeners
    prevBtn?.addEventListener('click', () => this.prev(items));
    nextBtn?.addEventListener('click', () => this.next(items));
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToGroup(index, items));
    });

    // Autoplay
    this.startAutoplay(items);

    // Pausar al hover
    track.addEventListener('mouseenter', () => this.stopAutoplay());
    track.addEventListener('mouseleave', () => this.startAutoplay(items));
  },

  updateActiveItems(items) {
    items.forEach((item, index) => {
      const isActive = index >= this.currentGroup * this.itemsPerGroup &&
                      index < (this.currentGroup + 1) * this.itemsPerGroup;
      item.classList.toggle('active', isActive);
    });
    this.updateDots();
  },

  updateDots() {
    const dots = document.querySelectorAll('.dot');
    const totalGroups = Math.ceil(6 / this.itemsPerGroup);
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentGroup % totalGroups);
    });
  },

  next(items) {
    const totalGroups = Math.ceil(6 / this.itemsPerGroup);
    this.currentGroup = (this.currentGroup + 1) % totalGroups;
    this.updateActiveItems(items);
  },

  prev(items) {
    const totalGroups = Math.ceil(6 / this.itemsPerGroup);
    this.currentGroup = (this.currentGroup - 1 + totalGroups) % totalGroups;
    this.updateActiveItems(items);
  },

  goToGroup(group, items) {
    this.currentGroup = group;
    this.updateActiveItems(items);
  },

  startAutoplay(items) {
    this.autoplayInterval = setInterval(() => {
      this.next(items);
    }, 5000);
  },

  stopAutoplay() {
    clearInterval(this.autoplayInterval);
  }
};

// Inicializar carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  carousel.init();
});