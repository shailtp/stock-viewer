// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const API_KEY = 'OW4D70D1ABXY1EXP';

// Endpoint to fetch stock data
app.get('/api/stocks', async (req, res) => {
    const symbol = req.query.symbol || 'AAPL';
    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'TIME_SERIES_INTRADAY',
                symbol: symbol,
                interval: '1min',
                apikey: OW4D70D1ABXY1EXP
            }
        });
        const data = response.data['Time Series (1min)'];
        const formattedData = Object.keys(data).map(key => ({
            timestamp: key,
            price: parseFloat(data[key]['1. open'])
        }));
        res.json(formattedData);
    } catch (error) {
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
                apikey: OW4D70D1ABXY1EXP
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching stock info');
    }
});

app.get('/api/top-performers', async (req, res) => {
    // Mock data - replace with actual data fetching logic
    const topPerformers = [
      { name: 'Stock A', priceChange: 10 },
      { name: 'Stock B', priceChange: 8 },
      { name: 'Stock C', priceChange: 7 },
      { name: 'Stock D', priceChange: 6 },
      { name: 'Stock E', priceChange: 5 },
    ];
    res.json(topPerformers);
  });
  
  app.get('/api/biggest-market-cap', async (req, res) => {
    // Mock data - replace with actual data fetching logic
    const biggestMarketCap = [
      { name: 'Stock X', marketCap: 1000 },
      { name: 'Stock Y', marketCap: 800 },
      { name: 'Stock Z', marketCap: 700 },
      { name: 'Stock W', marketCap: 600 },
      { name: 'Stock V', marketCap: 500 },
    ];
    res.json(biggestMarketCap);
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
