const dot = document.querySelector(".cursor-dot");
const magneticItems = document.querySelectorAll(".magnetic");
const tiltCards = document.querySelectorAll(".tilt-card");
const revealItems = document.querySelectorAll(".section-reveal");
const promptCard = document.querySelector("#prompt-card");
const promptText = document.querySelector("#prompt-text");
const githubDots = document.querySelector(".github-dots");
const emailModal = document.querySelector("[data-email-modal]");
const emailOpenButtons = document.querySelectorAll("[data-email-open]");
const emailCloseButton = document.querySelector("[data-email-close]");
const emailCopyButton = document.querySelector("[data-email-copy]");
const emailAddress = document.querySelector("#email-address");
const projectShowcase = document.querySelector("[data-project-showcase]");
const projectMain = document.querySelector("[data-project-main]");
const projectLeft = document.querySelector("[data-project-left]");
const projectRight = document.querySelector("[data-project-right]");
const projectPrevButton = document.querySelector("[data-project-prev]");
const projectNextButton = document.querySelector("[data-project-next]");

const prompts = [
  "SAP BTP integration and platform administration",
  "SAP CTMS and CI/CD flows",
  "SAP Build Work Zone",
  "Obsidian ecommerce UI",
  "AI-generated video experiments",
];

let promptIndex = 0;
let projectIndex = 0;
let projectDragStart = 0;
let projectDragCurrent = 0;

const projects = [
  {
    eyebrow: "ecommerce app",
    title: "Obsidian — Skincare Ecommerce",
    label: "OBSIDIAN",
    copy: "Beauty, curated with intention",
    description:
      "A luxury skincare ecommerce website with refined product sections, brand storytelling, reviews, cart/search navigation, and a trust-focused about page.",
    badges: ["#1 ecommerce app", "under development"],
    tags: ["Next.js", "Supabase", "Ecommerce", "UI Design"],
  },
  {
    eyebrow: "personal site",
    title: "Portfolio Website",
    label: "ROWEN",
    copy: "SAP, AI, web work",
    description:
      "A black-and-white portfolio for SAP BTP work, certifications, web projects, downloadable CVs, and AI creative experiments.",
    badges: ["portfolio", "github pages"],
    tags: ["Portfolio", "Web Development", "GitHub", "CV"],
  },
  {
    eyebrow: "creative ai",
    title: "AI Video Creation",
    label: "AI VIDEO",
    copy: "Short-form visuals",
    description:
      "Short-form video experiments created with AI tools, combining concepts, visuals, motion, and editing into compact creative studies.",
    badges: ["creative ai", "video lab"],
    tags: ["AI Tools", "Video", "Creative Tech", "Editing"],
  },
];

document.addEventListener("pointermove", (event) => {
  if (!dot) return;
  dot.style.left = `${event.clientX}px`;
  dot.style.top = `${event.clientY}px`;
});

document.addEventListener("pointerenter", () => dot?.classList.add("is-active"));
document.addEventListener("pointerleave", () => dot?.classList.remove("is-active"));

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.16}px, ${y * 0.22}px)`;
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "translate(0, 0)";
  });
});

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "perspective(900px) rotateX(0) rotateY(0) translateY(0)";
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

document.querySelectorAll(".skill-cloud span").forEach((chip, index) => {
  chip.style.setProperty("--delay", `${index * 42}ms`);
});

promptCard?.addEventListener("click", () => {
  promptIndex = (promptIndex + 1) % prompts.length;
  promptText.textContent = prompts[promptIndex];
  promptCard.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(0.985)" },
      { transform: "scale(1)" },
    ],
    { duration: 220, easing: "ease-out" }
  );
});

function projectAt(offset) {
  return projects[(projectIndex + offset + projects.length) % projects.length];
}

function renderProjectCard(element, project) {
  if (!element) return;
  const eyebrow = element.querySelector("span");
  const title = element.querySelector("strong");
  const meta = element.querySelector("small");
  if (eyebrow) eyebrow.textContent = project.eyebrow;
  if (title) title.textContent = project.title;
  if (meta) meta.textContent = project.copy;
}

function renderProjectShowcase(direction = 0) {
  if (!projectMain) return;
  const project = projectAt(0);
  const badges = projectMain.querySelector(".showcase-badges");
  const screenTitle = projectMain.querySelector(".screen-title");
  const screenCopy = projectMain.querySelector(".screen-copy");
  const heading = projectMain.querySelector("h3");
  const paragraph = projectMain.querySelector("p");
  const tags = projectMain.querySelector(".tags");

  if (badges) {
    badges.innerHTML = project.badges.map((badge) => `<span>${badge}</span>`).join("");
  }
  if (screenTitle) screenTitle.textContent = project.label;
  if (screenCopy) screenCopy.textContent = project.copy;
  if (heading) heading.textContent = project.title;
  if (paragraph) paragraph.textContent = project.description;
  if (tags) {
    tags.innerHTML = project.tags.map((tag) => `<span>${tag}</span>`).join("");
  }

  renderProjectCard(projectLeft, projectAt(-1));
  renderProjectCard(projectRight, projectAt(1));

  projectShowcase?.classList.remove("is-next", "is-prev");
  if (direction !== 0) {
    projectShowcase?.classList.add(direction > 0 ? "is-next" : "is-prev");
    window.setTimeout(() => projectShowcase?.classList.remove("is-next", "is-prev"), 280);
  }
}

function moveProject(direction) {
  projectIndex = (projectIndex + direction + projects.length) % projects.length;
  renderProjectShowcase(direction);
}

projectPrevButton?.addEventListener("click", () => moveProject(-1));
projectNextButton?.addEventListener("click", () => moveProject(1));
projectLeft?.addEventListener("click", () => moveProject(-1));
projectRight?.addEventListener("click", () => moveProject(1));

projectShowcase?.addEventListener("pointerdown", (event) => {
  projectDragStart = event.clientX;
  projectDragCurrent = event.clientX;
  projectShowcase.setPointerCapture?.(event.pointerId);
});

projectShowcase?.addEventListener("pointermove", (event) => {
  if (projectDragStart === 0) return;
  projectDragCurrent = event.clientX;
});

projectShowcase?.addEventListener("pointerup", () => {
  const distance = projectDragCurrent - projectDragStart;
  projectDragStart = 0;
  projectDragCurrent = 0;
  if (Math.abs(distance) < 48) return;
  moveProject(distance < 0 ? 1 : -1);
});

projectShowcase?.addEventListener("pointercancel", () => {
  projectDragStart = 0;
  projectDragCurrent = 0;
});

renderProjectShowcase();

if (githubDots) {
  for (let index = 0; index < 168; index += 1) {
    githubDots.appendChild(document.createElement("i"));
  }
}

function openEmailModal() {
  emailModal?.classList.add("is-open");
  emailModal?.setAttribute("aria-hidden", "false");
}

function closeEmailModal() {
  emailModal?.classList.remove("is-open");
  emailModal?.setAttribute("aria-hidden", "true");
}

emailOpenButtons.forEach((button) => {
  button.addEventListener("click", openEmailModal);
});

emailCloseButton?.addEventListener("click", closeEmailModal);

emailModal?.addEventListener("click", (event) => {
  if (event.target === emailModal) {
    closeEmailModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeEmailModal();
  }
});

emailCopyButton?.addEventListener("click", async () => {
  const value = emailAddress?.textContent || "rowen.infante@gmail.com";
  try {
    await navigator.clipboard.writeText(value);
    emailCopyButton.textContent = "Copied";
    setTimeout(() => {
      emailCopyButton.textContent = "Copy";
    }, 1400);
  } catch {
    window.location.href = `mailto:${value}`;
  }
});
