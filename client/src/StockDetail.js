import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useParams } from 'react-router-dom';
import './StockDetail.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const StockDetail = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState([]);
  const [timeRange, setTimeRange] = useState('1M'); // Default time range

  const fetchData = async (range) => {
    const response = await axios.get(`http://localhost:5001/api/stocks`, {
      params: {
        symbol,
        range
      }
    });
    setStockData(response.data);
  };

  useEffect(() => {
    fetchData(timeRange);
  }, [symbol, timeRange]);

  const data = {
    labels: stockData.map(d => new Date(d.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: `${symbol} Stock Price`,
        data: stockData.map(d => d.close),
        fill: false,
        borderColor: 'green',
        tension: 0.1,
        pointBackgroundColor: 'green',
      },
    ],
  };

  const options = {
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Date',
        },
        reverse: true // Reverse the x-axis to have the latest date at the end
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const date = context.label;
            const price = context.raw;
            return `${symbol}, ${date}\nPrice: $${price.toFixed(2)}`;
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="stock-detail">
      <h1>{symbol} Stock Details</h1>
      <div className="time-range-buttons">
        {['1M', '1Y', '5Y'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={timeRange === range ? 'active' : ''}
          >
            {range}
          </button>
        ))}
      </div>
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default StockDetail;
