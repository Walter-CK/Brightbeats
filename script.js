const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    });
  });
}

const currentPage = document.body.dataset.page;
document.querySelectorAll(".site-nav a").forEach((link) => {
  const href = link.getAttribute("href") || "";
  const isHome = currentPage === "home" && href === "index.html";
  const isMatch = currentPage && href.includes(`${currentPage}.html`);
  if (isHome || isMatch) {
    link.classList.add("is-active");
  }
});

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    document.querySelectorAll("[data-category]").forEach((tile) => {
      const shouldShow = filter === "all" || tile.dataset.category === filter;
      tile.style.display = shouldShow ? "" : "none";
    });
  });
});

const lightbox = document.querySelector(".lightbox");
if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      lightboxImage.src = trigger.dataset.lightbox;
      lightboxImage.alt = trigger.dataset.caption || "Bright Beats image";
      lightboxCaption.textContent = trigger.dataset.caption || "";
      lightbox.hidden = false;
    });
  });

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute("src");
  };

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  });
}

const quoteForm = document.querySelector(".quote-form");
if (quoteForm) {
  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(quoteForm);
    const services = data.getAll("services");
    const parts = [
      "Hi Bright Beats, I would like a quote.",
      data.get("name") ? `Name: ${data.get("name")}` : "",
      data.get("phone") ? `Phone: ${data.get("phone")}` : "",
      data.get("eventType") ? `Event: ${data.get("eventType")}` : "",
      data.get("eventDate") ? `Date: ${data.get("eventDate")}` : "",
      data.get("location") ? `Location: ${data.get("location")}` : "",
      data.get("guests") ? `Guests: ${data.get("guests")}` : "",
      services.length ? `Services: ${services.join(", ")}` : "",
      data.get("notes") ? `Notes: ${data.get("notes")}` : ""
    ].filter(Boolean);

    const body = encodeURIComponent(parts.join("\n"));
    window.location.href = `sms:0432094916?body=${body}`;
  });
}
