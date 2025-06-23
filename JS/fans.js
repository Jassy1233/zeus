document.addEventListener("DOMContentLoaded", () => {
  const fanButton = document.getElementById("fanButton");
  const fanMessage = document.getElementById("fanMessage");
  const fanCount = document.getElementById("fanCount");

  // Verificar si ya es fan (GET)
  fetch("/api/fan")
    .then(res => res.json())
    .then(data => {
      if (data.alreadyFan) {
        fanMessage.textContent = "¡Ya eres fan 💙!";
        fanMessage.style.color = "#66fcf1";
        fanButton.disabled = true;
        fanButton.textContent = "✔ Ya eres fan";
      }
    })
    .catch(err => {
      console.error('Error verificando fan:', err);
    });

  // Obtener total de fans al cargar
  fetch("/api/fans")
    .then(res => res.json())
    .then(data => {
      fanCount.textContent = data.total;
    });

  // Click para registrar fan (POST)
  fanButton.addEventListener("click", () => {
    fetch("/api/fan", { method: "POST" })
      .then(res => {
        if (!res.ok) throw new Error('Error al registrar fan');
        return res.json();
      })
      .then(data => {
        fanMessage.textContent = data.message;
        fanMessage.style.color = "#66fcf1";
        fanButton.disabled = true;
        fanButton.textContent = "✔ Gracias por unirte";

        // Actualizar contador fans
        return fetch("/api/fans");
      })
      .then(res => res.json())
      .then(data => {
        fanCount.textContent = data.total;
      })
      .catch(err => {
        fanMessage.textContent = "Ya eres fan o hubo un error";
        fanMessage.style.color = "#f66";
      });
  });
});
