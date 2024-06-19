import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [biggestMarketCap, setBiggestMarketCap] = useState([]);

  useEffect(() => {
    const fetchTopPerformers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/top-performers');
        setTopPerformers(response.data);
      } catch (error) {
        console.error('Error fetching top performers:', error);
      }
    };

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

  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await axios.get(`http://localhost:5001/api/stock-suggestions?q=${query}`);
        setSuggestions(response.data);
      } catch (error) {
        console.error('Error fetching stock suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (symbol) => {
    setSearchQuery(symbol);
    setSuggestions([]);
    navigate(`/stock/${symbol}`);
  };

  return (
    <div className="homepage">
      <header>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for a stock..."
            className="search-bar"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion.symbol)}>
                {suggestion.name} ({suggestion.symbol})
              </li>
            ))}
          </ul>
        )}
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
