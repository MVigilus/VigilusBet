const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Configura le credenziali e l'App Key
const username = 'matteoscout2002@gmail.com';
const password = '!Macchia55';
const appKey = 'noaBo3REsPhRQuJ9';

let sessionKey = '';

// Configura il middleware CORS
app.use(cors());

async function getSessionKey() {
  try {
    const response = await axios.post('https://identitysso.betfair.it/api/login', `username=${username}&password=${password}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Application': appKey,
      }
    });

    const body = response.data;
    console.log('Response Body:', body);

    if (body && body.status === 'SUCCESS') {
      sessionKey = body.token;
      console.log("SESSION TOKEN =", sessionKey);
    } else if (body && body.status === 'LIMITED_ACCESS') {
      console.warn('Accesso limitato:', body.error);
    } else if (body && body.status === 'LOGIN_RESTRICTED') {
      console.error('Login ristretto:', body.error);
    } else if (body && body.status === 'FAIL') {
      console.error('Login fallito:', body.error);
    } else {
      console.error('Errore: risposta inattesa', body);
    }
  } catch (error) {
    console.error('Errore durante il recupero del session key:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    }
  }
}

// Chiamata iniziale per ottenere il session key
getSessionKey();

app.use(express.json());

// Funzione per recuperare il catalogo dei mercati
async function listMarketCatalogue() {
  try {
    const response = await axios.post('https://api.betfair.com/exchange/betting/rest/v1.0/listMarketCatalogue/', {
      filter: {
        eventTypeIds: [1], // 1 è l'ID per il calcio
        marketTypeCodes: ['MATCH_ODDS']
      },
      maxResults: '100',
      marketProjection: ['COMPETITION', 'EVENT', 'EVENT_TYPE', 'RUNNER_DESCRIPTION']
    }, {
      headers: {
        'Accept': 'application/json',
        'X-Application': appKey,
        'X-Authentication': sessionKey,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Errore nel recupero del catalogo dei mercati:', error);
    throw error;
  }
}

// Endpoint per recuperare i dati delle partite
app.get('/api/matches', async (req, res) => {
  try {
    const data = await listMarketCatalogue();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Errore nel recupero dei dati delle partite' });
  }
});

// Funzione per piazzare un ordine
async function placeOrders(marketId, selectionId, stake) {
  try {
    const response = await axios.post('https://api.betfair.com/exchange/betting/rest/v1.0/placeOrders/', {
      marketId: marketId,
      instructions: [{
        selectionId: selectionId,
        handicap: 0,
        side: 'BACK',
        orderType: 'LIMIT',
        limitOrder: {
          size: stake,
          price: 2.0,
          persistenceType: 'LAPSE'
        }
      }]
    }, {
      headers: {
        'Accept': 'application/json',
        'X-Application': appKey,
        'X-Authentication': sessionKey,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Errore nella piazzatura dell\'ordine:', error);
    throw error;
  }
}

// Endpoint per fare una scommessa
app.post('/api/bet', async (req, res) => {
  const { marketId, selectionId, stake } = req.body;
  try {
    const data = await placeOrders(marketId, selectionId, stake);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Errore nella piazzatura della scommessa' });
  }
});

app.listen(port, () => {
  console.log(`Server in ascolto su http://localhost:${port}`);
});
