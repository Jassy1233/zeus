document.addEventListener("DOMContentLoaded", () => {
  const partidos = [
    {
      rival: "Pringaos de Ice",
      fecha: "2025-07-01T18:00:00",
    },
    {
      rival: "Los segundones que han perdio contra ice",
      fecha: "2025-07-08T20:00:00",
    },
    {
      rival: "Los otros que no daban ni un pase",
      fecha: "2025-07-15T19:30:00",
    },
  ];

  let indiceActual = 0;

  function mostrarPartido(index) {
    const partido = partidos[index];
    const card = document.getElementById("partido-card");
    card.innerHTML = `
      <h3>VS ${partido.rival}</h3>
      <p><strong>Fecha:</strong> ${new Date(partido.fecha).toLocaleString()}</p>
    `;
  }

  function cambiarPartido(direccion) {
    indiceActual += direccion;
    if (indiceActual < 0) indiceActual = partidos.length - 1;
    if (indiceActual >= partidos.length) indiceActual = 0;
    mostrarPartido(indiceActual);
    iniciarCuentaAtras();
  }

  function iniciarCuentaAtras() {
    function actualizarCuenta() {
      const cuenta = document.getElementById("countdown");
      const ahora = new Date();
      const proximo = new Date(partidos[indiceActual].fecha);
      const tiempoRestante = proximo - ahora;

      if (tiempoRestante <= 0) {
        cuenta.textContent = "¡El partido ha comenzado!";
        return;
      }

      const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
      const horas = Math.floor((tiempoRestante / (1000 * 60 * 60)) % 24);
      const minutos = Math.floor((tiempoRestante / (1000 * 60)) % 60);
      const segundos = Math.floor((tiempoRestante / 1000) % 60);

      cuenta.textContent = `Faltan ${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }

    actualizarCuenta();
    clearInterval(window.cuentaInterval);  // limpiar intervalo previo
    window.cuentaInterval = setInterval(actualizarCuenta, 1000);
  }

  // Inicializar
  mostrarPartido(indiceActual);
  iniciarCuentaAtras();

  // Eventos botones
  document.getElementById("prevPartido").addEventListener("click", () => {
    cambiarPartido(-1);
  });

  document.getElementById("nextPartido").addEventListener("click", () => {
    cambiarPartido(1);
  });
});
