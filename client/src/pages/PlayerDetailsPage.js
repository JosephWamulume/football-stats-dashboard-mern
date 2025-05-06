import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const PlayerDetailsPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        // In production, this would be a call to your backend API
        // const response = await axios.get(`/api/players/${id}`);
        
        // For development without the backend ready, we'll use sample data
        const samplePlayer = {
          id: 101,
          name: 'Bukayo Saka',
          firstName: 'Bukayo',
          lastName: 'Saka',
          dateOfBirth: '2001-09-05',
          nationality: 'England',
          position: 'Attacker',
          shirtNumber: 7,
          currentTeam: {
            id: 1,
            name: 'Arsenal FC',
            crest: 'https://crests.football-data.org/57.png'
          }
        };
        
        const sampleStats = {
          appearances: 38,
          goals: 14,
          assists: 11,
          yellowCards: 2,
          redCards: 0,
          minutesPlayed: 3240,
          passAccuracy: 82,
          shotsOnTarget: 43
        };
        
        setTimeout(() => {
          setPlayer(samplePlayer);
          setStats(sampleStats);
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError('Failed to fetch player details. Please try again later.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPlayerDetails();
  }, [id]);

  const calculateAge = (dateOfBirth) => {
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
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading player details...</p>
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
      <Link to={`/teams/${player?.currentTeam?.id}`} className="btn btn-outline-secondary mb-4">
        <i className="fas fa-arrow-left"></i> Back to Team
      </Link>
      
      {player && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center mb-3 mb-md-0">
                  {/* Placeholder for player image - in a real app, you'd use an actual player photo */}
                  <div className="bg-light rounded d-inline-flex align-items-center justify-content-center mb-3" style={{width: "200px", height: "200px"}}>
                    <span className="display-1 text-secondary">{player.shirtNumber}</span>
                  </div>
                  <h3>{player.name}</h3>
                  <div className="d-flex align-items-center justify-content-center">
                    <img 
                      src={player.currentTeam.crest} 
                      alt={`${player.currentTeam.name} crest`} 
                      style={{height: "30px", marginRight: "10px"}}
                    />
                    <span>{player.currentTeam.name}</span>
                  </div>
                </div>
                <div className="col-md-8">
                  <h2 className="mb-3">Player Profile</h2>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Full Name:</strong> {player.firstName} {player.lastName}</p>
                      <p><strong>Date of Birth:</strong> {new Date(player.dateOfBirth).toLocaleDateString()} ({calculateAge(player.dateOfBirth)} years)</p>
                      <p><strong>Nationality:</strong> {player.nationality}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Position:</strong> {player.position}</p>
                      <p><strong>Shirt Number:</strong> {player.shirtNumber}</p>
                      <p><strong>Current Team:</strong> {player.currentTeam.name}</p>
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
                        <td>{(stats.goals / stats.appearances).toFixed(2)}</td>
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
                This section would display performance charts for the player when connected to the API with real data.
                Charts could visualize goals/assists over time, heatmaps of positions played, radar charts of skills, etc.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailsPage;
