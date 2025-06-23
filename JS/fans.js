  document.addEventListener("DOMContentLoaded", () => {
    const fanButton = document.getElementById("fanButton");
    const fanMessage = document.getElementById("fanMessage");
    const fanCount = document.getElementById("fanCount");

    // Obtener total de fans al cargar
    fetch("/api/fans")
      .then(res => res.json())
      .then(data => {
        fanCount.textContent = data.total;
      });

    fanButton.addEventListener("click", () => {
      fetch("/api/fan", {
        method: "POST",
      })
        .then(res => res.json())
        .then(data => {
          fanMessage.textContent = data.message;
          fanMessage.style.color = "#66fcf1";
          fanButton.disabled = true;

          // Recargar contador de fans
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