const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Abilita CORS
app.use(cors());

app.get('/flights', async (req, res) => {
  const { origin, destination, date } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ error: 'Parametri mancanti' });
  }

  try {
    const url = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${origin}&destination=${destination}&departure_at=${date}&currency=eur&token=f438ef847616d4e4229a56129f870ba2`;
    console.log('🛰️ Chiamata verso:', url);

    const response = await fetch(url);
    const data = await response.json();

    console.log('📦 Risposta Travelpayouts:', data);

    if (!response.ok || data.success === false) {
      return res.status(500).json({
        error: 'Errore nella risposta di Travelpayouts',
        details: data
      });
    }

    res.json(data);
  } catch (err) {
    console.error('💥 Errore interno:', err);
    res.status(500).json({ error: 'Errore interno al server', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🛫 Server in ascolto su http://localhost:${PORT}`);
});
