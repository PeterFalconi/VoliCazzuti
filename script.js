document.getElementById('search-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const fromCity = document.getElementById('from-city').value;
  const toCity = document.getElementById('to-city').value;
  const departureDate = document.getElementById('departure-date').value;
  const adults = document.getElementById('adults').value;

  const apiUrl = `https://api.travelpayouts.com/v2/prices/latest?origin=${fromCity}&destination=${toCity}&departure_at=${departureDate}&adults=${adults}&token=f438ef847616d4e4229a56129f870ba2`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    if (data?.data?.length === 0) {
      resultsList.innerHTML = '<li>Nessun volo trovato</li>';
      return;
    }

    data.data.forEach(flight => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>${flight.airline}</strong><br>
        Prezzo: ${flight.price} €<br>
        Partenza: ${new Date(flight.departure_at).toLocaleString()}
      `;
      resultsList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Errore durante la ricerca:', error);
    document.getElementById('results-list').innerHTML = '<li>Errore nella richiesta. Riprova più tardi.</li>';
  }
});
