document.addEventListener("DOMContentLoaded", () => {
  const fanButton = document.getElementById('fanButton');
  const fanMessage = document.getElementById('fanMessage');
  const fanCount = document.getElementById('fanCount');

  fanButton.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/api/fan', {
        method: 'POST'
      });

      const data = await response.json();
      fanMessage.textContent = data.message;
      if (response.ok) {
        fanButton.disabled = true;
        loadFanCount(); // Actualiza el contador
      }
    } catch (error) {
      fanMessage.textContent = 'Error al registrarte como fan.';
    }
  });

  async function loadFanCount() {
    try {
      const res = await fetch('http://localhost:3000/api/fans');
      const data = await res.json();
      fanCount.textContent = `${data.total}`;
    } catch {
      fanCount.textContent = '';
    }
  }

  // Cargar contador al cargar la página
  loadFanCount();

});