(function () {
  document.querySelectorAll('.profile-hero').forEach(hero => {
    const canvas = hero.querySelector('.profile-neural-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let nodes = [];
    const nodeCount = 46;
    const maxDistance = 150;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }

    function initNodes() {
      nodes = Array.from({ length: nodeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2.4 + 1,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.5;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139,92,246,0.72)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,58,237,0.11)';
        ctx.fill();
      });
    }

    function update() {
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });
    }

    function loop() {
      update();
      draw();
      requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
      resize();
      initNodes();
    });

    resize();
    initNodes();
    loop();
  });

  document.querySelectorAll('[data-phrases]').forEach(holder => {
    const target = holder.querySelector('.page-typewriter');
    if (!target) return;

    const phrases = holder.dataset.phrases
      .split('|')
      .map(item => item.trim())
      .filter(Boolean);
    if (!phrases.length) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
      const phrase = phrases[phraseIndex];
      if (!deleting) {
        charIndex += 1;
        target.textContent = phrase.slice(0, charIndex);
        if (charIndex === phrase.length) {
          setTimeout(() => {
            deleting = true;
            tick();
          }, 1900);
          return;
        }
      } else {
        charIndex -= 1;
        target.textContent = phrase.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
        }
      }
      tick();
    }

    function tick() {
      setTimeout(type, deleting ? 50 : 85);
    }

    tick();
  });

  const revealSelector = '.fi';

  function setupReveal() {
    const seen = new WeakSet();

    function revealImmediately(root) {
      if (root.matches?.(revealSelector)) root.classList.add('vis');
      root.querySelectorAll?.(revealSelector).forEach(el => el.classList.add('vis'));
    }

    if (!('IntersectionObserver' in window)) {
      revealImmediately(document);
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
        } else {
          entry.target.classList.remove('vis');
        }
      });
    }, { threshold: 0.12 });

    function observe(root) {
      const items = [];
      if (root.matches?.(revealSelector)) items.push(root);
      root.querySelectorAll?.(revealSelector).forEach(el => items.push(el));

      items.forEach(el => {
        if (seen.has(el)) return;
        seen.add(el);
        observer.observe(el);
      });
    }

    observe(document);

    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) observe(node);
        });
      });
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }

  setupReveal();
})();
