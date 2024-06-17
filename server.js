// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/stock-viewer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const stockSchema = new mongoose.Schema({
    symbol: String,
    price: Number,
    timestamp: Date,
});

const Stock = mongoose.model('Stock', stockSchema);

// API endpoint to get stock data
app.get('/api/stocks', async (req, res) => {
    const stocks = await Stock.find();
    res.json(stocks);
});

// API endpoint to add stock data
app.post('/api/stocks', async (req, res) => {
    const { symbol, price } = req.body;
    const newStock = new Stock({ symbol, price, timestamp: new Date() });
    await newStock.save();
    res.json(newStock);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
