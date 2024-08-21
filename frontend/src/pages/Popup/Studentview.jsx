import React, { useState, useEffect } from 'react';
import './Studentview.css';
import youtube from './imgs/youtube.png';

const StudentView = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [courseId, setCourseId] = useState('');

  const name = 'Justin Gamboa';

  const imgs = { youtube };

  const fetchCurrentCourseId = () => {
    const url = window.location.href;
    const match = url.match(/\/courses\/(\d+)/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  const fetchAssignments = async (courseId) => {
    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      'Bearer 1158~xYFM7MAFfKKQGcBvnwHMFBB3nwCwT2Q2V2WAkPM8N974AHFkXRmmDVa986Nr8YR8'
    );

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    try {
      const response = await fetch(
        `https://webcourses.ucf.edu/api/v1/courses/${courseId}/assignments`,
        requestOptions
      );
      const result = await response.json();

      const formattedAssignments = result.map((assignment) => ({
        name: assignment.name,
        score: assignment.grade ? assignment.grade : 'N/A',
      }));

      setAssignments(formattedAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  useEffect(() => {
    const updateCourseAndAssignments = () => {
      const currentCourseId = fetchCurrentCourseId();
      if (currentCourseId && currentCourseId !== courseId) {
        setCourseId(currentCourseId);
        fetchAssignments(currentCourseId);
      }
    };

    updateCourseAndAssignments();

    const intervalId = setInterval(updateCourseAndAssignments, 5000);

    return () => clearInterval(intervalId);
  }, [courseId]);

  const calculateAverageScore = () => {
    const gradedAssignments = assignments.filter(
      (assignment) => assignment.score !== 'N/A'
    );
    return (
      gradedAssignments.reduce(
        (acc, assignment) => acc + Number(assignment.score),
        0
      ) / gradedAssignments.length
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
          <div className="assignments-list">
            <ul>
              {assignments.map((assignment) => (
                <li key={assignment.name} className="list-item">
                  <div>
                    <h3 className="item-title">{assignment.name}</h3>
                    <p
                      className={`item-score ${
                        assignment.score === 'N/A'
                          ? ''
                          : Number(assignment.score) < 70
                          ? 'score-bad'
                          : 'score-good'
                      }`}
                    >
                      {assignment.score === 'N/A'
                        ? 'N/A'
                        : `${assignment.score}%`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
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
