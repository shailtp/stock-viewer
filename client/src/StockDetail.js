import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import './StockDetail.css';
import { useParams } from 'react-router-dom';

const StockDetail = () => {
  const { symbol } = useParams();
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


  useEffect(() => {
    if (stockData.length > 0) {
      const svg = d3.select("#chart");
      svg.selectAll("*").remove();

      const width = parseInt(svg.style("width"));
      const height = parseInt(svg.style("height"));
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };

      const x = d3.scaleTime()
        .domain(d3.extent(stockData, d => new Date(d.timestamp)))
        .range([margin.left, width - margin.right]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(stockData, d => d.close)]).nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3.line()
        .x(d => x(new Date(d.timestamp)))
        .y(d => y(d.close))
        .curve(d3.curveLinear);

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y-%m-%d")));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append("path")
        .datum(stockData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    }
  }, [stockData]);

  return (
    <div>
      <h1>{symbol} Stock Details</h1>
      <svg id="chart"></svg>
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
