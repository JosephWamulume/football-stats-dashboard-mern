# Football Stats Dashboard

A comprehensive football statistics dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with the football-data.org API.

## Features

- View football leagues from around the world
- Explore team details including squad information
- View league standings and statistics
- Check top scorers for each league
- View match schedules and results
- In-memory caching to reduce API calls and handle rate limits

## Local Development

1. Clone the repository
   ```
   git clone https://github.com/yourusername/football-stats-dashboard-mern.git
   cd football-stats-dashboard-mern
   ```

2. Install dependencies
   ```
   npm run install-all
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/football-stats
   FOOTBALL_API_KEY=your_api_key_here
   NODE_ENV=development
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Deployment

### Deploying to Render

1. Create a Render account at [render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Use the following settings:
   - **Name**: football-stats-dashboard
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Add the following environment variables:
   - `NODE_ENV`: production
   - `FOOTBALL_API_KEY`: Your API key from football-data.org
   - `MONGODB_URI`: Your MongoDB connection string (optional for our app)

For automated deployments, you can use the included `render.yaml` file.

## API Reference

This project uses the football-data.org API. You'll need to sign up for a free API key at [football-data.org](https://www.football-data.org/client/register).

## Technologies Used

- **Frontend**: React, React Router, Axios, Chart.js
- **Backend**: Node.js, Express
- **Database**: MongoDB (optional with in-memory caching)
- **APIs**: football-data.org

## License

MIT
