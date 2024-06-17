import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/stock/${searchQuery}`);
    }
  };

  console.log('HomePage rendered');
  return (
    <div>
      <header>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a stock..."
          />
          <button type="submit">Search</button>
        </form>
      </header>
      <section>
        <h2>Watchlist</h2>
        {/* Add watchlist implementation here */}
      </section>
    </div>
  );
};

export default HomePage;
