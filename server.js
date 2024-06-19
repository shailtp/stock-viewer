const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const API_KEY = 'TOB5L935J6VGQAO8';

// Read the nasdaq_full_tickers.json file
const tickerData = JSON.parse(fs.readFileSync(path.join(__dirname, 'nasdaq_full_tickers.json')));

// Endpoint to fetch stock data
app.get('/api/stocks', async (req, res) => {
  const symbol = req.query.symbol || 'AAPL';
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    if (response.data['Error Message']) {
      console.error('Error fetching stock data:', response.data['Error Message']);
      return res.status(500).send('Error fetching stock data');
    }

    const data = response.data['Time Series (Daily)'];
    if (!data) {
      console.error('No data returned for symbol:', symbol);
      console.error('Response received:', response.data);
      return res.status(500).send('No data returned');
    }

    const formattedData = Object.keys(data).map(key => ({
      timestamp: key,
      open: parseFloat(data[key]['1. open']),
      high: parseFloat(data[key]['2. high']),
      low: parseFloat(data[key]['3. low']),
      close: parseFloat(data[key]['4. close']),
      volume: parseInt(data[key]['5. volume'])
    }));
    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).send('Error fetching stock data');
  }
});

// Endpoint to fetch stock info
app.get('/api/stock-info', async (req, res) => {
  const symbol = req.query.symbol || 'AAPL';
  try {
    const response = await axios.get('https://www.alphavantage.co/query', {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: API_KEY
      }
    });

    if (response.data['Error Message']) {
      console.error('Error fetching stock info:', response.data['Error Message']);
      return res.status(500).send('Error fetching stock info');
    }

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching stock info:', error.message);
    res.status(500).send('Error fetching stock info');
  }
});

// Endpoint to fetch top performers
app.get('/api/top-performers', async (req, res) => {
  // Mock data for now
  const topPerformers = [
    { name: 'AAPL', priceChange: 10 },
    { name: 'MSFT', priceChange: 8 },
    { name: 'GOOGL', priceChange: 7 },
    { name: 'AMZN', priceChange: 6 },
    { name: 'TSLA', priceChange: 5 }
  ];
  res.json(topPerformers);
});

// Endpoint to fetch biggest market cap
app.get('/api/biggest-market-cap', async (req, res) => {
  // Mock data for now
  const biggestMarketCap = [
    { name: 'AAPL', marketCap: 2000 },
    { name: 'MSFT', marketCap: 1800 },
    { name: 'GOOGL', marketCap: 1500 },
    { name: 'AMZN', marketCap: 1400 },
    { name: 'TSLA', marketCap: 1000 }
  ];
  res.json(biggestMarketCap);
});

// Endpoint to fetch stock suggestions
app.get('/api/stock-suggestions', (req, res) => {
  const query = req.query.q.toLowerCase();
  const suggestions = tickerData.filter(stock =>
    stock.symbol.toLowerCase().includes(query) ||
    stock.name.toLowerCase().includes(query)
  ).slice(0, 10); // Limit results to 10
  res.json(suggestions);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
