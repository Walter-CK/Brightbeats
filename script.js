const lightbox = document.querySelector(".lightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      lightboxImage.src = trigger.dataset.lightbox;
      lightboxImage.alt = trigger.dataset.caption || "Bright Beats event image";
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
      data.get("budget") ? `Budget range: ${data.get("budget")}` : "",
      data.get("contactMethod") ? `Best contact: ${data.get("contactMethod")}` : "",
      data.get("notes") ? `Notes: ${data.get("notes")}` : ""
    ].filter(Boolean);

    const body = encodeURIComponent(parts.join("\n"));
    window.location.href = `sms:0432094916?body=${body}`;
  });
}
