import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const StockDetail = ({ match }) => {
  const { symbol } = match.params;
  const [stockData, setStockData] = useState([]);
  const [stockInfo, setStockInfo] = useState({});

  useEffect(() => {
    const fetchStockData = async () => {
      const response = await axios.get(`http://localhost:5001/api/stocks?symbol=${symbol}`);
      setStockData(response.data);
      const infoResponse = await axios.get(`http://localhost:5001/api/stock-info?symbol=${symbol}`);
      setStockInfo(infoResponse.data);
    };

    fetchStockData();
  }, [symbol]);

  const data = {
    labels: stockData.map(stock => new Date(stock.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Stock Price',
        data: stockData.map(stock => stock.price),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h1>{symbol} Stock Details</h1>
      <Line data={data} />
      <div>
        <h2>Stock Information</h2>
        <p>Open: {stockInfo.open}</p>
        <p>Highest: {stockInfo.high}</p>
        <p>Low: {stockInfo.low}</p>
        <p>Mkt Cap: {stockInfo.marketCap}</p>
        <p>P/E Ratio: {stockInfo.peRatio}</p>
        <p>Div Yield: {stockInfo.dividendYield}</p>
        <p>CDP Score: {stockInfo.cdpScore}</p>
        <p>52-wk High: {stockInfo.week52High}</p>
        <p>52-wk Low: {stockInfo.week52Low}</p>
      </div>
    </div>
  );
};

export default StockDetail;
