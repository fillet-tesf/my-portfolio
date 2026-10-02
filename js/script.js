const root = document.documentElement;
const body = document.body;
const nav = document.querySelector('.site-nav');
const mobileToggle = document.querySelector('.mobile-toggle');
const themeToggle = document.querySelector('.theme-toggle');
const scrollTopButton = document.querySelector('.scroll-top');
const yearElement = document.querySelector('#year');
const revealItems = document.querySelectorAll('.reveal');
const skillBars = document.querySelectorAll('.skill-bar span');
const filterButtons = document.querySelectorAll('[data-filter]');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('#contact-form');
const contactFeedback = document.querySelector('#contact-feedback');
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const currentPage = document.documentElement.dataset.page;
let savedTheme = null;

try {
  savedTheme = localStorage.getItem('portfolio-theme');
} catch (error) {
  savedTheme = null;
}

if (savedTheme === 'light') {
  root.setAttribute('data-theme', 'light');
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (themeToggle) {
  themeToggle.setAttribute('aria-pressed', String(savedTheme !== 'light'));
}

const setActiveNavItem = () => {
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const isCurrent = (currentPage === 'home' && link.getAttribute('href') === 'index.html')
      || link.getAttribute('href')?.includes(`${currentPage}.html`);

    link.classList.toggle('active', isCurrent);
    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

setActiveNavItem();

const closeNavigation = () => {
  if (!nav || !mobileToggle) return;
  nav.classList.remove('is-open');
  body.classList.remove('nav-open');
  mobileToggle.setAttribute('aria-expanded', 'false');
};

if (mobileToggle && nav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    body.classList.toggle('nav-open', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.matches('a')) {
      closeNavigation();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      closeNavigation();
      mobileToggle.focus();
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';

    if (isLight) {
      root.removeAttribute('data-theme');
      try {
        localStorage.setItem('portfolio-theme', 'dark');
      } catch (error) {
      }
      themeToggle.setAttribute('aria-pressed', 'true');
    } else {
      root.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('portfolio-theme', 'light');
      } catch (error) {
      }
      themeToggle.setAttribute('aria-pressed', 'false');
    }
  });
}

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const skillRoot = document.querySelector('.skills-grid');
if (skillRoot && skillBars.length) {
  if (reduceMotion || !('IntersectionObserver' in window)) {
    skillBars.forEach((bar) => {
      bar.style.width = `${bar.dataset.level}%`;
    });
  } else {
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        skillBars.forEach((bar) => {
          bar.style.width = `${bar.dataset.level}%`;
        });
        skillObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    skillObserver.observe(skillRoot);
  }
}

if (filterButtons.length && projectCards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      if (!filter) return;

      filterButtons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');

      projectCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category.includes(filter);
        card.classList.toggle('is-hidden', !matches);
      });
    });
  });
}

const updateScrollState = () => {
  if (!scrollTopButton) return;
  scrollTopButton.classList.toggle('is-visible', window.scrollY > 500);
};

window.addEventListener('scroll', updateScrollState, { passive: true });
updateScrollState();

if (scrollTopButton) {
  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

if (contactForm) {
  const setFeedback = (message) => {
    if (contactFeedback) {
      contactFeedback.textContent = message;
    }
  };

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !message || !contactForm.checkValidity()) {
      setFeedback('Error: Please complete all required fields before sending your message.');
      const firstInvalidField = contactForm.querySelector(':invalid');
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
    setFeedback('Opening your email app. Review the draft there and send it to deliver your message.');
    window.location.href = `mailto:tesfalemmathewos20@gmail.com?subject=${subject}&body=${body}`;
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});
