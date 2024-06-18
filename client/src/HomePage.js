import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [topPerformers, setTopPerformers] = useState([]);
  const [biggestMarketCap, setBiggestMarketCap] = useState([]);

  useEffect(() => {
    // Fetch top performers
    const fetchTopPerformers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/top-performers');
        setTopPerformers(response.data);
      } catch (error) {
        console.error('Error fetching top performers:', error);
      }
    };

    // Fetch biggest market cap
    const fetchBiggestMarketCap = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/biggest-market-cap');
        setBiggestMarketCap(response.data);
      } catch (error) {
        console.error('Error fetching biggest market cap:', error);
      }
    };

    fetchTopPerformers();
    fetchBiggestMarketCap();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/stock/${searchQuery}`);
    }
  };

  return (
    <div className="homepage">
      <header>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a stock..."
            className="search-bar"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </header>
      <section className="top-performers">
        <h2>Top Performers (Last 24 hours)</h2>
        <div className="stock-list">
          {topPerformers.map((stock, index) => (
            <div key={index} className="stock-item">
              <h3>{stock.name}</h3>
              <p>Price Change: {stock.priceChange}%</p>
            </div>
          ))}
        </div>
      </section>
      <section className="biggest-market-cap">
        <h2>Biggest Market Cap</h2>
        <div className="stock-list">
          {biggestMarketCap.map((stock, index) => (
            <div key={index} className="stock-item">
              <h3>{stock.name}</h3>
              <p>Market Cap: ${stock.marketCap}B</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
