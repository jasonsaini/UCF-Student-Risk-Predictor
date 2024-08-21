import React, { useState, useEffect } from 'react';
import './Studentview.css';
import youtube from './imgs/youtube.png';

const StudentView = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const name = 'Justin Gamboa';

  const imgs = { youtube };

  useEffect(() => {
    setAssignments([
      { name: 'COT 4210 -- Homework 3', score: 77 },
      { name: 'COP 4934 - Journal Week 5', score: 33 },
    ]);

    setRecommendedVideos([
      {
        name: 'COT 4210 - Understanding Recursion',
        link: 'https://youtube.com',
      },
      {
        name: 'COP 4934 - Writing Effective Journals',
        link: 'https://youtube.com',
      },
    ]);
  }, []);

  const calculateAverageScore = () => {
    return (
      assignments.reduce((acc, assignment) => acc + assignment.score, 0) /
      assignments.length
    );
  };

  const averageScore = calculateAverageScore();
  const riskFactor = averageScore < 50 ? 1 : averageScore < 70 ? 0.5 : 0;

  const getRiskLevelClass = () => {
    return riskFactor === 1
      ? 'risk-high'
      : riskFactor === 0.5
      ? 'risk-medium'
      : 'risk-low';
  };

  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  return (
    <body className="student-view">
      <div className="container">
        <div className="performance-overview">
          <h2 className="overview-title">Your Performance Overview</h2>
          <h3>{name}</h3>
          <div className="overview-grid">
            <div>
              <h3 className="risk-level">Risk Level</h3>
              <p className={`risk-value ${getRiskLevelClass()}`}>
                {riskFactor === 1
                  ? 'High'
                  : riskFactor === 0.5
                  ? 'Medium'
                  : 'Low'}
              </p>
            </div>
            <div>
              <h3 className="risk-level">Average Score</h3>
              <p className="risk-value average-score">
                {averageScore.toFixed(2)}%
              </p>
            </div>
            <div>
              <h3 className="risk-level">Recommended Videos</h3>
              <p className="risk-value recommended-videos">
                {recommendedVideos.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-container">
        <button
          className={`tab-button ${
            activeTab === 'assignments' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`tab-button ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          Recommended Videos
        </button>
        <button
          className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>

      {activeTab === 'assignments' && (
        <div className="content-container">
          <h2 className="content-title">Your Assignments</h2>
          <ul>
            {assignments.map((assignment) => (
              <li key={assignment.name} className="list-item">
                <div>
                  <h3 className="item-title">{assignment.name}</h3>
                  <p
                    className={`item-score ${
                      assignment.score < 70 ? 'score-bad' : 'score-good'
                    }`}
                  >
                    {assignment.score}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="content-container">
          <h2 className="content-title">Recommended Videos</h2>
          <ul>
            {recommendedVideos.map((video) => (
              <li key={video.name} className="list-item">
                <span className="item-title">{video.name}</span>
                <a
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="youtube-link"
                >
                  <img src={youtube} alt="youtube-logo" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="content-container">
          <h2 className="content-title">Your Notes</h2>
          <textarea
            className="notes-textarea"
            placeholder="Enter your note..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addNote(e.target.value);
                e.target.value = '';
              }
            }}
          ></textarea>
          <ul>
            {notes.map((note, index) => (
              <li key={index} className="note-item">
                <p className="note-text">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </body>
  );
};

export default StudentView;
