// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Simple project carousel
const carousel = document.querySelector('.carousel');
const prevBtn = document.querySelector('.carousel-prev');
const nextBtn = document.querySelector('.carousel-next');
const slides = document.querySelectorAll('.carousel-slide');
let currentCarouselIndex = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${(i - index) * 100}%)`;
  });
}

prevBtn.addEventListener('click', () => {
  currentCarouselIndex = (currentCarouselIndex === 0) ? slides.length - 1 : currentCarouselIndex - 1;
  showSlide(currentCarouselIndex);
});

nextBtn.addEventListener('click', () => {
  currentCarouselIndex = (currentCarouselIndex === slides.length - 1) ? 0 : currentCarouselIndex + 1;
  showSlide(currentCarouselIndex);
});

// Initialize carousel
showSlide(currentCarouselIndex);

// Sticky Navigation Bar
const header = document.querySelector('header');
const sticky = header.offsetTop;

function handleStickyNav() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}

window.addEventListener('scroll', handleStickyNav);

// Back-to-top button
const backToTopBtn = document.createElement('button');
backToTopBtn.textContent = '⬆️';
backToTopBtn.className = 'back-to-top';
document.body.appendChild(backToTopBtn);

function toggleBackToTopButton() {
  if (window.scrollY > 300) {
    backToTopBtn.style.display = 'block';
  } else {
    backToTopBtn.style.display = 'none';
  }
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', toggleBackToTopButton);

// Highlight active section in the navigation bar
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

function highlightNavLink() {
  let index = sections.length;

  while (--index && window.scrollY + 50 < sections[index].offsetTop) {}
  
  navLinks.forEach((link) => link.classList.remove('active'));
  navLinks[index].classList.add('active');
}

window.addEventListener('scroll', highlightNavLink);

// Initialize particles
particlesJS.load('particles-js', 'particles.json', function() {
  console.log('Particles loaded');
});

// Scroll Reveal Animations
ScrollReveal().reveal('.projectCard', {
  delay: 300,
  distance: '50px',
  origin: 'bottom',
  interval: 100,
  easing: 'cubic-bezier(0.5, 0, 0, 1)',
});

ScrollReveal().reveal('.skillsLogo', {
  delay: 50,
  distance: '20px',
  origin: 'bottom',
  interval: 50,
  scale: 0.85,
});

// Hover effect for project cards
document.querySelectorAll('.projectCard').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateY(0deg) rotateX(0deg)';
  });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    let ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});

// Dynamic Gradient Background for Project Cards
document.querySelectorAll('.projectCard').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const x = e.offsetX / card.offsetWidth;
    const y = e.offsetY / card.offsetHeight;
    card.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, #6E44FF, #00C2FF, #1A1A1A)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.background = '#1A1A1A';
  });
});

// Dynamic Gradient Text for Headings
document.querySelectorAll('.gradient-text').forEach(text => {
  text.addEventListener('mousemove', (e) => {
    const x = e.offsetX / text.offsetWidth;
    const y = e.offsetY / text.offsetHeight;
    text.style.background = `linear-gradient(${x * 360}deg, #6E44FF, #00C2FF, #FF6B6B)`;
  });
});

// Mouse interaction for tech-sphere
const sphere = document.querySelector('.tech-sphere');
let rotateX = 0;
let rotateY = 0;

document.addEventListener('mousemove', (e) => {
  const sensitivity = 0.2;
  rotateX = (e.clientY - window.innerHeight / 2) * sensitivity;
  rotateY = (e.clientX - window.innerWidth / 2) * sensitivity;
  sphere.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

// Hover pause for tech-sphere
sphere.addEventListener('mouseenter', () => {
  sphere.style.animationPlayState = 'paused';
});

sphere.addEventListener('mouseleave', () => {
  sphere.style.animationPlayState = 'running';
});
