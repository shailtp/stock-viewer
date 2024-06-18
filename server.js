const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const API_KEY = 'TOB5L935J6VGQAO8';

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
        const data = response.data['Time Series (Daily)'];
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
        res.json(response.data);
    } catch (error) {
        res.status(500).send('Error fetching stock info');
    }
});

// Endpoint to fetch top performers
app.get('/api/top-performers', async (req, res) => {
    // Example implementation with Alpha Vantage
    const topPerformers = [
      { name: 'AAPL', priceChange: 10 },
      { name: 'MSFT', priceChange: 8 },
      { name: 'GOOGL', priceChange: 7 },
      { name: 'AMZN', priceChange: 6 },
      { name: 'TSLA', priceChange: 5 },
    ];
    res.json(topPerformers);
});

// Endpoint to fetch biggest market cap
app.get('/api/biggest-market-cap', async (req, res) => {
    // Example implementation with Alpha Vantage
    const biggestMarketCap = [
      { name: 'AAPL', marketCap: 2000 },
      { name: 'MSFT', marketCap: 1800 },
      { name: 'GOOGL', marketCap: 1500 },
      { name: 'AMZN', marketCap: 1400 },
      { name: 'TSLA', marketCap: 1000 },
    ];
    res.json(biggestMarketCap);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
