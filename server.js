// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Example endpoint to fetch stock data from Alpha Vantage
app.get('/api/stocks', async (req, res) => {
    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'TIME_SERIES_INTRADAY',
                symbol: 'AAPL',
                interval: '1min',
                apikey: 'OW4D70D1ABXY1EXP' // Your Alpha Vantage API key
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
