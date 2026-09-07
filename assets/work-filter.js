const selectedWorks = [
  {
    num: "001",
    name: "ZAPPO",
    role: "Software Engineer · React.js · REST APIs · 2026",
    logoRole: "Software Engineer",
    detailRole: "Software Engineer",
    year: "2026",
    stack: "React.js · REST APIs",
    url: "https://zappoapp.com/",
    description:
      "Developing a responsive sports booking platform with React.js — building venue discovery, slot booking, real-time availability and seamless booking experiences through integrated REST APIs.",
  },
  {
    num: "002",
    name: "CODE & THRIVE",
    role: "Developer & Designer · React · UI/UX · SEO · 2025",
    logoRole: "Developer & Designer",
    detailRole: "Developer & Designer",
    year: "2025",
    stack: "React · UI/UX · SEO",
    url: "https://codeandthrive.studio/",
    description:
      "Building digital experiences for 300+ global clients — combining web development, UI/UX design, branding, SEO and digital marketing across diverse industries.",
  },
  {
    num: "003",
    name: "TARSX ROBOT",
    role: "Personal Project · Raspberry Pi · Python · AI · 2024",
    logoRole: "AI Robotics",
    detailRole: "Personal Project",
    year: "2024",
    stack: "Raspberry Pi · Python · AI · ChatGPT API",
    url: "https://tarsx.space/",
    description:
      "Building a real-life replica of the TARS robot from Interstellar — combining Raspberry Pi, custom hardware, embedded systems and the ChatGPT API to create a conversational robotics experience.",
  },
  {
    num: "004",
    name: "STARTUP GROW",
    role: "Full Stack · 2026",
    logoRole: "Full Stack",
    detailRole: "Full Stack",
    year: "2026",
    stack: "Full Stack",
    url: "#",
    description: "Full stack development for Startup Grow.",
  },
];

let activeProject = selectedWorks[0];

function findProject(name) {
  return selectedWorks.find((item) => item.name === name) || selectedWorks[0];
}

function updateSelectedWorks() {
  const works = document.querySelector("[data-works]");

  if (!works || works.children.length < selectedWorks.length) {
    return false;
  }

  Array.from(works.children).forEach((row, index) => {
    if (index >= selectedWorks.length) {
      row.remove();
      return;
    }

    const item = selectedWorks[index];
    const number = row.querySelector(".work__num");
    const name = row.querySelector(".work__name");
    const role = row.querySelector(".work__role");

    row.setAttribute("href", "#");
    row.removeAttribute("target");
    row.removeAttribute("rel");
    row.setAttribute("data-wordmark-name", item.name);
    row.setAttribute("data-cursor-label", item.name);
    row.dataset.projectName = item.name;

    if (number && number.textContent !== item.num) number.textContent = item.num;
    if (name && name.textContent !== item.name) name.textContent = item.name;
    if (role && role.textContent !== item.role) role.textContent = item.role;
  });

  return true;
}

function updateProjectLogos() {
  const logos = document.querySelector("[data-logos]");

  if (!logos) {
    return false;
  }

  const currentNames = Array.from(logos.querySelectorAll(".logos__name"))
    .map((item) => item.textContent?.trim())
    .join("|");
  const nextNames = selectedWorks.map((item) => item.name).join("|");

  if (currentNames !== nextNames || logos.children.length !== selectedWorks.length) {
    logos.dataset.projectLogos = "true";
    logos.innerHTML = selectedWorks
      .map((item) => {
        const roleParts = item.logoRole.split(/\s+/);
        const lastRolePart = roleParts.pop();
        const firstRoleParts = roleParts.join(" ");

        return `
          <div class="logos__item" data-cursor-snap>
            <span class="ink" aria-hidden="true"><span class="ink__blob"></span></span>
            <span class="logos__name">${item.name}</span>
            <div class="logos__hover">
              <span class="logos__role">
                <span>${firstRoleParts}</span>
                <span>${lastRolePart}</span>
              </span>
              <span class="logos__period">${item.year}</span>
            </div>
          </div>
        `;
      })
      .join("");
  }

  Array.from(logos.querySelectorAll(".logos__item")).forEach((item) => {
    if (item.dataset.projectInkReady) {
      return;
    }

    item.dataset.projectInkReady = "true";
    item.addEventListener("pointerenter", updateInkPosition);
    item.addEventListener("pointermove", updateInkPosition);
  });

  return true;
}

function updateInkPosition(event) {
  const item = event.currentTarget;
  const rect = item.getBoundingClientRect();

  item.style.setProperty("--ink-x", `${event.clientX - rect.left}px`);
  item.style.setProperty("--ink-y", `${event.clientY - rect.top}px`);
}

function sizeCinemaTrack(track, name) {
  const height = track.parentElement?.clientHeight || window.innerHeight;
  const size = Math.max(28, Math.min(88, (height * 0.92) / Math.max(name.length, 6)));

  track.style.fontSize = `${size}px`;
}

function updateCinemaPreview(project = activeProject) {
  const cinema = document.querySelector("[data-cinema]");

  if (!cinema || !cinema.classList.contains("is-active") || !project) {
    return;
  }

  document.querySelectorAll("[data-cinema-track]").forEach((track) => {
    sizeCinemaTrack(track, project.name);

    if (track.textContent?.trim() !== project.name) {
      track.innerHTML = `<span>${project.name}</span>`;
    }
  });

  const metaLeft = document.querySelector("[data-cinema-meta-left]");
  const metaRight = document.querySelector("[data-cinema-meta-right]");

  if (metaLeft && metaLeft.textContent !== project.role) metaLeft.textContent = project.role;
  if (metaRight && !cinema.classList.contains("is-modal")) {
    const prompt = "Click to open ↗";
    if (metaRight.textContent !== prompt) metaRight.textContent = prompt;
  }
}

function updateCinemaDetail(project = activeProject) {
  const cinema = document.querySelector("[data-cinema]");

  if (!cinema || !cinema.classList.contains("is-modal") || !project) {
    return;
  }

  const setText = (selector, value) => {
    const element = document.querySelector(selector);

    if (element && element.textContent !== value) {
      element.textContent = value;
    }
  };

  setText("[data-detail-num]", project.num);
  setText("[data-detail-name]", project.name);
  setText("[data-detail-tagline]", project.description);
  setText("[data-detail-role]", project.detailRole);
  setText("[data-detail-year]", project.year);
  setText("[data-detail-stack]", project.stack);

  const cta = document.querySelector(".cinema__detail-cta");

  if (cta) {
    const hasLiveUrl = project.url && project.url !== "#";

    cta.href = hasLiveUrl ? project.url : "#";
    const ctaText = hasLiveUrl ? "Visit live ↗" : "Project details ↗";

    if (cta.textContent !== ctaText) {
      cta.textContent = ctaText;
    }

    if (hasLiveUrl) {
      cta.target = "_blank";
      cta.rel = "noopener noreferrer";
    } else {
      cta.removeAttribute("target");
      cta.removeAttribute("rel");
    }
  }

  const metaLeft = document.querySelector("[data-cinema-meta-left]");
  const metaRight = document.querySelector("[data-cinema-meta-right]");

  if (metaLeft && metaLeft.textContent !== project.role) metaLeft.textContent = project.role;
  if (metaRight && metaRight.textContent !== "Click to close ↗") {
    metaRight.textContent = "Click to close ↗";
  }
}

function updateProjectContent() {
  updateSelectedWorks();
  updateProjectLogos();
  updateCinemaPreview();
  updateCinemaDetail();
}

function scheduleUpdate() {
  cancelAnimationFrame(scheduleUpdate.frame);
  scheduleUpdate.frame = requestAnimationFrame(updateProjectContent);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", updateProjectContent, { once: true });
} else {
  updateProjectContent();
}

const observer = new MutationObserver(scheduleUpdate);
observer.observe(document.body, {
  attributes: true,
  attributeFilter: ["class"],
  childList: true,
  subtree: true,
});

document.addEventListener("pointerover", (event) => {
  const row = event.target.closest?.("[data-wordmark-trigger]");

  if (!row) {
    return;
  }

  activeProject = findProject(row.dataset.projectName || row.dataset.wordmarkName);
  requestAnimationFrame(() => updateCinemaPreview(activeProject));
});

document.addEventListener("click", (event) => {
  const row = event.target.closest?.("[data-wordmark-trigger]");

  if (!row) {
    return;
  }

  activeProject = findProject(row.dataset.projectName || row.dataset.wordmarkName);
  requestAnimationFrame(() => {
    updateCinemaPreview(activeProject);
    updateCinemaDetail(activeProject);
    requestAnimationFrame(() => updateCinemaDetail(activeProject));
  });
});

scheduleUpdate();
