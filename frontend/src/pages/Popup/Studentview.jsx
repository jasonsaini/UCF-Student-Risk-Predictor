import React, { useState, useEffect } from 'react';
import './Popup.css';
import youtube from '../Popup/imgs/youtube.png';

const StudentView = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [notes, setNotes] = useState([]);

  const imgs = { youtube };

  // Fetch assignment and video data
  useEffect(() => {
    // Fetch assignment data from an API or database
    setAssignments([
      { name: 'COT 4210 -- Homework 3', score: 77 },
      { name: 'COP 4934 - Journal Week 5', score: 33 },
      // Add more assignments as needed
    ]);

    // Fetch recommended video data from an API or database
    setRecommendedVideos([
      {
        name: 'COT 4210 - Understanding Recursion',
        link: 'https://youtube.com',
      },
      {
        name: 'COP 4934 - Writing Effective Journals',
        link: 'https://youtube.com',
      },
      // Add more recommended videos as needed
    ]);
  }, []);

  // Calculate average score to determine risk
  const calculateAverageScore = () => {
    return (
      assignments.reduce((acc, assignment) => acc + assignment.score, 0) /
      assignments.length
    );
  };

  const averageScore = calculateAverageScore();

  // Risk factor, simple logic where below 50% is high risk
  const riskFactor = averageScore < 50 ? 1 : averageScore < 70 ? 0.5 : 0;

  // Define the risk meter color based on the risk factor
  const getRiskMeterColor = () => {
    return riskFactor === 1
      ? 'bg-red-600'
      : riskFactor === 0.5
      ? 'bg-yellow-500'
      : 'bg-green-500';
  };

  // Handle adding notes
  const addNote = (note) => {
    setNotes([...notes, note]);
  };

  return (
    <body className="bg-gray-100">
      {/* Class Performance Overview */}
      <div className="max-w-2xl mx-auto my-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            Your Performance Overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">Risk Level</h3>
              <p
                className={`text-2xl font-bold ${
                  riskFactor === 1
                    ? 'text-red-600'
                    : riskFactor === 0.5
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                {riskFactor === 1
                  ? 'High'
                  : riskFactor === 0.5
                  ? 'Medium'
                  : 'Low'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Average Score</h3>
              <p className="text-2xl font-bold text-gray-700">
                {averageScore.toFixed(2)}%
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Recommended Videos</h3>
              <p className="text-2xl font-bold text-blue-600">
                {recommendedVideos.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 my-4">
        <button
          className={`text-md px-4 py-2 border rounded ${
            activeTab === 'assignments'
              ? 'bg-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-600'
          } hover:bg-blue-700 focus:outline-none`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`text-md px-4 py-2 border rounded ${
            activeTab === 'videos'
              ? 'bg-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-600'
          } hover:bg-blue-700 focus:outline-none`}
          onClick={() => setActiveTab('videos')}
        >
          Recommended Videos
        </button>
        <button
          className={`text-md px-4 py-2 border rounded ${
            activeTab === 'notes'
              ? 'bg-blue-600 text-white'
              : 'bg-white border-gray-300 text-gray-600'
          } hover:bg-blue-700 focus:outline-none`}
          onClick={() => setActiveTab('notes')}
        >
          Notes
        </button>
      </div>

      {activeTab === 'assignments' && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">Your Assignments</h2>
          <ul className="space-y-2">
            {assignments.map((assignment) => (
              <li
                key={assignment.name}
                className="flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 rounded hover:bg-blue-200 transition-colors duration-150 ease-in-out"
              >
                <div>
                  <h3 className="font-medium text-gray-700">
                    {assignment.name}
                  </h3>
                  <p
                    className={`text-sm font-bold ${
                      assignment.score < 70 ? 'text-red-600' : 'text-green-600'
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
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">Recommended Videos</h2>
          <ul className="space-y-2">
            {recommendedVideos.map((video) => (
              <li
                key={video.name}
                className="flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 rounded hover:bg-blue-200 transition-colors duration-150 ease-in-out"
              >
                <span className="font-medium text-gray-700">{video.name}</span>
                <a href={video.link} target="_blank">
                  <img className="h-6 w-9" src={youtube} alt="youtube-logo" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">Your Notes</h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            placeholder="Enter your note..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addNote(e.target.value);
                e.target.value = '';
              }
            }}
          ></textarea>
          <ul className="space-y-2">
            {notes.map((note, index) => (
              <li
                key={index}
                className="bg-white shadow-sm px-4 py-3 border-l-4 border-blue-500 rounded"
              >
                <p className="text-sm text-gray-700">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </body>
  );
};

export default StudentView;
