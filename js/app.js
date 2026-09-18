/* ═══════════════════════════════════════════════════════════
   Car-Spa Błysk — warstwa ruchu
   Jeden plik dla wszystkich podstron. Każdy blok sprawdza,
   czy jego elementy w ogóle są na stronie, więc ten sam skrypt
   obsługuje stronę główną z hero i preloaderem oraz podstrony
   z nagłówkiem i zasłoną przejścia.

   GSAP 3.13 (ScrollTrigger, na galerii też Flip) + Lenis,
   wszystko z CDN. Gdy CDN nie odpowie, watchdog zdejmuje klasę .anim
   i strona pokazuje się bez animacji.
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var root       = document.documentElement;
  var mniejRuchu = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loader     = document.getElementById('loader');
  var kurtyna    = document.getElementById('curtain');

  function odsloniec() {
    root.classList.remove('anim');
    if (loader) loader.style.display = 'none';
  }

  /* awaryjne wyjście, gdyby biblioteki nie doszły */
  var watchdog = setTimeout(odsloniec, 2500);

  if (mniejRuchu || typeof gsap === 'undefined') {
    clearTimeout(watchdog);
    odsloniec();
    menuMobilne();
    formularz();
    galeriaFiltry();
    podgladZdjecia();
    return;
  }

  clearTimeout(watchdog);

  // promienie w kontakcie: WebGL bez zależności, dociągane dopiero tutaj,
  // więc przy prefers-reduced-motion i bez GSAP-a w ogóle się nie ładują
  (function promienie() {
    if (!document.querySelector('.light-rays')) return;
    // na telefonie odpuszczamy: ciągły rAF z WebGL-em to niepotrzebny koszt baterii
    if (!window.matchMedia('(min-width: 768px)').matches) return;
    var kontener = document.querySelector('.light-rays');
    var s = document.createElement('script');
    s.src = 'js/light-rays.js';
    s.defer = true;
    document.body.appendChild(s);

    // shader przestaje rysować, kiedy kontakt wyjedzie z ekranu
    new IntersectionObserver(function (wpisy) {
      kontener._raysVisible = wpisy[0].isIntersecting;
    }, { rootMargin: '20% 0px' }).observe(kontener);
  })();

  gsap.registerPlugin(ScrollTrigger);
  var maFlip = typeof Flip !== 'undefined';
  if (maFlip) gsap.registerPlugin(Flip);

  /* ── płynny scroll ────────────────────────────────────── */
  var lenis = null;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.05, smoothWheel: true, touchMultiplier: 1.6 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var cel = document.querySelector(a.getAttribute('href'));
        if (!cel) return;
        e.preventDefault();
        zamknijMenu();
        lenis.scrollTo(cel, { offset: -70 });
      });
    });
  }

  /* ── rozbicie nagłówków na słowa w maskach ────────────── */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var slowa = el.textContent.trim().split(/\s+/);
    el.innerHTML = slowa.map(function (w) {
      return '<span class="rev"><span>' + w + '</span></span>';
    }).join(' ');
    gsap.set(el.querySelectorAll('.rev > span'), { yPercent: 105 });
    el.style.opacity = 1;      // .anim trzyma nagłówek ukryty do momentu rozbicia
  });

  // y:0 kasuje przesunięcie w px, które GSAP odczytał ze startowego
  // translateY(105%) w CSS — bez tego yPercent:0 nie wyzeruje transformu
  var tytulHero = document.querySelectorAll('.hero__title .line > span');
  if (tytulHero.length) gsap.set(tytulHero, { y: 0, yPercent: 105 });

  /* ── zasłona przejścia między stronami ────────────────── */
  var pasy = kurtyna ? kurtyna.querySelectorAll('i') : [];

  function zaslonaWyjdz() {
    if (!pasy.length) return gsap.timeline();
    kurtyna.classList.remove('is-busy');
    gsap.set(pasy, { transformOrigin: 'top', scaleY: 1 });
    return gsap.to(pasy, {
      scaleY: 0, duration: .65, ease: 'power3.inOut', stagger: .055
    });
  }

  (function przejsciaStron() {
    if (!pasy.length) return;

    function wyjdzNaStrone(url) {
      kurtyna.classList.add('is-busy');
      gsap.set(pasy, { transformOrigin: 'bottom' });
      gsap.to(pasy, {
        scaleY: 1, duration: .45, ease: 'power3.inOut', stagger: .05,
        onComplete: function () { window.location.href = url; }
      });
      // gdyby nawigacja się zablokowała, zasłona nie może zostać na zawsze
      setTimeout(function () { zaslonaWyjdz(); }, 2600);
    }

    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var a = e.target.closest('a');
      if (!a) return;

      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;
      if (/^(tel:|mailto:|javascript:)/i.test(href)) return;

      var u;
      try { u = new URL(a.href, location.href); } catch (err) { return; }
      if (u.origin !== location.origin) return;
      // kotwica na tej samej stronie idzie zwykłym scrollem
      if (u.pathname === location.pathname && u.hash) return;

      e.preventDefault();
      zamknijMenu();
      wyjdzNaStrone(u.href);
    });

    // powrót przyciskiem „wstecz" wyjmuje stronę z pamięci przeglądarki
    // razem z zasuniętą zasłoną — trzeba ją odsunąć jeszcze raz
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) zaslonaWyjdz();
    });
  })();

  /* ── wejście strony ───────────────────────────────────── */
  var tl = gsap.timeline();

  if (loader) {
    // strona główna: preloader z licznikiem, zasłona siedzi pod nim
    if (pasy.length) gsap.set(pasy, { scaleY: 0 });

    var licznik = { v: 0 };
    var numer = document.getElementById('loaderNum');

    tl.to('#loader .loader__mark', { opacity: 1, duration: .45, ease: 'power2.out' })
      .to('#loader .loader__bar i', { scaleX: 1, duration: .75, ease: 'power2.inOut' }, '<.1')
      .to(licznik, {
        v: 100, duration: .75, ease: 'power2.inOut',
        onUpdate: function () { if (numer) numer.textContent = Math.round(licznik.v); }
      }, '<')
      .to('#loader', { yPercent: -100, duration: .8, ease: 'expo.inOut' }, '+=.12')
      .set('#loader', { display: 'none' })

      .to('.hero__media img', { scale: 1, duration: 1.8, ease: 'expo.out' }, '-=.7')
      .to('.hero__title .line > span', {
        yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: .09
      }, '-=1.35')
      .to('.hero__lead, .hero__cta', {
        opacity: 1, y: 0, duration: .7, ease: 'expo.out', stagger: .08
      }, '-=.6');

  } else if (document.querySelector('.pagehead')) {
    // podstrona: zasłona odsuwa się, pod nią rusza nagłówek
    tl.add(zaslonaWyjdz(), 0)
      .to('.pagehead__media img', { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
      .from('.pagehead .crumbs', { opacity: 0, y: 12, duration: .6, ease: 'expo.out' }, .15)
      .to('.pagehead__title .rev > span', {
        yPercent: 0, duration: .95, ease: 'expo.out', stagger: .07
      }, .2)
      .to('.pagehead__lead', { opacity: 1, y: 0, duration: .7, ease: 'expo.out' }, .45);

  } else {
    // strony bez nagłówka ze zdjęciem (np. polityka prywatności)
    tl.add(zaslonaWyjdz(), 0);
  }

  /* ── nagłówek strony ──────────────────────────────────── */
  var nav = document.getElementById('nav');
  var pasek = document.getElementById('navProgress');
  if (nav) {
    ScrollTrigger.create({
      start: 'top -60',
      onUpdate: function (self) {
        nav.classList.toggle('is-stuck', self.scroll() > 60);
        var max = ScrollTrigger.maxScroll(window);
        if (pasek && max) gsap.set(pasek, { scaleX: Math.min(1, self.scroll() / max) });
      }
    });
  }

  /* ── pasek „Zadzwoń" ──────────────────────────────────── */
  (function pasekTelefonu() {
    var pasekTel = document.querySelector('.callbar');
    if (!pasekTel) return;
    var hero = document.querySelector('.hero');
    if (!hero) {
      // na podstronach nie ma drugiego przycisku z numerem w hero,
      // więc pasek może stać od razu
      pasekTel.classList.add('is-on');
      return;
    }
    ScrollTrigger.create({
      trigger: hero, start: 'bottom top',
      onEnter: function () { pasekTel.classList.add('is-on'); },
      onLeaveBack: function () { pasekTel.classList.remove('is-on'); }
    });
  })();

  /* ── odsłanianie przy scrollu ─────────────────────────── */
  gsap.utils.toArray('[data-rise], [data-fade]').forEach(function (el) {
    if (el.closest('.hero') || el.closest('.pagehead')) return;   // te robi timeline wejściowy
    gsap.to(el, {
      opacity: 1, y: 0, duration: .8, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  gsap.utils.toArray('[data-split]').forEach(function (el) {
    if (el.closest('.pagehead')) return;
    gsap.to(el.querySelectorAll('.rev > span'), {
      yPercent: 0, duration: 1, ease: 'expo.out', stagger: .07,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });

  /* kroki — zwykła kaskada */
  (function krokiWejscie() {
    var lista = document.querySelector('.steps');
    if (!lista) return;
    gsap.to(lista.querySelectorAll('[data-card]'), {
      opacity: 1, y: 0, duration: .7, ease: 'expo.out', stagger: .045,
      scrollTrigger: { trigger: lista, start: 'top 82%' }
    });
  })();

  /* kafle usług zlatują się do siatki z rozrzuconych pozycji —
     technika ze „Scroll Animation/39" (Spotlight Features), bez pinowania */
  (function kafleWejscie() {
    var siatka = document.querySelector('.cards');
    if (!siatka) return;
    var kafle = gsap.utils.toArray(siatka.querySelectorAll('[data-card]'));
    if (!kafle.length) return;

    var srodek = siatka.getBoundingClientRect();
    kafle.forEach(function (kafel) {
      var r = kafel.getBoundingClientRect();
      // im dalej kafel leży od środka siatki, tym dalej startuje
      var dx = (r.left + r.width / 2) - (srodek.left + srodek.width / 2);
      var dy = (r.top + r.height / 2) - (srodek.top + srodek.height / 2);
      gsap.set(kafel, {
        opacity: 0,
        x: gsap.utils.clamp(-160, 160, dx * 0.22),
        y: gsap.utils.clamp(-90, 120, dy * 0.18 + 40),
        rotation: gsap.utils.clamp(-5, 5, dx * 0.008),
        scale: .92
      });
    });

    gsap.to(kafle, {
      opacity: 1, x: 0, y: 0, rotation: 0, scale: 1,
      duration: 1.1, ease: 'expo.out', stagger: { each: .05, from: 'center' },
      scrollTrigger: { trigger: siatka, start: 'top 80%' }
    });
  })();

  /* kafle usług na podstronie — prosty reveal grupami */
  (function uslugiWejscie() {
    gsap.utils.toArray('.srvs').forEach(function (lista) {
      gsap.to(lista.querySelectorAll('[data-card]'), {
        opacity: 1, y: 0, duration: .8, ease: 'expo.out', stagger: .08,
        scrollTrigger: { trigger: lista, start: 'top 84%' }
      });
    });
  })();

  /* ── kafle usług: poświata za kursorem i przechył ─────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.card').forEach(function (kafel) {
      var rx = gsap.quickTo(kafel, 'rotationX', { duration: .5, ease: 'power3.out' });
      var ry = gsap.quickTo(kafel, 'rotationY', { duration: .5, ease: 'power3.out' });

      kafel.addEventListener('pointermove', function (e) {
        var r = kafel.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width;
        var ny = (e.clientY - r.top) / r.height;
        kafel.style.setProperty('--px', (nx * 100).toFixed(1) + '%');
        kafel.style.setProperty('--py', (ny * 100).toFixed(1) + '%');
        ry((nx - .5) * 5);
        rx((.5 - ny) * 5);
      });
      kafel.addEventListener('pointerleave', function () { rx(0); ry(0); });
    });
  }

  /* ── kroki: numery zapalają się przy scrollu ─────────── */
  (function kroki() {
    var lista = document.querySelector('.steps');
    if (!lista) return;

    lista.querySelectorAll('.steps__no').forEach(function (nr) {
      gsap.to(nr, {
        backgroundColor: '#F5B647', color: '#171518', borderColor: '#F5B647',
        duration: .4, ease: 'power2.out',
        scrollTrigger: { trigger: nr.parentNode, start: 'top 68%' }
      });
    });
  })();

  /* ── pozioma galeria na stronie głównej ───────────────── */
  (function galeria() {
    var sekcja = document.querySelector('.work');
    var track  = document.getElementById('workTrack');
    if (!sekcja || !track) return;

    var desktop = window.matchMedia('(min-width: 1024px)');
    var st = null;

    function dystans() {
      return Math.max(0, track.scrollWidth - window.innerWidth);
    }

    function wlacz() {
      if (st) return;
      st = gsap.to(track, {
        x: function () { return -dystans(); },
        ease: 'none',
        scrollTrigger: {
          trigger: sekcja,
          start: 'top top',
          // 0,72 skraca przypięcie — przy 13 kadrach pełne 1:1 dałoby cztery ekrany scrolla
          end: function () { return '+=' + (dystans() * 0.72 + window.innerHeight * 0.3); },
          pin: true,
          scrub: .8,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
    }

    function wylacz() {
      if (!st) return;
      st.scrollTrigger.kill(true);
      st.kill();
      gsap.set(track, { clearProps: 'transform' });
      st = null;
    }

    if (desktop.matches) wlacz();
    desktop.addEventListener('change', function (e) { e.matches ? wlacz() : wylacz(); });

    /* paralaksa zdjęć wewnątrz kadrów */
    var kadry = Array.prototype.slice.call(track.querySelectorAll('.shot'));
    var widoczna = false;
    new IntersectionObserver(function (wpisy) {
      widoczna = wpisy[0].isIntersecting;
    }, { rootMargin: '10% 0px' }).observe(sekcja);

    gsap.ticker.add(function () {
      if (!widoczna || !desktop.matches) return;
      var srodek = window.innerWidth / 2;
      for (var i = 0; i < kadry.length; i++) {
        var r = kadry[i].getBoundingClientRect();
        if (r.right < -300 || r.left > window.innerWidth + 300) continue;
        var img = kadry[i].firstElementChild;
        var d = (r.left + r.width / 2 - srodek) * -0.055;
        img.style.transform = 'translate3d(' + d.toFixed(1) + 'px,0,0) scale(1.12)';
      }
    });
  })();

  /* ── pas z adresem: kadr otwiera się z wąskiej szczeliny ─
     clip-path + kontr-skala zdjęcia, technika ze „Scroll Animation/41" */
  (function pasAdres() {
    var media = document.querySelector('.band__media');
    if (!media) return;
    gsap.to(media, {
      clipPath: 'inset(0% 0 0% 0)', ease: 'none',
      scrollTrigger: { trigger: '.band', start: 'top 85%', end: 'top 25%', scrub: .7 }
    });
    gsap.to(media.querySelector('img'), {
      scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.band', start: 'top 85%', end: 'top 15%', scrub: .7 }
    });
  })();

  /* ── paralaksa zdjęcia w sekcji dwukolumnowej ─────────── */
  gsap.utils.toArray('[data-parallax] img').forEach(function (img) {
    gsap.fromTo(img, { yPercent: -7, scale: 1.12 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ── magnetyczne przyciski ────────────────────────────── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('[data-magnet]').forEach(function (el) {
      var sx = gsap.quickTo(el, 'x', { duration: .45, ease: 'power3.out' });
      var sy = gsap.quickTo(el, 'y', { duration: .45, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        sx((e.clientX - r.left - r.width / 2) * 0.28);
        sy((e.clientY - r.top - r.height / 2) * 0.42);
      });
      el.addEventListener('pointerleave', function () { sx(0); sy(0); });
    });
  }

  menuMobilne();
  formularz();
  galeriaFiltry();
  podgladZdjecia();

  // sort() przed refresh() jest konieczny: pin galerii powstaje później niż
  // wyzwalacze sekcji pod nią, więc bez posortowania liczą one pozycje bez
  // rozpiętości pinu i odpalają się o dwa ekrany za wcześnie
  function przelicz() { ScrollTrigger.sort(); ScrollTrigger.refresh(); }
  przelicz();
  window.addEventListener('load', przelicz);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(przelicz);

  /* ═══════════════════════════════════════════════════════
     Rzeczy działające też bez GSAP-a
     ═══════════════════════════════════════════════════════ */

  function zamknijMenu() {
    var menu = document.getElementById('menu');
    var burger = document.getElementById('burger');
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Otwórz menu');
    document.body.style.overflow = '';
    if (typeof lenis !== 'undefined' && lenis) lenis.start();
  }

  function menuMobilne() {
    var menu   = document.getElementById('menu');
    var burger = document.getElementById('burger');
    if (!menu || !burger) return;

    burger.addEventListener('click', function () {
      var otwarte = burger.getAttribute('aria-expanded') === 'true';
      if (otwarte) { zamknijMenu(); return; }
      menu.hidden = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Zamknij menu');
      document.body.style.overflow = 'hidden';
      if (typeof lenis !== 'undefined' && lenis) lenis.stop();
      if (typeof gsap !== 'undefined' && !mniejRuchu) {
        gsap.fromTo(menu.querySelectorAll('nav a, .menu__logo, .menu__foot'),
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: .55, ease: 'expo.out', stagger: .05 });
      }
      menu.querySelector('nav a').focus();
    });

    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', zamknijMenu);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') zamknijMenu();
    });
  }

  function formularz() {
    var form = document.getElementById('form');
    if (!form) return;
    var status = document.getElementById('formStatus');

    function blad(input, tekst) {
      var box = form.querySelector('[data-err-for="' + input.id + '"]');
      input.closest('.field').classList.toggle('is-bad', !!tekst);
      input.setAttribute('aria-invalid', tekst ? 'true' : 'false');
      if (!box) return;
      box.textContent = tekst || '';
      box.hidden = !tekst;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var imie = form.querySelector('#f-imie');
      var tel  = form.querySelector('#f-tel');
      var ok = true;

      if (imie.value.trim().length < 2) { blad(imie, 'Podaj imię.'); ok = false; } else blad(imie, '');

      var cyfry = tel.value.replace(/\D/g, '');
      if (cyfry.length < 9) { blad(tel, 'Numer ma dziewięć cyfr.'); ok = false; } else blad(tel, '');

      if (!ok) {
        status.textContent = '';
        form.querySelector('.is-bad input').focus();
        return;
      }
      status.textContent = 'Formularz nie jest jeszcze podpięty pod skrzynkę. Zadzwoń: 511 127 795.';
    });

    form.querySelectorAll('input').forEach(function (i) {
      i.addEventListener('input', function () {
        if (i.closest('.field').classList.contains('is-bad')) blad(i, '');
      });
    });
  }

  /* ── galeria: filtry kategorii ────────────────────────── */
  /* Przelayoutowanie siatki idzie przez GSAP Flip — kafle jadą
     na nowe miejsca zamiast przeskakiwać (Grid Animations/1).

     Dwie rzeczy, bez których przełączanie kategorii szarpie stroną:
     1. `absolute:true` wyjmuje z układu WSZYSTKIE kafle, więc siatka na czas
        animacji ma wysokość zero, dokument skraca się o kilka ekranów,
        przeglądarka przycina pozycję przewijania i widok wyskakuje w górę.
        `absoluteOnLeave:true` wyjmuje tylko te znikające.
     2. Siatka i tak kurczy się od razu do docelowej wysokości, więc na czas
        animacji trzyma ją `min-height`. Zwalniamy je dopiero na końcu i wtedy
        cofamy widok tak, żeby pasek filtrów został tam, gdzie był przy kliknięciu. */
  function galeriaFiltry() {
    var gal    = document.getElementById('gal');
    var filtry = document.getElementById('filtry');
    if (!gal || !filtry) return;

    var pozycje = Array.prototype.slice.call(gal.children);
    var info    = document.getElementById('galInfo');
    var biegnie = null;   // trwająca animacja Flip, jeśli jakaś jest

    function opisz(ile) {
      if (!info) return;
      info.textContent = ile === pozycje.length
        ? 'Widocznych kadrów: ' + ile
        : 'Widocznych kadrów: ' + ile + ' z ' + pozycje.length;
    }

    function przewinDo(y) {
      if (lenis && typeof lenis.scrollTo === 'function') lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }

    function zakoncz(kotwica) {
      gal.style.minHeight = '';
      var roznica = filtry.getBoundingClientRect().top - kotwica;
      if (Math.abs(roznica) > 1) przewinDo(window.scrollY + roznica);
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }

    function ustaw(kat, btn) {
      // szybkie klikanie po filtrach nie może gubić kliknięć: zamiast je
      // ignorować, dobijamy poprzednią animację do końca i liczymy stan od nowa.
      // progress(1) nie odpala onComplete, więc sprzątanie idzie tutaj wprost
      if (biegnie) {
        biegnie.progress(1).kill();
        biegnie = null;
        gsap.set(pozycje, { clearProps: 'opacity,scale' });
      }

      var plynnie = typeof Flip !== 'undefined' && typeof gsap !== 'undefined' && !mniejRuchu;
      var stan    = plynnie ? Flip.getState(pozycje) : null;
      var kotwica = filtry.getBoundingClientRect().top;

      // wysokość zamrażamy PRZED ukryciem kafli: dokument skraca się przy
      // pierwszym układzie po zmianie, a wtedy jest już za późno — przeglądarka
      // zdążyła przyciąć pozycję przewijania
      if (plynnie) gal.style.minHeight = gal.offsetHeight + 'px';

      pozycje.forEach(function (li) {
        li.hidden = !(kat === 'all' || li.getAttribute('data-kat') === kat);
      });
      filtry.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
      opisz(pozycje.filter(function (li) { return !li.hidden; }).length);

      if (!plynnie) { zakoncz(kotwica); return; }

      biegnie = Flip.from(stan, {
        duration: .6, ease: 'expo.out', absoluteOnLeave: true,
        onEnter: function (el) {
          return gsap.fromTo(el, { opacity: 0, scale: .88 },
            { opacity: 1, scale: 1, duration: .5, ease: 'expo.out' });
        },
        onLeave: function (el) {
          return gsap.to(el, { opacity: 0, scale: .88, duration: .28 });
        },
        onComplete: function () {
          biegnie = null;
          gsap.set(pozycje, { clearProps: 'opacity,scale' });
          zakoncz(kotwica);
        }
      });
    }

    filtry.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filtr]');
      if (b) ustaw(b.getAttribute('data-filtr'), b);
    });

    opisz(pozycje.length);
  }

  /* ── galeria: podgląd zdjęcia ─────────────────────────── */
  function podgladZdjecia() {
    var lbox = document.getElementById('lbox');
    if (!lbox) return;

    var obraz = document.getElementById('lboxImg');
    var btnX = document.getElementById('lboxX');
    var btnPrev = document.getElementById('lboxPrev');
    var btnNext = document.getElementById('lboxNext');
    var wszystkie = Array.prototype.slice.call(document.querySelectorAll('.gal__item'));
    if (!wszystkie.length) return;

    var lista = [], i = 0, wrocDo = null;

    function rysuj() {
      var b = lista[i];
      obraz.src = b.getAttribute('data-full');
      obraz.alt = b.querySelector('img').alt;
      if (typeof gsap !== 'undefined' && !mniejRuchu) {
        gsap.fromTo(obraz, { opacity: 0, scale: .97 },
          { opacity: 1, scale: 1, duration: .35, ease: 'power2.out' });
      }
    }

    function otworz(b) {
      lista = wszystkie.filter(function (x) { return !x.parentElement.hidden; });
      i = lista.indexOf(b);
      if (i < 0) { lista = wszystkie; i = wszystkie.indexOf(b); }
      wrocDo = b;
      rysuj();
      lbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (typeof lenis !== 'undefined' && lenis) lenis.stop();
      if (typeof gsap !== 'undefined' && !mniejRuchu) {
        gsap.fromTo(lbox, { opacity: 0 }, { opacity: 1, duration: .25, ease: 'power2.out' });
      }
      btnX.focus();
    }

    function zamknij() {
      lbox.hidden = true;
      obraz.src = '';
      document.body.style.overflow = '';
      if (typeof lenis !== 'undefined' && lenis) lenis.start();
      if (wrocDo) wrocDo.focus();
    }

    function skocz(o) {
      if (!lista.length) return;
      i = (i + o + lista.length) % lista.length;
      rysuj();
    }

    wszystkie.forEach(function (b) {
      b.addEventListener('click', function () { otworz(b); });
    });

    btnX.addEventListener('click', zamknij);
    btnPrev.addEventListener('click', function () { skocz(-1); });
    btnNext.addEventListener('click', function () { skocz(1); });

    lbox.addEventListener('click', function (e) {
      if (e.target === lbox) zamknij();
    });

    document.addEventListener('keydown', function (e) {
      if (lbox.hidden) return;
      if (e.key === 'Escape') { e.stopPropagation(); zamknij(); }
      else if (e.key === 'ArrowLeft') skocz(-1);
      else if (e.key === 'ArrowRight') skocz(1);
      else if (e.key === 'Tab') {
        // w podglądzie klikalne są tylko trzy przyciski — focus krąży między nimi
        var pola = [btnX, btnPrev, btnNext];
        var akt = pola.indexOf(document.activeElement);
        e.preventDefault();
        var nast = e.shiftKey ? (akt - 1 + pola.length) % pola.length
                              : (akt + 1) % pola.length;
        pola[nast < 0 ? 0 : nast].focus();
      }
    });
  }
})();
