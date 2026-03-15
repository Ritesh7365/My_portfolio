(function () {
  'use strict';

  // ----- Typing effect (Hero) -----
  const roles = ['Flutter Developer', 'AI Enthusiast', 'IoT Developer'];
  const typingEl = document.getElementById('typing-role');
  if (typingEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 80;
    const deleteSpeed = 50;
    const pauseAfterType = 2000;
    const pauseAfterDelete = 600;

    function type() {
      const current = roles[roleIndex];
      if (isDeleting) {
        typingEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
      }

      let delay = isDeleting ? deleteSpeed : typeSpeed;
      if (!isDeleting && charIndex === current.length) {
        delay = pauseAfterType;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        delay = pauseAfterDelete;
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
      setTimeout(type, delay);
    }
    setTimeout(type, 400);
  }

  // ----- Scroll reveal -----
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
  );
  revealEls.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ----- Parallax (subtle) -----
  const parallaxBg = document.querySelector('.parallax-bg');
  if (parallaxBg) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.15;
      parallaxBg.style.transform = 'translate3d(0, ' + rate + 'px, 0)';
    }, { passive: true });
  }

  // ----- Smooth scroll for anchor links -----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ----- Mobile menu -----
  const sidemenu = document.getElementById('sidemenu');
  const menuToggle = document.getElementById('menu-toggle');
  if (sidemenu && menuToggle) {
    function setMenuOpen(open) {
      if (window.innerWidth > 900) {
        sidemenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.querySelector('i').className = 'fa-solid fa-bars';
        return;
      }
      sidemenu.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
    menuToggle.addEventListener('click', function () {
      if (window.innerWidth > 900) return;
      setMenuOpen(!sidemenu.classList.contains('open'));
    });
    sidemenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 900) setMenuOpen(false);
      });
    });
    window.addEventListener('resize', function () {
      setMenuOpen(false);
    });
    setMenuOpen(false);
  }

  // ----- Tabs (About) -----
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabLinks.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      tabLinks.forEach(function (b) {
        b.classList.remove('active-link');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(function (panel) {
        panel.classList.remove('active-tab');
        panel.hidden = panel.id !== tabId;
      });
      this.classList.add('active-link');
      this.setAttribute('aria-selected', 'true');
      var targetPanel = document.getElementById(tabId);
      if (targetPanel) {
        targetPanel.classList.add('active-tab');
        targetPanel.hidden = false;
      }
    });
  });

  // ----- Contact form (Google Sheets) -----
  const form = document.getElementById('contact-form');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbyIGWiLvXrlF_h_FRCFGInq5s61HsixfzgKfXl-wc5GOF-aMpkXtwvpW036eBx35sYq/exec';
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(function () {
          submitBtn.textContent = 'Sent!';
          form.reset();
          setTimeout(function () {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 3000);
        })
        .catch(function (err) {
          console.error('Error:', err);
          submitBtn.textContent = 'Try again';
          submitBtn.disabled = false;
        });
    });
  }

  // ----- Footer year -----
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
