// slider.js
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('joinForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const discordName = form.discordName.value.trim();
    const position    = form.position.value;
    const message     = form.message.value.trim();

    try {
      const res = await fetch('https://zeus-backend-production.up.railway.app/api/inscripcion', {  // ← aquí
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discordName, position, message }),
      });
      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        form.reset();
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error enviando la solicitud.');
    }
  });
});
