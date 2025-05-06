import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const LeaguesPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        // Call our backend API to get leagues data
        const response = await axios.get('/api/leagues');
        
        // Set the leagues data from the API response
        setLeagues(response.data.competitions || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch leagues. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchLeagues();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading leagues...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Football Leagues</h2>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {leagues.map(league => (
          <div className="col" key={league.id || league.code}>
            <div className="card h-100">
              <div className="text-center pt-3">
                <img 
                  src={league.emblem || league.logo} 
                  alt={`${league.name} logo`} 
                  className="card-img-top" 
                  style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{league.name}</h5>
                <p className="card-text"><i className="fas fa-globe me-2"></i>{league.country || league.area?.name || 'Unknown'}</p>
                <Link to={`/leagues/${league.code || league.id}`} className="btn btn-primary">
                  View Standings
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {leagues.length === 0 && !loading && !error && (
        <div className="alert alert-info my-4">
          No leagues found. Please check your API connection or try again later.
        </div>
      )}
    </div>
  );
};

export default LeaguesPage;
