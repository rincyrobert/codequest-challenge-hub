
import React from 'react';
import { Link } from 'react-router-dom';
import { Challenge } from '../lib/challengesData';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard = ({ challenge }: ChallengeCardProps) => {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'difficulty-easy';
      case 'medium':
        return 'difficulty-medium';
      case 'hard':
        return 'difficulty-hard';
      default:
        return '';
    }
  };

  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3>{challenge.title}</h3>
        <span className={`badge badge-outline ${getDifficultyClass(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>
      <div className="card-content">
        <p>{challenge.description.substring(0, 120)}...</p>
        <div className="flex gap-2 mt-4">
          {challenge.tags.map((tag, index) => (
            <span key={index} className="badge badge-secondary">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="card-footer flex justify-between items-center">
        <div>
          <span className="badge badge-outline">
            Submissions: {challenge.submissions}
          </span>
        </div>
        <Link to={`/challenge/${challenge.id}`} className="btn btn-primary">
          Solve Challenge
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;
