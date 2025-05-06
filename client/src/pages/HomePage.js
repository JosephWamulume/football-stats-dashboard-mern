import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <div className="jumbotron bg-light p-5 rounded mb-4">
        <h1 className="display-4">Football Stats Dashboard</h1>
        <p className="lead">
          Your comprehensive source for football statistics, league standings, team information, and player data.
        </p>
        <hr className="my-4" />
        <p>
          Explore the latest stats from top football leagues around the world.
        </p>
        <Link to="/leagues" className="btn btn-primary btn-lg">
          Explore Leagues
        </Link>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-trophy me-2"></i>
                League Standings
              </h5>
              <p className="card-text">
                View current standings from top leagues including Premier League, La Liga, Serie A, and more.
              </p>
              <Link to="/leagues" className="btn btn-outline-primary">
                View Leagues
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-shield-alt me-2"></i>
                Team Profiles
              </h5>
              <p className="card-text">
                Explore detailed team profiles with squad information, match history, and statistics.
              </p>
              <Link to="/teams" className="btn btn-outline-primary">
                View Teams
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">
                <i className="fas fa-user-alt me-2"></i>
                Player Statistics
              </h5>
              <p className="card-text">
                Analyze player performance with comprehensive statistics and comparison tools.
              </p>
              <Link to="/teams" className="btn btn-outline-primary">
                Find Players
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body">
              <h5 className="card-title">About This Project</h5>
              <p className="card-text">
                This Football Stats Dashboard is built using the MERN stack (MongoDB, Express, React, and Node.js) 
                and integrates with football-data.org API to provide up-to-date football statistics.
              </p>
              <p className="card-text">
                Features include league standings, team information, player statistics, and more.
                The application demonstrates full-stack development skills and data visualization capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
