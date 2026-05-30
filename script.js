(function () {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initCursorGlow() {
    const glow = document.getElementById("cursor-glow");
    if (!glow || !finePointer || reduceMotion) return;

    let targetX = -999;
    let targetY = -999;
    let glowX = targetX;
    let glowY = targetY;

    document.addEventListener("mousemove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      document.body.classList.add("cursor-ready");
    }, { passive: true });

    document.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-ready");
    });

    function animate() {
      glowX += (targetX - glowX) * 0.12;
      glowY += (targetY - glowY) * 0.12;
      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function initTiltCards() {
    if (!finePointer || reduceMotion) return;

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 120ms ease-out";
      });

      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        const rotateY = x * 7;
        const rotateX = -y * 7;
        card.style.transform = `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transition = "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";
        card.style.transform = "";
      });
    });
  }

  function initTouchReveals() {
    if (finePointer || reduceMotion) return;

    document.body.classList.add("touch-motion");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -42px 0px" });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  }

  function initQuoteForm() {
    const form = document.querySelector(".quote-form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(form);
      const services = data.getAll("services");
      const subject = encodeURIComponent("Bright Beats event quote request");
      const bodyParts = [
        "Hi Bright Beats,",
        "",
        "I would like a quote for an event.",
        "",
        data.get("name") ? `Name: ${data.get("name")}` : "",
        data.get("phone") ? `Phone: ${data.get("phone")}` : "",
        data.get("email") ? `Email: ${data.get("email")}` : "",
        data.get("eventType") ? `Event type: ${data.get("eventType")}` : "",
        data.get("eventDate") ? `Event date: ${data.get("eventDate")}` : "",
        data.get("location") ? `Location: ${data.get("location")}` : "",
        data.get("guests") ? `Guest count: ${data.get("guests")}` : "",
        services.length ? `Services needed: ${services.join(", ")}` : "",
        data.get("budget") ? `Budget range: ${data.get("budget")}` : "",
        data.get("notes") ? `Notes: ${data.get("notes")}` : "",
        "",
        "Thank you."
      ].filter((line) => line !== "");

      const body = encodeURIComponent(bodyParts.join("\n"));
      window.location.href = `mailto:thebrightbeats@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  function boot() {
    initCursorGlow();
    initTiltCards();
    initTouchReveals();
    initQuoteForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
