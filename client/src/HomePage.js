import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
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

  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value) {
      try {
        const response = await axios.get(`http://localhost:5001/api/search-tickers?q=${e.target.value}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching tickers:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectStock = (symbol) => {
    setSearchQuery(symbol);
    setSearchResults([]);
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="homepage">
      <header>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for a stock here..."
            className="search-bar"
          />
          {searchQuery && (
            <ul className="search-results">
              {searchResults.length ? (
                searchResults.map((stock, index) => (
                  <li key={index} onClick={() => handleSelectStock(stock.symbol)}>
                    <span className="search-symbol">{stock.symbol}</span> - <span className="search-name">{stock.name}</span>
                  </li>
                ))
              ) : (
                <li className="search-no-results">Stock not found</li>
              )}
            </ul>
          )}
        </div>
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
