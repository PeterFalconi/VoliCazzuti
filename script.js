document.getElementById('search-form').addEventListener('submit', async function(event) {
  event.preventDefault();

  const departureCity = document.getElementById('departure-city').value.toUpperCase();
  const arrivalCity = document.getElementById('arrival-city').value.toUpperCase();
  const departureDate = document.getElementById('departure-date').value;

  const apiUrl = `http://localhost:3000/flights?origin=${departureCity}&destination=${arrivalCity}&date=${departureDate}`;

  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '<p>🔍 Caricamento in corso...</p>';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

    const data = await response.json();
    if (!data.data || data.data.length === 0) {
      resultsDiv.innerHTML = `<p>❌ Nessun volo trovato per questi criteri.</p>`;
      return;
    }

    resultsDiv.innerHTML = ''; // Svuota i risultati precedenti
    data.data.forEach(flight => {
      const flightCard = document.createElement('div');
      flightCard.className = 'flight-card';

      flightCard.innerHTML = `
        <h3>
          <img src="https://pics.avs.io/40/20/${flight.airline}.png" alt="${flight.airline}">
          ${flight.airline.toUpperCase()} – ${flight.price}€
        </h3>
        <p><strong>Partenza:</strong> ${new Date(flight.departure_at).toLocaleString('it-IT')}</p>
        <p><strong>Ritorno:</strong> ${flight.return_at ? new Date(flight.return_at).toLocaleString('it-IT') : 'N/D'}</p>
        <p><strong>Durata:</strong> ${flight.duration || 'N/A'} minuti</p>
        <a href="https://www.aviasales.com${flight.link}" target="_blank" style="color: #4dafff;">Prenota ora</a>
      `;
      resultsDiv.appendChild(flightCard);
    });

  } catch (err) {
    console.error(err);
    resultsDiv.innerHTML = `<p>⚠️ Errore durante la ricerca: ${err.message}</p>`;
  }
});
