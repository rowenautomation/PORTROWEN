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

const prompts = [
  "SAP BTP destinations and identity",
  "SAP CTMS and CI/CD flows",
  "SAP Build Work Zone",
  "Obsidian ecommerce UI",
  "AI-generated video experiments",
];

let promptIndex = 0;

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
