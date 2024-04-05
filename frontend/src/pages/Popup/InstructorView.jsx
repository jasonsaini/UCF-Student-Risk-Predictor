import React, { useState, useEffect } from 'react';
import './Popup.css';
import youtube from '../Popup/imgs/youtube.png';

const InstructorView = () => {
  const [activeTab, setActiveTab] = useState('assignments');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [notifications, setNotifications] = useState([]);

  const imgs = { youtube };

  // Fetch student and attendance data
  useEffect(() => {
    // Fetch student data from an API or database
    setStudents([
      { name: 'John Doe', scores: [77, 33] },
      { name: 'Jane Smith', scores: [92, 85] },
      // Add more students as needed
    ]);

    // Fetch attendance data from an API or database
    setAttendance({
      'John Doe': [true, false, true],
      'Jane Smith': [true, true, true],
      // Add more attendance data as needed
    });
  }, []);

  // Calculate average score to determine risk
  const calculateAverageScore = (scores) => {
    return scores.reduce((acc, score) => acc + score, 0) / scores.length;
  };

  // Calculate risk factor
  const calculateRiskFactor = (averageScore) => {
    return averageScore < 50 ? 1 : averageScore < 70 ? 0.5 : 0;
  };

  // Define the risk meter color based on the risk factor
  const getRiskMeterColor = (riskFactor) => {
    return riskFactor === 1
      ? 'bg-red-600'
      : riskFactor === 0.5
      ? 'bg-yellow-500'
      : 'bg-green-500';
  };

  // Calculate class performance overview
  const getClassPerformanceOverview = () => {
    let highRiskCount = 0;
    let mediumRiskCount = 0;
    let lowRiskCount = 0;
    let totalScore = 0;

    students.forEach((student) => {
      const averageScore = calculateAverageScore(student.scores);
      const riskFactor = calculateRiskFactor(averageScore);

      if (riskFactor === 1) {
        highRiskCount++;
      } else if (riskFactor === 0.5) {
        mediumRiskCount++;
      } else {
        lowRiskCount++;
      }

      totalScore += averageScore;
    });

    const classSize = students.length;
    const averageScore = totalScore / classSize;

    return {
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      averageScore,
    };
  };

  // Handle sending notifications
  const sendNotification = (message) => {
    setNotifications([...notifications, message]);
  };

  // Render the components
  return (
    <body className="bg-gray-100">
      {/* Class Performance Overview */}
      <div className="max-w-2xl mx-auto my-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            Class Performance Overview
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-1">High Risk</h3>
              <p className="text-2xl font-bold text-red-600">
                {getClassPerformanceOverview().highRiskCount}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Medium Risk</h3>
              <p className="text-2xl font-bold text-yellow-500">
                {getClassPerformanceOverview().mediumRiskCount}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-1">Low Risk</h3>
              <p className="text-2xl font-bold text-green-500">
                {getClassPerformanceOverview().lowRiskCount}
              </p>
            </div>
          </div>
          <p className="text-sm font-medium mt-4">
            Average Score:{' '}
            {getClassPerformanceOverview().averageScore.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Student Risk Dashboard */}
      <div className="max-w-2xl mx-auto my-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Student Risk Dashboard</h2>
          <ul className="space-y-2">
            {students.map((student) => (
              <li
                key={student.name}
                className="flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 rounded hover:bg-blue-200 transition-colors duration-150 ease-in-out"
              >
                <div>
                  <h3 className="font-medium text-gray-700">{student.name}</h3>
                  <p className="text-sm text-gray-500">
                    Average Score:{' '}
                    {calculateAverageScore(student.scores).toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    Attendance:{' '}
                    {attendance[student.name].filter(Boolean).length}/
                    {attendance[student.name].length}
                  </p>
                </div>
                <div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      calculateRiskFactor(
                        calculateAverageScore(student.scores)
                      ) === 1
                        ? 'bg-red-600 text-white'
                        : calculateRiskFactor(
                            calculateAverageScore(student.scores)
                          ) === 0.5
                        ? 'bg-yellow-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {calculateRiskFactor(
                      calculateAverageScore(student.scores)
                    ) === 1
                      ? 'High Risk'
                      : calculateRiskFactor(
                          calculateAverageScore(student.scores)
                        ) === 0.5
                      ? 'Medium Risk'
                      : 'Low Risk'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Early Intervention Alerts */}
      <div className="max-w-2xl mx-auto my-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">
            Early Intervention Alerts
          </h2>
          <ul className="space-y-2">
            {students
              .filter(
                (student) =>
                  calculateRiskFactor(calculateAverageScore(student.scores)) ===
                  1
              )
              .map((student) => (
                <li
                  key={student.name}
                  className="flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 border-red-500 rounded"
                >
                  <div>
                    <h3 className="font-medium text-gray-700">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Average Score:{' '}
                      {calculateAverageScore(student.scores).toFixed(2)}%
                    </p>
                    <p className="text-sm text-gray-500">
                      Attendance:{' '}
                      {attendance[student.name].filter(Boolean).length}/
                      {attendance[student.name].length}
                    </p>
                  </div>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                    onClick={() =>
                      sendNotification(
                        `Sent intervention alert for ${student.name}`
                      )
                    }
                  >
                    Send Intervention Alert
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Communication Tools */}
      <div className="max-w-2xl mx-auto my-4">
        <div className="bg-white shadow-sm rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-2">Communication Tools</h2>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-2 mb-2"
            placeholder="Enter your message..."
          ></textarea>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
            onClick={() => sendNotification('Message sent to students')}
          >
            Send Message
          </button>
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-1">Notifications</h3>
            <ul className="space-y-2">
              {notifications.map((notification, index) => (
                <li
                  key={index}
                  className="bg-white shadow-sm px-4 py-3 border-l-4 border-blue-500 rounded"
                >
                  <p className="text-sm text-gray-700">{notification}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Existing Assignments and Videos */}
      {/* ... */}
    </body>
  );
};

export default InstructorView;
