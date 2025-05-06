import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const LeagueDetailsPage = () => {
  const { id } = useParams();
  const [leagueDetails, setLeagueDetails] = useState(null);
  const [standings, setStandings] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeagueDetails = async () => {
      try {
        setLoading(true);
        console.log(`Fetching league ${id} details and standings from API...`);
        
        // Call our backend API for league details
        const detailsResponse = await axios.get(`/api/leagues/${id}`);
        setLeagueDetails(detailsResponse.data);
        
        // Call our backend API for league standings
        const standingsResponse = await axios.get(`/api/leagues/${id}/standings`);
        
        // Process the standings data
        if (standingsResponse.data.standings && standingsResponse.data.standings.length > 0) {
          // API returns multiple standings tables for different groups in some competitions
          // For simplicity, we'll use the first one (which is typically the main table)
          const standingsTable = standingsResponse.data.standings[0].table || [];
          setStandings(standingsTable);
        }
        
        // Fetch top scorers
        try {
          console.log(`Fetching top scorers for league ${id}`);
          const scorersResponse = await axios.get(`/api/leagues/${id}/scorers`);
          setTopScorers(scorersResponse.data.scorers || []);
          console.log(`Fetched ${scorersResponse.data.scorers?.length || 0} top scorers`);
        } catch (scorersError) {
          console.error(`Error fetching top scorers for league ${id}:`, scorersError.message);
          // Don't set the main error state, just log it
        }
        
        // Fetch recent matches
        try {
          console.log(`Fetching recent matches for league ${id}`);
          // Get matches from the last 30 days
          const today = new Date();
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(today.getDate() - 30);
          
          const dateFrom = thirtyDaysAgo.toISOString().split('T')[0];
          const dateTo = today.toISOString().split('T')[0];
          
          const matchesResponse = await axios.get(`/api/leagues/${id}/matches`, {
            params: {
              dateFrom,
              dateTo,
              status: 'FINISHED'
            }
          });
          
          setRecentMatches(matchesResponse.data.matches || []);
          console.log(`Fetched ${matchesResponse.data.matches?.length || 0} recent matches`);
        } catch (matchesError) {
          console.error(`Error fetching recent matches for league ${id}:`, matchesError.message);
          // Don't set the main error state, just log it
        }
        
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching league ${id} details:`, err.message);
        setError('Failed to fetch league details. Please try again later.');
        setLoading(false);
        
        // Fallback to sample data if API fails
        const sampleLeagues = {
          'PL': { id: 'PL', name: 'Premier League', country: 'England', emblem: 'https://crests.football-data.org/PL.png' },
          'PD': { id: 'PD', name: 'La Liga', country: 'Spain', emblem: 'https://crests.football-data.org/PD.png' },
          'SA': { id: 'SA', name: 'Serie A', country: 'Italy', emblem: 'https://crests.football-data.org/SA.png' },
          'BL1': { id: 'BL1', name: 'Bundesliga', country: 'Germany', emblem: 'https://crests.football-data.org/BL1.png' },
          'FL1': { id: 'FL1', name: 'Ligue 1', country: 'France', emblem: 'https://crests.football-data.org/FL1.png' }
        };
        
        const sampleStandings = [
          { position: 1, team: { id: 1, name: 'Team A', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 8, draw: 1, lost: 1, points: 25, goalsFor: 20, goalsAgainst: 8 },
          { position: 2, team: { id: 2, name: 'Team B', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 7, draw: 2, lost: 1, points: 23, goalsFor: 18, goalsAgainst: 10 },
          { position: 3, team: { id: 3, name: 'Team C', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 6, draw: 2, lost: 2, points: 20, goalsFor: 16, goalsAgainst: 9 },
          { position: 4, team: { id: 4, name: 'Team D', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 5, draw: 3, lost: 2, points: 18, goalsFor: 15, goalsAgainst: 10 },
          { position: 5, team: { id: 5, name: 'Team E', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 5, draw: 2, lost: 3, points: 17, goalsFor: 14, goalsAgainst: 12 },
          { position: 6, team: { id: 6, name: 'Team F', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 4, draw: 4, lost: 2, points: 16, goalsFor: 12, goalsAgainst: 10 },
          { position: 7, team: { id: 7, name: 'Team G', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 4, draw: 3, lost: 3, points: 15, goalsFor: 11, goalsAgainst: 10 },
          { position: 8, team: { id: 8, name: 'Team H', crest: 'https://via.placeholder.com/30' }, playedGames: 10, won: 3, draw: 5, lost: 2, points: 14, goalsFor: 10, goalsAgainst: 9 }
        ];
        
        setLeagueDetails(sampleLeagues[id] || { name: 'Unknown League', country: 'Unknown' });
        setStandings(sampleStandings);
      }
    };

    fetchLeagueDetails();
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading league details...</p>
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
      <div className="d-flex align-items-center mb-4">
        <Link to="/leagues" className="btn btn-outline-secondary me-3">
          <i className="fas fa-arrow-left"></i> Back to Leagues
        </Link>
        {leagueDetails?.emblem && (
          <img 
            src={leagueDetails.emblem} 
            alt={`${leagueDetails.name} logo`} 
            style={{ height: '50px', marginRight: '15px' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/50?text=League';
            }}
          />
        )}
        <div>
          <h2 className="mb-0">{leagueDetails?.name}</h2>
          <p className="text-muted mb-0">{leagueDetails?.country || leagueDetails?.area?.name}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h4 className="mb-0">League Standings</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover standings-table mb-0">
              <thead>
                <tr>
                  <th>Pos</th>
                  <th>Team</th>
                  <th>Played</th>
                  <th>W</th>
                  <th>D</th>
                  <th>L</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {standings.map(team => (
                  <tr key={team.position}>
                    <td>{team.position}</td>
                    <td>
                      <Link to={`/teams/${team.team.id}`} className="text-decoration-none text-dark">
                        <div className="d-flex align-items-center">
                          <img 
                            src={team.team.crest} 
                            alt={`${team.team.name} logo`}
                            style={{ height: '20px', width: '20px', marginRight: '10px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/20?text=Team';
                            }}
                          />
                          {team.team.name}
                        </div>
                      </Link>
                    </td>
                    <td>{team.playedGames}</td>
                    <td>{team.won}</td>
                    <td>{team.draw}</td>
                    <td>{team.lost}</td>
                    <td>{team.goalsFor}</td>
                    <td>{team.goalsAgainst}</td>
                    <td>{team.goalDifference}</td>
                    <td><strong>{team.points}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Stats and Charts section */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Top Scorers</h5>
            </div>
            <div className="card-body">
              {topScorers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Goals</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topScorers.map((scorer, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <Link 
                              to={`/players/${scorer.player.id}`} 
                              className="text-decoration-none text-dark"
                            >
                              {scorer.player.name}
                            </Link>
                          </td>
                          <td>
                            <Link 
                              to={`/teams/${scorer.team.id}`} 
                              className="text-decoration-none text-dark"
                            >
                              <div className="d-flex align-items-center">
                                <img 
                                  src={scorer.team.crest} 
                                  alt={`${scorer.team.name} logo`}
                                  style={{ height: '20px', width: '20px', marginRight: '5px' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/20?text=Team';
                                  }}
                                />
                                <span className="d-none d-sm-inline">{scorer.team.name}</span>
                                <span className="d-inline d-sm-none">{scorer.team.tla || scorer.team.shortName}</span>
                              </div>
                            </Link>
                          </td>
                          <td>{scorer.goals}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center my-4">No top scorer data available for this league.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-header">
              <h5 className="mb-0">Recent Results</h5>
            </div>
            <div className="card-body">
              {recentMatches.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Home</th>
                        <th>Score</th>
                        <th>Away</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentMatches.slice(0, 10).map((match) => (
                        <tr key={match.id}>
                          <td>{formatDate(match.utcDate)}</td>
                          <td className="text-end">
                            <Link to={`/teams/${match.homeTeam.id}`} className="text-decoration-none text-dark">
                              <div className="d-flex align-items-center justify-content-end">
                                <span className="me-2">{match.homeTeam.shortName || match.homeTeam.name}</span>
                                <img 
                                  src={match.homeTeam.crest} 
                                  alt={`${match.homeTeam.name} logo`}
                                  style={{ height: '20px', width: '20px' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/20?text=Team';
                                  }}
                                />
                              </div>
                            </Link>
                          </td>
                          <td className="text-center">
                            <strong>
                              {match.score.fullTime.home ?? '-'} - {match.score.fullTime.away ?? '-'}
                            </strong>
                          </td>
                          <td>
                            <Link to={`/teams/${match.awayTeam.id}`} className="text-decoration-none text-dark">
                              <div className="d-flex align-items-center">
                                <img 
                                  src={match.awayTeam.crest} 
                                  alt={`${match.awayTeam.name} logo`}
                                  style={{ height: '20px', width: '20px', marginRight: '5px' }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/20?text=Team';
                                  }}
                                />
                                <span>{match.awayTeam.shortName || match.awayTeam.name}</span>
                              </div>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted text-center my-4">No recent match data available for this league.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeagueDetailsPage;
