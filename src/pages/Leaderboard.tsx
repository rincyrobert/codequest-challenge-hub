
import React from 'react';
import Navbar from '../components/Navbar';
import { leaderboard } from '../lib/challengesData';

const Leaderboard = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container my-8">
        <h1 className="mb-8 fade-in">Global Leaderboard</h1>
        
        <div className="card slide-in">
          <div className="card-header">
            <h2>Top Performers</h2>
          </div>
          <div className="card-content">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Solved</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.id} className={entry.rank <= 3 ? `rank-${entry.rank}` : ''}>
                    <td>#{entry.rank}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img src={entry.avatar} alt={entry.username} />
                        </div>
                        {entry.username}
                      </div>
                    </td>
                    <td>{entry.solvedChallenges}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
