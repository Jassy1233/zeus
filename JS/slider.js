document.addEventListener('DOMContentLoaded', () => {
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

document.querySelectorAll('.player-card').forEach(card => {
  observer.observe(card);
});
});
