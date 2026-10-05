/* Motion layer — progressive enhancement only.
   Without JS (or with reduced motion) every element renders in its final state. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  // Scroll progress bar
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  var ticking = false;
  function updateBar() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(updateBar); }
  }, { passive: true });
  updateBar();

  // Marquee ticker for the highlight banner (clone is hidden from assistive tech)
  var banner = document.querySelector('.highlight-banner');
  if (banner && !reduce) {
    var item = document.createElement('span');
    item.className = 'marquee-item';
    while (banner.firstChild) item.appendChild(banner.firstChild);
    var track = document.createElement('span');
    track.className = 'marquee-track';
    track.appendChild(item);
    for (var c = 0; c < 3; c++) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
    banner.appendChild(track);
    banner.classList.add('is-marquee');
  }

  if (reduce || !('IntersectionObserver' in window)) return;

  root.classList.add('motion-ready');

  // Split hero name into animated letters, keeping an accessible label
  var h1 = document.querySelector('.hero-content h1');
  if (h1) {
    var text = h1.textContent.trim();
    h1.setAttribute('aria-label', text);
    h1.textContent = '';
    var i = 0;
    text.split(' ').forEach(function (word, w) {
      var wordEl = document.createElement('span');
      wordEl.className = 'word';
      wordEl.setAttribute('aria-hidden', 'true');
      word.split('').forEach(function (ch) {
        var s = document.createElement('span');
        s.className = 'char';
        s.style.setProperty('--i', i++);
        s.textContent = ch;
        wordEl.appendChild(s);
      });
      if (w) h1.appendChild(document.createTextNode(' '));
      h1.appendChild(wordEl);
    });
  }

  // Scroll reveal with per-group stagger
  var groups = [
    '.section-title', '.page-title', '.research-area', '.stat-item', '.card',
    '.news-item', '.event-card', '.person-card', '.people-section h3',
    '.course-card', '.timeline-item', '.pub-year h3', '.view-all'
  ];
  var targets = document.querySelectorAll(groups.join(','));
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el) {
    var siblings = el.parentElement ? el.parentElement.children : [];
    var idx = Array.prototype.indexOf.call(siblings, el);
    el.style.setProperty('--reveal-delay', Math.min(idx % 6, 5) * 0.08 + 's');
    el.setAttribute('data-reveal', '');
    io.observe(el);
  });

  // Count-up stats
  var nums = document.querySelectorAll('.stat-number');
  var countIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      var el = e.target;
      var m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      var end = parseInt(m[1], 10), suffix = m[2], start = null, dur = 1400;
      function step(t) {
        if (start === null) start = t;
        var p = Math.min((t - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(end * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  nums.forEach(function (n) { countIO.observe(n); });
})();
