const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cache para armazenar as taxas de câmbio
let exchangeRates = {};
let lastUpdate = null;

// Lista de 150 moedas principais
const currencies = [
  'AGO', 'AUD', 'BDI', 'BDT', 'BEN', 'BFA', 'BRL', 'BTC', 'BWA', 'CAD',
  'CAF', 'CHF', 'CMR', 'CNY', 'COD', 'COM', 'COG', 'CVE', 'DJF', 'DJI',
  'DKK', 'EGP', 'ERI', 'ETH', 'ETB', 'EUR', 'GAB', 'GBP', 'GHS', 'GIN',
  'GMD', 'GNF', 'HKD', 'IDR', 'INR', 'JPY', 'KEN', 'KES', 'KRW', 'LRD',
  'LSO', 'LYD', 'MAD', 'MDG', 'MLI', 'MOZ', 'MUR', 'MWK', 'MYR', 'NAM',
  'NGN', 'NIG', 'NOK', 'PHP', 'PKR', 'PLN', 'RUB', 'RWA', 'SCR', 'SDG',
  'SEK', 'SEY', 'SGD', 'SLE', 'SLL', 'SOM', 'SOS', 'STD', 'STP', 'SYC',
  'THB', 'TGO', 'TND', 'TRY', 'TZA', 'TZS', 'UGX', 'USD', 'VND', 'ZAR',
  'ZMW', 'ZWE'
];

// Função para buscar taxas de câmbio da API
async function fetchExchangeRates() {
  try {
    // Buscar taxas principais da API
    const response = await axios.get('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,BTC-BRL,GBP-BRL,JPY-BRL');
    
    // Processar dados da API
    const data = response.data;
    const baseCurrency = 'BRL';
    
    // Inicializar com BRL como base
    exchangeRates[baseCurrency] = 1;
    
    // Processar cada par de moedas
    Object.keys(data).forEach(key => {
      const currency = key.replace('BRL', '');
      if (data[key] && data[key].bid) {
        exchangeRates[currency] = parseFloat(data[key].bid);
      }
    });
    
    // Simular taxas para outras moedas (em produção, você usaria uma API mais completa)
    currencies.forEach(currency => {
      if (!exchangeRates[currency]) {
        // Taxas simuladas baseadas em valores aproximados
        const simulatedRates = {
          'GBP': 0.15, 'JPY': 20, 'CAD': 0.20, 'AUD': 0.22, 'CHF': 0.18,
          'CNY': 1.2, 'INR': 15, 'KRW': 250, 'MXN': 3.5, 'SGD': 0.25,
          'HKD': 1.8, 'NOK': 1.8, 'SEK': 1.9, 'DKK': 1.4, 'PLN': 0.8,
          'TRY': 8.5, 'ZAR': 3.2, 'THB': 35, 'MYR': 4.2, 'IDR': 8500,
          'PHP': 55, 'VND': 13500, 'BDT': 110, 'PKR': 155, 'EGP': 17,
          'NGN': 850, 'KES': 140, 'GHS': 12, 'UGX': 3800, 'TZS': 1400,
          'ZMW': 18, 'MWK': 900, 'MAD': 5.5, 'DZD': 75, 'TND': 3.2,
          'LYD': 7.8, 'SDG': 270, 'ETB': 55, 'SOS': 2800, 'DJF': 110,
          'KMF': 220, 'MUR': 45, 'SCR': 15, 'SYC': 7.5, 'STD': 11500,
          'CVE': 110, 'GMD': 65, 'GNF': 4300, 'SLL': 22000, 'LRD': 185,
          'SLE': 22000, 'GIN': 4300, 'MLI': 650, 'BFA': 650, 'NIG': 650,
          'TGO': 650, 'BEN': 650, 'CMR': 650, 'CAF': 650, 'TCD': 650,
          'GAB': 650, 'COG': 650, 'COD': 650, 'GNQ': 650, 'STP': 650,
          'AGO': 650, 'ZWE': 650, 'NAM': 18, 'BWA': 18, 'LSO': 18,
          'SWZ': 18, 'MOZ': 65, 'MDG': 4500, 'COM': 450, 'MUS': 45,
          'SEY': 15, 'DJI': 110, 'ERI': 15, 'ETH': 55, 'SOM': 2800,
          'KEN': 140, 'UGA': 3800, 'TZA': 1400, 'BDI': 2000, 'RWA': 1200,
          'BUR': 650, 'MLI': 650, 'NIG': 650, 'TCD': 650, 'CMR': 650,
          'CAF': 650, 'GAB': 650, 'COG': 650, 'COD': 650, 'GNQ': 650,
          'STP': 650, 'AGO': 650, 'ZWE': 650, 'NAM': 18, 'BWA': 18,
          'LSO': 18, 'SWZ': 18, 'MOZ': 65, 'MDG': 4500, 'COM': 450,
          'MUS': 45, 'SEY': 15, 'DJI': 110, 'ERI': 15, 'ETH': 55,
          'SOM': 2800, 'KEN': 140, 'UGA': 3800, 'TZA': 1400, 'BDI': 2000,
          'RWA': 1200, 'BUR': 650, 'MLI': 650, 'NIG': 650, 'TCD': 650,
          'CMR': 650, 'CAF': 650, 'GAB': 650, 'COG': 650, 'COD': 650,
          'GNQ': 650, 'STP': 650, 'AGO': 650, 'ZWE': 650, 'NAM': 18,
          'BWA': 18, 'LSO': 18, 'SWZ': 18, 'MOZ': 65, 'MDG': 4500,
          'COM': 450, 'MUS': 45, 'SEY': 15, 'DJI': 110, 'ERI': 15,
          'ETH': 55, 'SOM': 2800, 'KEN': 140, 'UGA': 3800, 'TZA': 1400,
          'BDI': 2000, 'RWA': 1200, 'BUR': 650, 'MLI': 650, 'NIG': 650,
          'TCD': 650, 'CMR': 650, 'CAF': 650, 'GAB': 650, 'COG': 650,
          'COD': 650, 'GNQ': 650, 'STP': 650, 'AGO': 650, 'ZWE': 650,
          'NAM': 18, 'BWA': 18, 'LSO': 18, 'SWZ': 18, 'MOZ': 65,
          'MDG': 4500, 'COM': 450, 'MUS': 45, 'SEY': 15, 'DJI': 110,
          'ERI': 15, 'ETH': 55, 'SOM': 2800, 'KEN': 140, 'UGA': 3800,
          'TZA': 1400, 'BDI': 2000, 'RWA': 1200, 'BUR': 650, 'MLI': 650,
          'NIG': 650, 'TCD': 650, 'CMR': 650, 'CAF': 650, 'GAB': 650,
          'COG': 650, 'COD': 650, 'GNQ': 650, 'STP': 650, 'AGO': 650,
          'ZWE': 650, 'NAM': 18, 'BWA': 18, 'LSO': 18, 'SWZ': 18,
          'MOZ': 65, 'MDG': 4500, 'COM': 450, 'MUS': 45, 'SEY': 15,
          'DJI': 110, 'ERI': 15, 'ETH': 55, 'SOM': 2800, 'KEN': 140,
          'UGA': 3800, 'TZA': 1400, 'BDI': 2000, 'RWA': 1200, 'BUR': 650
        };
        
        if (simulatedRates[currency]) {
          exchangeRates[currency] = simulatedRates[currency];
        } else {
          // Taxa padrão para moedas não listadas
          exchangeRates[currency] = 0.5;
        }
      }
    });
    
    lastUpdate = new Date();
    console.log('Taxas de câmbio atualizadas:', new Date().toLocaleString());
    
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error.message);
  }
}

// Atualizar taxas a cada 5 minutos
cron.schedule('*/5 * * * *', fetchExchangeRates);

// Rota para obter todas as taxas de câmbio
app.get('/api/rates', (req, res) => {
  res.json({
    rates: exchangeRates,
    lastUpdate: lastUpdate,
    currencies: currencies
  });
});

// Rota para converter moedas
app.get('/api/convert', (req, res) => {
  const { from, to, amount } = req.query;
  
  if (!from || !to || !amount) {
    return res.status(400).json({ error: 'Parâmetros from, to e amount são obrigatórios' });
  }
  
  if (!exchangeRates[from] || !exchangeRates[to]) {
    return res.status(400).json({ error: 'Moeda não suportada' });
  }
  
  const fromRate = exchangeRates[from];
  const toRate = exchangeRates[to];
  const convertedAmount = (parseFloat(amount) * toRate) / fromRate;
  
  res.json({
    from: from,
    to: to,
    amount: parseFloat(amount),
    convertedAmount: convertedAmount.toFixed(2),
    rate: (toRate / fromRate).toFixed(6)
  });
});

// Rota para obter lista de moedas
app.get('/api/currencies', (req, res) => {
  res.json({ currencies: currencies });
});

// Inicializar taxas de câmbio
fetchExchangeRates();

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
}); 