import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getErrorDetails } from '../utils/errorHandler';

const LeaguesPage = () => {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeagues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our backend API to get leagues data
      const response = await axios.get('/api/leagues');
      
      // Set the leagues data from the API response
      setLeagues(response.data.competitions || []);
      setLoading(false);
    } catch (err) {
      const errorDetails = getErrorDetails(err, 'Failed to fetch leagues.');
      setError(errorDetails);
      setLoading(false);
      console.error('League fetch error:', err);
    }
  };

  useEffect(() => {
    fetchLeagues();
  }, []);

  if (loading && leagues.length === 0) {
    return <LoadingSpinner message="Loading leagues..." fullPage={true} />;
  }

  if (error && leagues.length === 0) {
    return (
      <ErrorMessage 
        message={error.message} 
        errorCode={error.code} 
        onRetry={error.canRetry ? fetchLeagues : undefined} 
      />
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
