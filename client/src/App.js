// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

const App = () => {
    const [stocks, setStocks] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchStocks = async () => {
            const response = await axios.get('http://localhost:5001/api/stocks');
            setStocks(response.data);
        };

        fetchStocks();
    }, []);

    const data = {
        labels: stocks.map(stock => new Date(stock.timestamp).toLocaleTimeString()),
        datasets: [
            {
                label: 'Stock Price',
                data: stocks.map(stock => stock.price),
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    };

    return (
        <div>
            <h1>Real-Time Stock Data</h1>
            <Line ref={chartRef} data={data} />
        </div>
    );
};

export default App;
