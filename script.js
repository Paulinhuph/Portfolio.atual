const telaCarregamento = document.querySelector(".tela-carregamento");
const navegacao = document.querySelector(".navegacao");
const alternadorMenu = document.querySelector(".alternador-menu");
const linksNavegacao = Array.from(document.querySelectorAll(".navegacao a"));
const elementosReveal = document.querySelectorAll("[data-reveal]");
const secoes = document.querySelectorAll("main .secao");
const molduraRetrato = document.querySelector(".moldura-retrato");
const imagemRetrato = document.querySelector(".imagem-retrato");
const canvas = document.getElementById("particles");
const contexto = canvas ? canvas.getContext("2d") : null;

document.body.classList.add("is-locked");

window.addEventListener("load", () => {
  window.setTimeout(() => {
    telaCarregamento.classList.add("is-hidden");
    document.body.classList.remove("is-locked");
  }, 1800);
});

if (alternadorMenu) {
  alternadorMenu.addEventListener("click", () => {
    const estaAberto = navegacao.classList.toggle("is-open");
    alternadorMenu.setAttribute("aria-expanded", String(estaAberto));
  });

  linksNavegacao.forEach((link) => {
    link.addEventListener("click", () => {
      navegacao.classList.remove("is-open");
      alternadorMenu.setAttribute("aria-expanded", "false");
    });
  });
}

const observadorReveal = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observadorReveal.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
  }
);

elementosReveal.forEach((elemento) => {
  observadorReveal.observe(elemento);
});

const observadorSecao = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const id = entry.target.getAttribute("id");
      linksNavegacao.forEach((link) => {
        const estaAtivo = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", estaAtivo);
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-10% 0px -35% 0px",
  }
);

secoes.forEach((secao) => {
  observadorSecao.observe(secao);
});

if (molduraRetrato && imagemRetrato) {
  imagemRetrato.addEventListener("load", () => {
    molduraRetrato.classList.add("has-image");
  });

  imagemRetrato.addEventListener("error", () => {
    molduraRetrato.classList.remove("has-image");
  });
}

const estadoParticulas = {
  particles: [],
  count: window.innerWidth < 768 ? 26 : 46,
};

function definirTamanhoCanvas() {
  if (!canvas) {
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function criarParticula() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.7 + 0.4,
    speedX: (Math.random() - 0.5) * 0.18,
    speedY: (Math.random() - 0.5) * 0.18,
    alpha: Math.random() * 0.45 + 0.15,
  };
}

function semearParticulas() {
  estadoParticulas.particles = Array.from({ length: estadoParticulas.count }, criarParticula);
}

function desenharParticulas() {
  if (!contexto || !canvas) {
    return;
  }

  contexto.clearRect(0, 0, canvas.width, canvas.height);

  estadoParticulas.particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
    if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

    contexto.beginPath();
    contexto.fillStyle = `rgba(97, 218, 251, ${particle.alpha})`;
    contexto.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    contexto.fill();

    for (let next = index + 1; next < estadoParticulas.particles.length; next += 1) {
      const other = estadoParticulas.particles[next];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 110) {
        contexto.beginPath();
        contexto.strokeStyle = `rgba(97, 218, 251, ${0.08 - distance / 1800})`;
        contexto.lineWidth = 1;
        contexto.moveTo(particle.x, particle.y);
        contexto.lineTo(other.x, other.y);
        contexto.stroke();
      }
    }
  });

  window.requestAnimationFrame(desenharParticulas);
}

if (canvas && contexto) {
  definirTamanhoCanvas();
  semearParticulas();
  desenharParticulas();

  window.addEventListener("resize", () => {
    estadoParticulas.count = window.innerWidth < 768 ? 26 : 46;
    definirTamanhoCanvas();
    semearParticulas();
  });
}
