const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const siteHeader = document.querySelector(".site-header");

if (siteHeader) {
  const updateHeader = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Ouvrir le menu" : "Fermer le menu");
    navMenu.classList.toggle("is-open", !isExpanded);
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      navMenu.classList.remove("is-open");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
      navMenu.classList.remove("is-open");
      menuToggle.focus();
    }
  });
}

const arrivalInput = document.querySelector("#arrival");
const departureInput = document.querySelector("#departure");

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

if (arrivalInput && departureInput) {
  const today = localDateString(new Date());
  arrivalInput.min = today;
  departureInput.min = today;

  arrivalInput.addEventListener("change", () => {
    departureInput.min = arrivalInput.value || today;
    if (departureInput.value && departureInput.value < departureInput.min) {
      departureInput.value = "";
    }
  });
}

const bookingForm = document.querySelector("#booking-form");
const formError = document.querySelector("#form-error");

if (bookingForm && formError) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formError.hidden = true;

    if (!bookingForm.reportValidity()) return;

    const formData = new FormData(bookingForm);
    const arrival = String(formData.get("arrival"));
    const departure = String(formData.get("departure"));

    if (departure <= arrival) {
      formError.textContent = "La date de départ doit être postérieure à la date d’arrivée.";
      formError.hidden = false;
      departureInput.focus();
      return;
    }

    const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC"
    });
    const formatDate = (date) => dateFormatter.format(new Date(`${date}T00:00:00Z`));
    const message = [
      "Bonjour, je souhaite demander une disponibilité à l’Iberostar Selection Kuriat Palace.",
      "",
      `Nom : ${formData.get("name")}`,
      `Contact : ${formData.get("contact")}`,
      `Arrivée : ${formatDate(arrival)}`,
      `Départ : ${formatDate(departure)}`,
      `Nombre de personnes : ${formData.get("guests")}`
    ].join("\n");

    window.open(`https://wa.me/21673520100?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
}