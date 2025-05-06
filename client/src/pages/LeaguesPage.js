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
        // In a production app, this would call your backend API
        // const response = await axios.get('/api/leagues');
        
        // For development without the backend ready, we'll use sample data
        // This will be replaced with actual API calls when backend is set up
        const sampleLeagues = [
          { id: 'PL', name: 'Premier League', country: 'England', logo: 'https://crests.football-data.org/PL.png' },
          { id: 'PD', name: 'La Liga', country: 'Spain', logo: 'https://crests.football-data.org/PD.png' },
          { id: 'SA', name: 'Serie A', country: 'Italy', logo: 'https://crests.football-data.org/SA.png' },
          { id: 'BL1', name: 'Bundesliga', country: 'Germany', logo: 'https://crests.football-data.org/BL1.png' },
          { id: 'FL1', name: 'Ligue 1', country: 'France', logo: 'https://crests.football-data.org/FL1.png' },
          { id: 'DED', name: 'Eredivisie', country: 'Netherlands', logo: 'https://crests.football-data.org/ED.png' },
          { id: 'PPL', name: 'Primeira Liga', country: 'Portugal', logo: 'https://crests.football-data.org/PPL.png' },
          { id: 'BSA', name: 'Brasileiro Série A', country: 'Brazil', logo: 'https://crests.football-data.org/BSA.png' },
        ];
        
        setTimeout(() => {
          setLeagues(sampleLeagues);
          setLoading(false);
        }, 500); // Simulate network delay
        
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
          <div className="col" key={league.id}>
            <div className="card h-100">
              <div className="text-center pt-3">
                <img 
                  src={league.logo} 
                  alt={`${league.name} logo`} 
                  className="card-img-top" 
                  style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain' }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{league.name}</h5>
                <p className="card-text"><i className="fas fa-globe me-2"></i>{league.country}</p>
                <Link to={`/leagues/${league.id}`} className="btn btn-primary">
                  View Standings
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaguesPage;
