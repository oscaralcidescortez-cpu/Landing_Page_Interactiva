const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const destinationSelect = document.getElementById('destination');
const destinationSummary = document.getElementById('destination-summary');
const form = document.getElementById('travel-form');
const feedback = document.getElementById('form-feedback');
const currentYear = document.getElementById('current-year');
const successModal = document.getElementById('success-modal');
const modalOverlay = document.getElementById('success-modal-overlay');
const modalMessage = document.getElementById('modal-message');
const modalClose = document.getElementById('modal-close');
const modalOk = document.getElementById('modal-ok');
const confettiContainer = document.getElementById('confetti-container');
const serviceCards = document.querySelectorAll('.service-card');
const packageCards = document.querySelectorAll('.package-card');
const serviceDetail = document.getElementById('service-detail');

const destinationRecommendations = {
  panama: {
    title: 'Panamá Silver',
    description: 'Panamá te espera con la ruta del Canal, selvas tropicales y ciudades vibrantes. Ideal para viajes combinados entre naturaleza y cultura urbana.'
  },
  costa_rica: {
    title: 'Costa Rica Eco',
    description: 'Costa Rica ofrece playas, bosques nubosos y turismo sostenible. Perfecto para viajeros que buscan aventura ecológica y fauna exótica.'
  },
  guatemala: {
    title: 'Guatemala Clásico',
    description: 'Guatemala es un destino cultural con mercados típicos y volcanes impresionantes. Recomendado para quienes desean inmersión en tradiciones ancestrales.'
  },
  honduras: {
    title: 'Honduras Naturaleza',
    description: 'Honduras ofrece arrecifes coralinos, bosques tropicales y sitios arqueológicos. Perfecto para quienes desean aventura marina y exploración ecológica.'
  },
  mexico: {
    title: 'México Cultural',
    description: 'México combina playas, historias prehispánicas y ciudades vibrantes. Ideal para quienes buscan gastronomía, patrimonio y experiencias auténticas.'
  },
  el_salvador: {
    title: 'El Salvador Vibrante',
    description: 'El Salvador combina playas de surf, volcanes activos y poblados coloniales. Ideal para viajeros que buscan cultura local, gastronomía y aventura en Centroamérica.'
  }
};

const serviceDescriptions = {
  paquetes: {
    title: 'Paquetes a la medida',
    description: 'Creamos itinerarios a tu medida, adaptados al ritmo de tu grupo, tus intereses y tus fechas disponibles para una experiencia sin preocupaciones.'
  },
  soporte: {
    title: 'Soporte local 24/7',
    description: 'Nuestro equipo de guías y coordinadores está disponible en español en cada destino para resolver dudas y ayudarte durante toda tu aventura.'
  },
  eco: {
    title: 'Viajes sostenibles',
    description: 'Seleccionamos alojamientos responsables y actividades con impacto positivo para las comunidades locales y el medio ambiente.'
  }
};

function toggleMenu() {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen);
}

function updateYear() {
  currentYear.textContent = new Date().getFullYear();
}

function updateDestinationSummary() {
  const value = destinationSelect.value;
  if (!value) {
    destinationSummary.textContent = 'Selecciona un destino para recibir una recomendación rápida.';
    return;
  }

  const recommendation = destinationRecommendations[value];
  destinationSummary.innerHTML = `
    <h3>Recomendación rápida para ${destinationSelect.options[destinationSelect.selectedIndex].text}</h3>
    <p>${recommendation.description}</p>
  `;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showError(input, message) {
  const error = input.parentElement.querySelector('.error-message');
  error.textContent = message;
  input.classList.add('invalid');
}

function clearError(input) {
  const error = input.parentElement.querySelector('.error-message');
  error.textContent = '';
  input.classList.remove('invalid');
}

function clearMessages() {
  feedback.textContent = '';
  feedback.className = 'form-feedback';
  form.querySelectorAll('.error-message').forEach((node) => {
    node.textContent = '';
  });
}

function handleFormSubmit(event) {
  event.preventDefault();
  clearMessages();

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const dateInput = document.getElementById('travel-date');
  const messageInput = document.getElementById('message');

  let isValid = true;

  if (nameInput.value.trim().length < 2) {
    showError(nameInput, 'Ingresa un nombre válido de al menos 2 caracteres.');
    isValid = false;
  } else {
    clearError(nameInput);
  }

  if (!validateEmail(emailInput.value.trim())) {
    showError(emailInput, 'Ingresa un correo electrónico válido.');
    isValid = false;
  } else {
    clearError(emailInput);
  }

  if (!destinationSelect.value) {
    showError(destinationSelect, 'Selecciona un destino.');
    isValid = false;
  } else {
    clearError(destinationSelect);
  }

  const travelDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!dateInput.value || travelDate < today) {
    showError(dateInput, 'Escoge una fecha futura para tu viaje.');
    isValid = false;
  } else {
    clearError(dateInput);
  }

  if (messageInput.value.trim().length < 20) {
    showError(messageInput, 'Escribe al menos 20 caracteres para describir tus necesidades.');
    isValid = false;
  } else {
    clearError(messageInput);
  }

  if (!isValid) {
    feedback.textContent = 'Por favor corrige los campos marcados antes de enviar.';
    feedback.classList.add('error');
    return;
  }

  const userName = nameInput.value.trim();
  const selectedDestination = destinationSelect.options[destinationSelect.selectedIndex].text;
  const formattedDate = travelDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  feedback.textContent = `¡Gracias, ${userName}! Hemos recibido tu solicitud y te contactaremos pronto con la propuesta.`;
  feedback.classList.add('success');

  showSuccessAlert(userName, selectedDestination, formattedDate);
  form.reset();
  updateDestinationSummary();
}

function showSuccessAlert(name, destination, date) {
  modalMessage.textContent = `¡Hola ${name}! Tu viaje a ${destination} está reservado para el ${date}. Gracias por elegirnos.`;
  successModal.hidden = false;
  modalOverlay.hidden = false;
  createConfetti();
}

function hideSuccessAlert() {
  successModal.hidden = true;
  modalOverlay.hidden = true;
  confettiContainer.innerHTML = '';
}

function createConfetti() {
  confettiContainer.innerHTML = '';
  const colors = ['#ff7657', '#1dd6c4', '#ffd95f', '#3a5bff', '#de4bff'];
  const pieces = 40;

  for (let i = 0; i < pieces; i += 1) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti-piece';
    const size = Math.floor(Math.random() * 10) + 6;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 0.6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.top = `${Math.random() * 10}%`;
    confetti.style.opacity = String(Math.random() * 0.6 + 0.5);
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animationDuration = `${Math.random() * 1.5 + 1.5}s`;
    confetti.style.animationDelay = `${Math.random() * 0.5}s`;
    confettiContainer.appendChild(confetti);
  }

  setTimeout(() => {
    confettiContainer.innerHTML = '';
  }, 2500);
}

function updateServiceDetail({ currentTarget }) {
  const service = currentTarget.dataset.service;
  const data = serviceDescriptions[service];
  if (data) {
    serviceDetail.innerHTML = `<h3>${data.title}</h3><p>${data.description}</p>`;
  }
}

navToggle.addEventListener('click', toggleMenu);
destinationSelect.addEventListener('change', updateDestinationSummary);
form.addEventListener('submit', handleFormSubmit);
serviceCards.forEach((card) => card.addEventListener('click', updateServiceDetail));
packageCards.forEach((card) => {
  card.addEventListener('click', () => {
    const destination = card.dataset.destination;
    if (destination) {
      destinationSelect.value = destination;
      updateDestinationSummary();
      destinationSelect.focus();
    }
  });
});

modalClose.addEventListener('click', hideSuccessAlert);
modalOk.addEventListener('click', hideSuccessAlert);
modalOverlay.addEventListener('click', hideSuccessAlert);

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    document.querySelector('.navbar').classList.add('scrolled');
  } else {
    document.querySelector('.navbar').classList.remove('scrolled');
  }
});

updateYear();
updateDestinationSummary();
