import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Football Stats Dashboard</h5>
            <p className="text-muted">
              A comprehensive football statistics application built with the MERN stack.
            </p>
          </div>
          <div className="col-md-3">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-light">Home</a></li>
              <li><a href="/leagues" className="text-light">Leagues</a></li>
              <li><a href="/teams" className="text-light">Teams</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Data Source</h5>
            <p className="text-muted">
              Powered by <a href="https://www.football-data.org/" className="text-light" target="_blank" rel="noopener noreferrer">football-data.org</a>
            </p>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col text-center">
            <p className="mb-0">© {new Date().getFullYear()} Football Stats Dashboard. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
