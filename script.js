const loadingScreen = document.querySelector(".loading-screen");
const nav = document.querySelector(".nav");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const revealElements = document.querySelectorAll("[data-reveal]");
const sections = document.querySelectorAll("main .section");
const portraitFrame = document.querySelector(".portrait-frame");
const portraitImage = document.querySelector(".portrait-image");
const canvas = document.getElementById("particles");
const ctx = canvas ? canvas.getContext("2d") : null;

document.body.classList.add("is-locked");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loadingScreen.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
  }, 1800);
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -35% 0px",
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});

if (portraitFrame && portraitImage) {
  portraitImage.addEventListener("load", () => {
    portraitFrame.classList.add("has-image");
  });

  portraitImage.addEventListener("error", () => {
    portraitFrame.classList.remove("has-image");
  });
}

const particleState = {
  particles: [],
  count: window.innerWidth < 768 ? 26 : 46,
};

function setCanvasSize() {
  if (!canvas) {
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.7 + 0.4,
    speedX: (Math.random() - 0.5) * 0.18,
    speedY: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.45 + 0.15,
  };
}

function seedParticles() {
  particleState.particles = Array.from({ length: particleState.count }, createParticle);
}

function drawParticles() {
  if (!ctx || !canvas) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particleState.particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

    ctx.beginPath();
    ctx.fillStyle = `rgba(97, 218, 251, ${particle.alpha})`;
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particleState.particles.length; next += 1) {
      const other = particleState.particles[next];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 110) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(97, 218, 251, ${0.08 - distance / 1800})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  window.requestAnimationFrame(drawParticles);
}

if (canvas && ctx) {
  setCanvasSize();
  seedParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    particleState.count = window.innerWidth < 768 ? 26 : 46;
    setCanvasSize();
    seedParticles();
  });
}
