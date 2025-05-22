import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getErrorDetails } from '../utils/errorHandler';

const PlayerDetailsPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlayerDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching details for player ${id}...`);
      
      // Fetch player data from our API
      const response = await axios.get(`/api/players/${id}`);
      setPlayer(response.data);
      
      // Extract stats from player data if available
      // API might not provide detailed stats so we'll use sample data for now
      // In a future enhancement, we could collect this data from multiple endpoint calls
      const playerStats = {
        appearances: response.data.appearances || 0,
        goals: response.data.goals || 0,
        assists: response.data.assists || 0,
        yellowCards: response.data.yellowCards || 0,
        redCards: response.data.redCards || 0,
        minutesPlayed: response.data.minutesPlayed || 0,
        passAccuracy: response.data.passAccuracy || 0,
        shotsOnTarget: response.data.shotsOnTarget || 0
      };
      
      setStats(playerStats);
      setLoading(false);
      console.log('Player data loaded successfully');
    } catch (err) {
      const errorDetails = getErrorDetails(err, 'Failed to fetch player details.');
      setError(errorDetails);
      setLoading(false);
      console.error('Player fetch error:', err);
    }
  };

  useEffect(() => {
    fetchPlayerDetails();
  }, [id]);

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'Unknown';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return <LoadingSpinner message="Loading player details..." fullPage={true} />;
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error.message} 
        errorCode={error.code} 
        onRetry={error.canRetry ? fetchPlayerDetails : undefined} 
      />
    );
  }

  if (!player) {
    return (
      <ErrorMessage 
        message="Player information not found. The player may not exist or there was an error retrieving the data." 
        errorCode="404"
        small={false}
      />
    );
  }

  return (
    <div>
      <Link to={`/teams/${player?.currentTeam?.id}`} className="btn btn-outline-secondary mb-4">
        <i className="fas fa-arrow-left"></i> Back to Team
      </Link>
      
      {player && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-3 mb-md-0">
                  {/* Player image or placeholder */}
                  <div className="bg-light rounded d-inline-flex align-items-center justify-content-center mb-3" style={{width: "200px", height: "200px"}}>
                    {player.shirtNumber ? (
                      <span className="display-1 text-secondary">{player.shirtNumber}</span>
                    ) : (
                      <i className="fas fa-user-alt fa-5x text-secondary"></i>
                    )}
                  </div>
                  <h3>{player.name}</h3>
                  {player.currentTeam && (
                    <div className="d-flex align-items-center justify-content-center">
                      <img 
                        src={player.currentTeam.crest} 
                        alt={`${player.currentTeam.name} crest`} 
                        style={{height: "30px", marginRight: "10px"}}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/30?text=Team';
                        }}
                      />
                      <span>{player.currentTeam.name}</span>
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <h2 className="mb-3">Player Profile</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Full Name:</strong> {player.firstName ? `${player.firstName} ${player.lastName || ''}` : player.name}</p>
                      <p><strong>Date of Birth:</strong> {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'Unknown'} {player.dateOfBirth ? `(${calculateAge(player.dateOfBirth)} years)` : ''}</p>
                      <p><strong>Nationality:</strong> {player.nationality || 'Unknown'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Position:</strong> {player.position || 'Unknown'}</p>
                      <p><strong>Shirt Number:</strong> {player.shirtNumber || 'Unknown'}</p>
                      <p><strong>Current Team:</strong> {player.currentTeam?.name || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {stats && (
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="mb-0">Season Statistics</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="card bg-light h-100">
                      <div className="card-body text-center">
                        <h1 className="display-4">{stats.appearances}</h1>
                        <p className="mb-0">Appearances</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="card bg-light h-100">
                      <div className="card-body text-center">
                        <h1 className="display-4">{stats.goals}</h1>
                        <p className="mb-0">Goals</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="card bg-light h-100">
                      <div className="card-body text-center">
                        <h1 className="display-4">{stats.assists}</h1>
                        <p className="mb-0">Assists</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-sm-6 mb-4">
                    <div className="card bg-light h-100">
                      <div className="card-body text-center">
                        <h1 className="display-4">{stats.minutesPlayed}</h1>
                        <p className="mb-0">Minutes Played</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="table-responsive mt-3">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Yellow Cards</td>
                        <td>{stats.yellowCards}</td>
                      </tr>
                      <tr>
                        <td>Red Cards</td>
                        <td>{stats.redCards}</td>
                      </tr>
                      <tr>
                        <td>Pass Accuracy</td>
                        <td>{stats.passAccuracy}%</td>
                      </tr>
                      <tr>
                        <td>Shots on Target</td>
                        <td>{stats.shotsOnTarget}</td>
                      </tr>
                      <tr>
                        <td>Goals per Match</td>
                        <td>{stats.appearances > 0 ? (stats.goals / stats.appearances).toFixed(2) : '0.00'}</td>
                      </tr>
                      <tr>
                        <td>Minutes per Goal</td>
                        <td>{stats.goals > 0 ? Math.round(stats.minutesPlayed / stats.goals) : 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          <div className="card">
            <div className="card-header">
              <h4 className="mb-0">Performance Charts</h4>
            </div>
            <div className="card-body">
              <p className="text-muted">
                This section would display performance charts for the player when more detailed 
                statistical data is available from the API. Future enhancements could include
                visualizations of goals/assists over time, heatmaps of positions played, 
                radar charts of skills, etc.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailsPage;
