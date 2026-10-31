/* Original RC adaptations. Explicit initialization; no network or dependencies. */
(() => {
  'use strict';
  const instances = new WeakMap();

  function assertRoot(root) {
    if (!root || !root.matches || !root.matches('.rc-ui.rc-effects')) {
      throw new TypeError('RCEffects.init requires a .rc-ui.rc-effects element.');
    }
    if (root.parentElement?.closest('.rc-effects') || root.querySelector('.rc-effects')) {
      throw new TypeError('RC effects roots must not be nested.');
    }
  }

  function init(root) {
    assertRoot(root);
    instances.get(root)?.destroy();
    const doc = root.ownerDocument;
    const win = doc.defaultView;
    const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = win.matchMedia('(hover: hover) and (pointer: fine)');
    const seen = new WeakSet();
    const activeSlides = new WeakMap();
    let dead = false;
    let generation = 0;
    let controller;
    let cleanups = [];
    let frames = new Set();
    let timers = new Set();
    let syncPreferences = () => {};

    const owned = element => element.closest('.rc-effects') === root;
    const query = selector => [...root.querySelectorAll(selector)].filter(owned);
    const profile = () => root.dataset.effectProfile || 'restrained';
    const motion = () => !reduced.matches && root.dataset.motion !== 'reduced' &&
      root.dataset.performance !== 'low';
    const activeMotion = () => motion() && !doc.hidden;
    const expressive = () => profile() === 'expressive' || profile() === 'showcase';

    function on(target, name, handler, options = {}) {
      target.addEventListener(name, handler, { ...options, signal: controller.signal });
    }
    function frame(callback) {
      const id = win.requestAnimationFrame(() => {
        frames.delete(id);
        if (!dead) callback();
      });
      frames.add(id);
      return id;
    }
    function cancelFrame(id) {
      win.cancelAnimationFrame(id);
      frames.delete(id);
    }
    function later(callback, delay) {
      const id = win.setTimeout(() => {
        timers.delete(id);
        if (!dead) callback();
      }, delay);
      timers.add(id);
      return id;
    }
    function cancelTimer(id) {
      win.clearTimeout(id);
      timers.delete(id);
    }
    function preserveAttribute(element, name) {
      const original = element.getAttribute(name);
      cleanups.push(() => {
        if (original === null) element.removeAttribute(name);
        else element.setAttribute(name, original);
      });
    }
    function preserveStyles(element, names) {
      const values = names.map(name => [name, element.style.getPropertyValue(name),
        element.style.getPropertyPriority(name)]);
      cleanups.push(() => values.forEach(([name, value, priority]) => {
        if (value) element.style.setProperty(name, value, priority);
        else element.style.removeProperty(name);
      }));
    }
    function disposeBindings() {
      controller?.abort();
      frames.forEach(id => win.cancelAnimationFrame(id));
      timers.forEach(id => win.clearTimeout(id));
      frames.clear();
      timers.clear();
      for (const cleanup of cleanups.reverse()) cleanup();
      cleanups = [];
      syncPreferences = () => {};
    }

    function syncTheme() {
      const dark = root.dataset.theme === 'dark';
      for (const button of query('[data-rc-theme-toggle]')) {
        button.setAttribute('aria-pressed', String(dark));
        button.setAttribute('aria-label', button.dataset.rcThemeLabel || '深色模式');
      }
    }
    function setTheme(theme) {
      if (dead) return;
      if (theme !== 'light' && theme !== 'dark') throw new TypeError('Theme must be light or dark.');
      root.dataset.theme = theme;
      syncTheme();
      root.dispatchEvent(new win.CustomEvent('rc:themechange', { bubbles: true, detail: { theme } }));
    }

    function mount() {
      assertRoot(root);
      controller = new win.AbortController();
      const mountedGeneration = ++generation;
      const resets = [];
      const preferenceHooks = [];
      const reveals = [];
      preserveAttribute(root, 'data-rc-suspended');

      for (const element of query('[data-rc-spotlight], [data-rc-tilt]')) {
        let pending = 0;
        let point;
        const properties = ['--rc-pointer-x', '--rc-pointer-y', '--rc-tilt-x', '--rc-tilt-y'];
        preserveStyles(element, properties);
        preserveAttribute(element, 'data-rc-pointer-active');
        const reset = () => {
          if (pending) cancelFrame(pending);
          pending = 0;
          point = null;
          element.removeAttribute('data-rc-pointer-active');
          element.style.setProperty('--rc-tilt-x', '0deg');
          element.style.setProperty('--rc-tilt-y', '0deg');
        };
        resets.push(reset);
        on(element, 'pointermove', event => {
          if (!activeMotion() || !expressive() || !fine.matches || event.pointerType === 'touch') return;
          point = { x: event.clientX, y: event.clientY };
          if (pending) return;
          pending = frame(() => {
            pending = 0;
            if (!point || !element.isConnected || !activeMotion() || !expressive()) return;
            const rect = element.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            const x = Math.max(0, Math.min(rect.width, point.x - rect.left));
            const y = Math.max(0, Math.min(rect.height, point.y - rect.top));
            element.style.setProperty('--rc-pointer-x', `${x.toFixed(2)}px`);
            element.style.setProperty('--rc-pointer-y', `${y.toFixed(2)}px`);
            element.setAttribute('data-rc-pointer-active', 'true');
            if (element.hasAttribute('data-rc-tilt')) {
              const limit = profile() === 'showcase' ? 3 : 1.5;
              element.style.setProperty('--rc-tilt-x', `${((0.5 - y / rect.height) * limit * 2).toFixed(2)}deg`);
              element.style.setProperty('--rc-tilt-y', `${((x / rect.width - 0.5) * limit * 2).toFixed(2)}deg`);
            }
          });
        }, { passive: true });
        on(element, 'pointerleave', reset);
        on(element, 'pointercancel', reset);
      }
      const resetPointers = () => resets.forEach(reset => reset());
      on(win, 'scroll', resetPointers, { capture: true, passive: true });
      on(win, 'resize', resetPointers, { passive: true });
      on(win, 'blur', resetPointers);

      for (const element of query('[data-rc-ripple]')) {
        const waves = new Set();
        const removeWaves = () => {
          for (const entry of [...waves]) entry.remove();
        };
        cleanups.push(removeWaves);
        preferenceHooks.push(() => { if (!activeMotion() || !expressive()) removeWaves(); });
        on(element, 'click', event => {
          if (event.target.closest?.('[data-rc-ripple]') !== element) return;
          if (!activeMotion() || !expressive() || element.disabled || element.getAttribute('aria-disabled') === 'true') return;
          const rect = element.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          removeWaves();
          const x = event.detail ? event.clientX - rect.left : rect.width / 2;
          const y = event.detail ? event.clientY - rect.top : rect.height / 2;
          const size = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y)) * 2;
          const node = doc.createElement('span');
          node.className = 'rc-ripple-wave';
          node.setAttribute('aria-hidden', 'true');
          node.style.setProperty('--rc-ripple-x', `${x}px`);
          node.style.setProperty('--rc-ripple-y', `${y}px`);
          node.style.setProperty('--rc-ripple-size', `${size}px`);
          const entry = { node, timer: 0, remove: null };
          const remove = () => {
            cancelTimer(entry.timer);
            waves.delete(entry);
            node.removeEventListener('animationend', remove);
            node.remove();
          };
          entry.remove = remove;
          node.addEventListener('animationend', remove, { once: true });
          entry.timer = later(remove, 750);
          waves.add(entry);
          element.append(node);
        });
      }

      let revealObserver;
      const reveal = element => {
        seen.add(element);
        element.classList.add('is-revealed');
        revealObserver?.unobserve(element);
      };
      if ('IntersectionObserver' in win) {
        revealObserver = new win.IntersectionObserver(entries => {
          if (dead || generation !== mountedGeneration) return;
          for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
        }, { threshold: 0.05 });
        cleanups.push(() => revealObserver.disconnect());
      }
      query('[data-rc-reveal]').forEach((element, index) => {
        preserveAttribute(element, 'data-reveal-ready');
        preserveStyles(element, ['--rc-reveal-delay']);
        const wasRevealed = element.classList.contains('is-revealed');
        cleanups.push(() => element.classList.toggle('is-revealed', wasRevealed));
        const settle = event => {
          if (event.target === element && event.animationName === 'rc-effects-reveal') {
            element.removeAttribute('data-reveal-ready');
          }
        };
        on(element, 'animationend', settle);
        on(element, 'animationcancel', settle);
        element.style.setProperty('--rc-reveal-delay', `${Math.min(index * 24, 160)}ms`);
        reveals.push(element);
        if (!activeMotion() || !revealObserver || seen.has(element) || wasRevealed) reveal(element);
        else {
          revealObserver.observe(element);
          element.setAttribute('data-reveal-ready', '');
        }
      });
      on(root, 'focusin', event => {
        const element = event.target.closest?.('[data-rc-reveal]');
        if (element && owned(element)) {
          element.style.setProperty('--rc-reveal-delay', '0ms');
          reveal(element);
          element.removeAttribute('data-reveal-ready');
        }
      });

      for (const carousel of query('[data-rc-carousel]')) {
        const local = selector => [...carousel.querySelectorAll(selector)]
          .filter(element => owned(element) && element.closest('[data-rc-carousel]') === carousel);
        const slides = local('[data-rc-slide]');
        if (!slides.length) continue;
        const previous = local('[data-rc-prev]')[0];
        const next = local('[data-rc-next]')[0];
        const toggle = local('[data-rc-toggle]')[0];
        const status = local('[data-rc-status]')[0];
        const label = toggle?.querySelector('[data-rc-toggle-label]') || toggle;
        const originalText = label?.textContent;
        const originalStatus = status?.textContent;
        const initiallyDisabled = new Map([previous, next, toggle].filter(Boolean)
          .map(button => [button, button.disabled]));
        const configured = Number(carousel.dataset.rcInterval);
        const interval = Number.isFinite(configured) && configured >= 3000 ? configured : 5000;
        let index = Math.min(activeSlides.get(carousel) || 0, slides.length - 1);
        let requested = false;
        let hovered = false;
        let onscreen = !('IntersectionObserver' in win);
        let timer = 0;
        for (const slide of slides) {
          preserveAttribute(slide, 'hidden');
          preserveAttribute(slide, 'aria-current');
        }
        for (const button of [previous, next, toggle].filter(Boolean)) preserveAttribute(button, 'disabled');
        if (toggle) preserveAttribute(toggle, 'aria-pressed');
        if (status) {
          preserveAttribute(status, 'aria-live');
          preserveAttribute(status, 'aria-atomic');
          status.setAttribute('aria-atomic', 'true');
        }
        cleanups.push(() => {
          if (label) label.textContent = originalText;
          if (status) status.textContent = originalStatus;
        });
        const canPlay = () => motion() && expressive() && slides.length > 1;
        const visible = () => {
          if (!onscreen || !carousel.isConnected || !carousel.getClientRects().length ||
              win.getComputedStyle(carousel).visibility === 'hidden') return false;
          if ('IntersectionObserver' in win) return true;
          const rect = carousel.getBoundingClientRect();
          return rect.bottom > 0 && rect.right > 0 && rect.top < win.innerHeight && rect.left < win.innerWidth;
        };
        const running = () => requested && canPlay() && !hovered && !doc.hidden && visible();
        const renderControls = () => {
          if (previous) previous.disabled = initiallyDisabled.get(previous) || slides.length < 2;
          if (next) next.disabled = initiallyDisabled.get(next) || slides.length < 2;
          if (toggle) {
            toggle.disabled = initiallyDisabled.get(toggle) || !canPlay();
            toggle.removeAttribute('aria-pressed');
            label.textContent = requested ? (toggle.dataset.rcPauseLabel || '停止自动切换') :
              (toggle.dataset.rcPlayLabel || '播放自动切换');
          }
          if (status) {
            status.setAttribute('aria-live', running() ? 'off' : 'polite');
            const reason = requested && !running() ? ' · 已临时暂停' : '';
            status.textContent = `${index + 1} / ${slides.length}${reason}`;
          }
        };
        const render = () => {
          slides.forEach((slide, candidate) => {
            slide.hidden = candidate !== index;
            if (candidate === index) slide.setAttribute('aria-current', 'true');
            else slide.removeAttribute('aria-current');
          });
          activeSlides.set(carousel, index);
          renderControls();
        };
        const schedule = () => {
          cancelTimer(timer);
          timer = 0;
          renderControls();
          if (running()) timer = later(() => {
            if (!running()) { schedule(); return; }
            index = (index + 1) % slides.length;
            render();
            schedule();
          }, interval);
        };
        const move = delta => {
          requested = false;
          index = (index + delta + slides.length) % slides.length;
          render();
          schedule();
        };
        if (previous) on(previous, 'click', () => move(-1));
        if (next) on(next, 'click', () => move(1));
        if (toggle) on(toggle, 'click', () => {
          if (!canPlay()) return;
          requested = !requested;
          schedule();
        });
        on(carousel, 'pointerenter', event => {
          if (event.pointerType === 'touch') return;
          hovered = true;
          schedule();
        });
        on(carousel, 'pointerleave', () => { hovered = false; schedule(); });
        on(carousel, 'focusin', () => { requested = false; schedule(); });
        if ('IntersectionObserver' in win) {
          const observer = new win.IntersectionObserver(entries => {
            if (dead || generation !== mountedGeneration) return;
            onscreen = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.01);
            schedule();
          }, { threshold: 0.01 });
          observer.observe(carousel);
          cleanups.push(() => observer.disconnect());
        } else {
          on(win, 'scroll', schedule, { capture: true, passive: true });
          on(win, 'resize', schedule, { passive: true });
        }
        preferenceHooks.push(() => {
          if (!canPlay()) requested = false;
          schedule();
        });
        render();
      }

      const measurements = [];
      for (const group of query('[data-rc-selection]')) {
        const selection = group.querySelector(':scope > .rc-selection');
        const buttons = [...group.querySelectorAll(':scope > [data-rc-option]')];
        if (!selection || !buttons.length) continue;
        preserveStyles(selection, ['left', 'top', 'bottom', 'width', 'height', 'transform']);
        const position = () => {
          if (dead || generation !== mountedGeneration || !group.isConnected) return;
          const selected = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
          if (!selected) return;
          selection.style.left = '0px';
          selection.style.top = '0px';
          selection.style.bottom = 'auto';
          selection.style.width = `${selected.offsetWidth}px`;
          selection.style.height = `${selected.offsetHeight}px`;
          selection.style.transform = `translate(${selected.offsetLeft}px, ${selected.offsetTop}px)`;
        };
        measurements.push(position);
        for (const button of buttons) on(button, 'click', () => {
          if (button.disabled || button.getAttribute('aria-disabled') === 'true') return;
          buttons.forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate === button)));
          position();
          group.dispatchEvent(new win.CustomEvent('rc:select', {
            bubbles: true, detail: { value: button.dataset.rcOption, button, group }
          }));
        });
        if ('ResizeObserver' in win) {
          const observer = new win.ResizeObserver(position);
          observer.observe(group);
          buttons.forEach(button => observer.observe(button));
          cleanups.push(() => observer.disconnect());
        }
        on(group, 'scroll', position, { passive: true });
        position();
      }
      const measure = () => measurements.forEach(position => position());
      on(win, 'resize', measure, { passive: true });
      doc.fonts?.ready.then(() => { if (!dead && generation === mountedGeneration) measure(); });
      frame(measure);

      for (const button of query('[data-rc-theme-toggle]')) {
        preserveAttribute(button, 'aria-pressed');
        preserveAttribute(button, 'aria-label');
        on(button, 'click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));
      }
      syncPreferences = () => {
        if (doc.hidden) root.setAttribute('data-rc-suspended', 'true');
        else root.removeAttribute('data-rc-suspended');
        if (!activeMotion() || !expressive() || !fine.matches) resetPointers();
        if (!activeMotion()) reveals.forEach(element => {
          reveal(element);
          element.removeAttribute('data-reveal-ready');
        });
        preferenceHooks.forEach(update => update());
        syncTheme();
      };
      on(doc, 'visibilitychange', syncPreferences);
      on(reduced, 'change', syncPreferences);
      on(fine, 'change', syncPreferences);
      const attributes = new win.MutationObserver(syncPreferences);
      attributes.observe(root, { attributes: true, attributeFilter:
        ['data-theme', 'data-motion', 'data-performance', 'data-effect-profile'] });
      cleanups.push(() => attributes.disconnect());
      syncPreferences();
    }

    const api = {
      refresh() {
        if (dead) return;
        disposeBindings();
        try { mount(); } catch (error) { api.destroy(); throw error; }
      },
      destroy() {
        if (dead) return;
        dead = true;
        generation++;
        disposeBindings();
        if (instances.get(root) === api) instances.delete(root);
      },
      setTheme
    };
    instances.set(root, api);
    try { mount(); } catch (error) { api.destroy(); throw error; }
    return api;
  }

  window.RCEffects = Object.freeze({ init });
})();
