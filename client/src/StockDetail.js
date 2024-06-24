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
      setStockData(response.data.slice(0, 30)); // Limit to the latest 30 days
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
        .domain([d3.min(stockData, d => d.close), d3.max(stockData, d => d.close)]).nice()
        .range([height - margin.bottom, margin.top]);

      const line = d3.line()
        .x(d => x(new Date(d.timestamp)))
        .y(d => y(d.close))
        .curve(d3.curveLinear);

      svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));

      svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

      svg.append("path")
        .datum(stockData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", line);

      const focus = svg.append("g")
        .attr("class", "focus")
        .style("display", "none");

      focus.append("circle")
        .attr("r", 5)
        .attr("fill", "green");

      focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("stroke", "green")
        .attr("stroke-dasharray", "3,3")
        .attr("y1", 0)
        .attr("y2", height - margin.bottom);

      focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

      const overlay = svg.append("rect")
        .attr("class", "overlay")
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", () => focus.style("display", null))
        .on("mouseout", () => focus.style("display", "none"))
        .on("mousemove", mousemove);

      const bisectDate = d3.bisector(d => new Date(d.timestamp)).left;

      function mousemove(event) {
        const x0 = x.invert(d3.pointer(event, this)[0]);
        const i = bisectDate(stockData, x0, 1);
        const d0 = stockData[i - 1];
        const d1 = stockData[i];
        const d = !d1 || x0 - new Date(d0.timestamp) > new Date(d1.timestamp) - x0 ? d0 : d1;
        focus.attr("transform", `translate(${x(new Date(d.timestamp))},${y(d.close)})`);
        focus.select("text").text(`$${d.close.toFixed(2)} USD, ${d3.timeFormat("%a, %b %d")(new Date(d.timestamp))}`);
        focus.select(".x-hover-line").attr("y2", height - y(d.close) - margin.bottom);
      }
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
