import React, { useState, useEffect } from 'react';
import './Studentview.css';
import youtube from './imgs/youtube.png';

const StudentView = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([
    {
      id: 1,
      title: 'Understanding Pointers in C',
      url: 'https://www.youtube.com/watch?v=example1',
      reason: 'Based on your recent quiz performance',
    },
    {
      id: 2,
      title: 'Memory Allocation in C++',
      url: 'https://www.youtube.com/watch?v=example2',
      reason: 'Recommended by your professor',
    },
    {
      id: 3,
      title: 'Data Structures: Linked Lists',
      url: 'https://www.youtube.com/watch?v=example3',
      reason: 'Upcoming topic in your course',
    },
  ]);
  const [notes, setNotes] = useState([]);
  const [courseId, setCourseId] = useState('');

  const name = 'Justin Gamboa';

  const imgs = { youtube };

  const getCanvasBaseUrl = () => {
    const url = window.location.href;
    const match = url.match(/(https?:\/\/[^\/]+)/);
    return match ? match[1] : null;
  };

  const fetchCurrentCourseId = () => {
    const url = window.location.href;
    const match = url.match(/\/courses\/(\d+)/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  };

  const fetchAssignments = async (courseId) => {
    const baseUrl = getCanvasBaseUrl();
    if (!baseUrl) {
      console.error('Unable to determine Canvas base URL');
      return;
    }

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
      const assignmentsResponse = await fetch(
        `${baseUrl}/api/v1/courses/${courseId}/assignments`,
        requestOptions
      );
      const assignmentsResult = await assignmentsResponse.json();
      console.log('Assignments:', assignmentsResult);

      const formattedAssignments = await Promise.all(
        assignmentsResult.map(async (assignment) => {
          console.log('Fetching submission for Assignment ID:', assignment.id);
          try {
            const submissionResponse = await fetch(
              `${baseUrl}/api/v1/courses/${courseId}/assignments/${assignment.id}/submissions/self`,
              requestOptions
            );
            if (!submissionResponse.ok) {
              throw new Error(
                `HTTP error! status: ${submissionResponse.status}`
              );
            }
            const submissionResult = await submissionResponse.json();
            console.log('Submission Result:', submissionResult);

            return {
              name: assignment.name,
              score: submissionResult.score || 'N/A',
              pointsPossible: assignment.points_possible,
            };
          } catch (error) {
            console.error(
              `Error fetching submission for assignment ${assignment.id}:`,
              error
            );
            return {
              name: assignment.name,
              score: 'Error',
              pointsPossible: assignment.points_possible,
            };
          }
        })
      );

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
      (assignment) => assignment.score !== 'N/A' && assignment.score !== 'Error'
    );
    return (
      gradedAssignments.reduce(
        (acc, assignment) =>
          acc + (Number(assignment.score) / assignment.pointsPossible) * 100,
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
        <div className="performance-overview fade-in">
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
        <div className="content-container slide-in">
          <h2 className="content-title">Your Assignments</h2>
          <div className="assignments-list">
            <ul>
              {assignments.map((assignment, index) => (
                <li
                  key={assignment.name}
                  className="list-item slide-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div>
                    <h3 className="item-title">{assignment.name}</h3>
                    <p
                      className={`item-score ${
                        assignment.score === 'N/A' ||
                        assignment.score === 'Error'
                          ? ''
                          : Number(assignment.score) <
                            assignment.pointsPossible * 0.7
                          ? 'score-bad'
                          : 'score-good'
                      }`}
                    >
                      {assignment.score === 'N/A' ||
                      assignment.score === 'Error'
                        ? assignment.score
                        : `${assignment.score}/${assignment.pointsPossible}`}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="content-container slide-in">
          <h2 className="content-title">Recommended Videos</h2>
          <ul>
            {recommendedVideos.map((video, index) => (
              <li
                key={video.id}
                className="list-item slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div>
                  <span className="item-title">{video.title}</span>
                  <p className="video-reason">{video.reason}</p>
                </div>
                <a
                  href={video.url}
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
        <div className="content-container slide-in">
          <h2 className="content-title">Your Notes</h2>
          <textarea
            className="notes-textarea fade-in"
            placeholder="Enter your note..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addNote(e.target.value);
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
