const form = document.getElementById("ecoForm");
const resultSection = document.getElementById("result");
const emissionText = document.getElementById("emissionText");
const recommendations = document.getElementById("recommendations");
const resetBtn = document.getElementById("reset");

let chart;

// Factores de emisión en kg CO₂ por litro de combustible
const emissionFactors = {
  gasolina: 2.31,
  diesel: 2.68,
  electrico: 0.0 // Energía limpia asumida
};

// Manejar el formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const fuel = document.getElementById("fuel").value;
  const efficiency = parseFloat(document.getElementById("efficiency").value);
  const distance = parseFloat(document.getElementById("distance").value);

  if (efficiency <= 0 || distance <= 0) {
    alert("Por favor ingresa valores válidos.");
    return;
  }

  const litersUsed = distance / efficiency;
  const emissionKg = litersUsed * emissionFactors[fuel];
  const treesNeeded = (emissionKg / 21).toFixed(1); // Un árbol absorbe aprox 21 kg CO₂/año

  showResult(fuel, emissionKg, treesNeeded);
});

// Mostrar resultado
function showResult(fuel, emissionKg, treesNeeded) {
  form.classList.add("hidden");
  resultSection.classList.remove("hidden");

  if (fuel === "electrico") {
    emissionText.textContent = "🚘 ¡Excelente! Tu vehículo eléctrico no genera emisiones directas de CO₂.";
  } else {
    emissionText.textContent = `Tu viaje produjo aproximadamente ${emissionKg.toFixed(2)} kg de CO₂. 
    Para compensarlo, necesitarías ${treesNeeded} árboles por año. 🌳`;
  }

  renderChart(emissionKg);
  renderRecommendations(fuel, emissionKg);
}

// Crear gráfico circular
function renderChart(emissionKg) {
  const ctx = document.getElementById("ecoChart");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Tu emisión", "Aire limpio"],
      datasets: [{
        data: [emissionKg, Math.max(0, 50 - emissionKg)],
        backgroundColor: ["#22c55e", "rgba(255,255,255,0.2)"],
        borderWidth: 0
      }]
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    }
  });
}

// Recomendaciones dinámicas
function renderRecommendations(fuel, emissionKg) {
  let tips = "";

  if (fuel === "gasolina" || fuel === "diesel") {
    tips = `
      <strong>💡 Consejos para reducir tu huella:</strong>
      <ul>
        <li>Usa transporte compartido una vez por semana.</li>
        <li>Mantén tus llantas bien infladas para mejorar la eficiencia.</li>
        <li>Considera un vehículo híbrido o eléctrico en el futuro.</li>
        <li>Planta ${Math.ceil(emissionKg / 21)} árboles este año. 🌳</li>
      </ul>`;
  } else {
    tips = `
      <strong>⚡ Tu vehículo es ecológico, pero...</strong>
      <ul>
        <li>Recarga en estaciones con energía renovable.</li>
        <li>Realiza mantenimientos regulares de batería.</li>
        <li>Comparte tus viajes para multiplicar el impacto positivo.</li>
      </ul>`;
  }

  recommendations.innerHTML = tips;
}

// Reiniciar
resetBtn.addEventListener("click", () => {
  resultSection.classList.add("hidden");
  form.classList.remove("hidden");
  form.reset();
});
