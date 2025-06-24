document.addEventListener("DOMContentLoaded", () => {
  const fanButton = document.getElementById('fanButton');
  const fanMessage = document.getElementById('fanMessage');
  const fanCount = document.getElementById('fanCount');

  // Verifica si el usuario ya es fan
  async function checkIfFan() {
    try {
      const res = await fetch('http://localhost:3000/api/fan');
      const data = await res.json();

      if (data.alreadyFan) {
        fanMessage.textContent = '¡Ya eres fan!';
        fanButton.disabled = true;
      }
    } catch (err) {
      console.error('Error al verificar si es fan:', err);
    }
  }

  // Actualiza el contador de fans
  async function loadFanCount() {
    try {
      const res = await fetch('http://localhost:3000/api/fans');
      const data = await res.json();
      fanCount.textContent = `${data.total}`;
    } catch {
      fanCount.textContent = '';
    }
  }

  // Evento para registrarse como fan
  fanButton.addEventListener('click', async () => {
    try {
      const response = await fetch('http://localhost:3000/api/fan', {
        method: 'POST'
      });

      const data = await response.json();
      fanMessage.textContent = data.message;

      if (response.ok) {
        fanButton.disabled = true;
        loadFanCount();
      }
    } catch (error) {
      fanMessage.textContent = 'Error al registrarte como fan.';
      console.error(error);
    }
  });

  // Al cargar la página: verificar fan y contador
  checkIfFan();
  loadFanCount();
});
