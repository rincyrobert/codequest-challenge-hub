
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';
import TestResults from '../components/TestResults';
import { getChallenge, getChallengeLeaderboard } from '../lib/challengesData';
import '../styles/Challenge.css';

const Challenge = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const challenge = getChallenge(Number(id));
  const leaderboard = getChallengeLeaderboard(Number(id));
  
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState<{ id: number; name: string; status: 'pass' | 'fail' | 'running'; message?: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [timer, setTimer] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [solved, setSolved] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/welcome');
    }
  }, [navigate]);

  useEffect(() => {
    if (challenge) {
      setCode(challenge.initialCode);
    }
  }, [challenge]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!challenge) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container my-8 text-center">
          <h1>Challenge not found</h1>
          <Link to="/challenges" className="btn btn-primary mt-4">
            Back to Challenges
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startSolving = () => {
    if (!timerRunning) {
      setTimerRunning(true);
    }
  };

  const runTests = () => {
    setIsRunning(true);
    setTestResults([]);
    
    // Simulate running tests
    setTimeout(() => {
      const results = challenge.testCases.map((testCase, index) => {
        // In a real app, we would evaluate the Python code here
        // For now, we'll just simulate random results for demo
        const passed = Math.random() > 0.3;
        
        return {
          id: index,
          name: `Test Case ${index + 1}`,
          status: passed ? 'pass' as const : 'fail' as const,
          message: passed ? undefined : 'Expected output did not match.'
        };
      });
      
      setTestResults(results);
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate submission and validation
    setTimeout(() => {
      // Simulate all tests passing for the demo
      const allPassed = true;
      
      if (allPassed) {
        setTimerRunning(false);
        setSolved(true);
        
        // Save completion data
        const userData = localStorage.getItem('user');
        const completionTime = formatTime(timer);
        
        if (userData) {
          const user = JSON.parse(userData);
          const completions = JSON.parse(localStorage.getItem('completions') || '[]');
          completions.push({
            challengeId: challenge.id,
            userId: user.id,
            username: user.username,
            completionTime,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('completions', JSON.stringify(completions));
        }
        
        alert(`Congratulations! Your solution has been submitted successfully. Your time: ${completionTime}`);
      } else {
        alert('Your solution failed some test cases. Please fix and try again.');
      }
      
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container my-8">
        <div className="flex justify-between items-center mb-4 fade-in">
          <div>
            <Link to="/challenges" className="navbar-link mb-2 inline-block">
              ← Back to Challenges
            </Link>
            <h1>{challenge.title}</h1>
            <div className="flex gap-2 my-2">
              <span className={`badge badge-outline ${
                challenge.difficulty === 'Easy' ? 'difficulty-easy' : 
                challenge.difficulty === 'Medium' ? 'difficulty-medium' : 
                'difficulty-hard'
              }`}>
                {challenge.difficulty}
              </span>
              {challenge.tags.map((tag, index) => (
                <span key={index} className="badge badge-secondary">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="challenge-actions">
            {timerRunning && (
              <div className="timer-display">
                Time: {formatTime(timer)}
              </div>
            )}
            <button 
              className="btn btn-outline"
              onClick={() => setShowLeaderboard(!showLeaderboard)}
            >
              {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`${showLeaderboard ? 'md:col-span-2' : 'md:col-span-3'}`}>
            <div className="card mb-8 slide-in">
              <div className="card-header">
                <h2>Problem Description</h2>
              </div>
              <div className="card-content">
                <p>{challenge.description}</p>
                
                {!timerRunning && !solved && (
                  <button 
                    className="btn btn-primary mt-4"
                    onClick={startSolving}
                  >
                    Start Solving
                  </button>
                )}
              </div>
            </div>

            {(timerRunning || solved) && (
              <div className="editor-container mb-8 fade-in">
                <div className="editor-header">
                  <span>Python</span>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-outline" 
                      onClick={runTests}
                      disabled={isRunning}
                    >
                      {isRunning ? 'Running...' : 'Run Tests'}
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={handleSubmit}
                      disabled={isSubmitting || isRunning || solved}
                    >
                      {isSubmitting ? 'Submitting...' : solved ? 'Submitted' : 'Submit Solution'}
                    </button>
                  </div>
                </div>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language="python"
                />
              </div>
            )}

            {(timerRunning || solved) && (
              <TestResults testCases={testResults} isRunning={isRunning} />
            )}
          </div>
          
          {showLeaderboard && (
            <div className="md:col-span-1 fade-in">
              <div className="card">
                <div className="card-header">
                  <h2>Top Performers</h2>
                </div>
                <div className="card-content">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboard.map((entry) => (
                        <tr key={entry.id} className={`rank-${entry.rank}`}>
                          <td>#{entry.rank}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img src={entry.avatar} alt={entry.username} />
                              </div>
                              {entry.username}
                            </div>
                          </td>
                          <td>{entry.completionTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Challenge;
