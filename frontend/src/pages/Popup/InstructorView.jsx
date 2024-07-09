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

  const styles = {
    body: {
      backgroundColor: '#f7fafc',
      fontFamily: 'Arial, sans-serif',
    },
    container: {
      maxWidth: '40rem',
      margin: '1rem auto',
      padding: '1rem',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderRadius: '0.375rem',
    },
    title: {
      fontSize: '1.125rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
    },
    item: {
      textAlign: 'center',
    },
    itemTitle: {
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.25rem',
    },
    highRisk: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#e53e3e',
    },
    mediumRisk: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#ecc94b',
    },
    lowRisk: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#48bb78',
    },
    averageScore: {
      fontSize: '0.875rem',
      fontWeight: '500',
      marginTop: '1rem',
    },
    studentList: {
      listStyleType: 'none',
      padding: '0',
      margin: '0',
    },
    studentItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: '4px solid transparent',
      borderRadius: '0.375rem',
      transition: 'background-color 0.15s ease-in-out',
      cursor: 'pointer',
    },
    studentItemHover: {
      backgroundColor: '#bee3f8',
    },
    studentName: {
      fontSize: '1rem',
      fontWeight: '500',
      color: '#4a5568',
    },
    studentDetail: {
      fontSize: '0.875rem',
      color: '#a0aec0',
    },
    riskTag: {
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#fff',
    },
    highRiskTag: {
      backgroundColor: '#e53e3e',
    },
    mediumRiskTag: {
      backgroundColor: '#ecc94b',
    },
    lowRiskTag: {
      backgroundColor: '#48bb78',
    },
    button: {
      backgroundColor: '#e53e3e',
      color: '#fff',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease-in-out',
    },
    buttonHover: {
      backgroundColor: '#c53030',
    },
    textArea: {
      width: '100%',
      border: '1px solid #cbd5e0',
      borderRadius: '0.375rem',
      padding: '0.5rem',
      marginBottom: '0.5rem',
    },
    messageButton: {
      backgroundColor: '#3182ce',
      color: '#fff',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      transition: 'background-color 0.15s ease-in-out',
    },
    messageButtonHover: {
      backgroundColor: '#2b6cb0',
    },
    notificationList: {
      listStyleType: 'none',
      padding: '0',
      margin: '0',
      marginTop: '1rem',
    },
    notificationItem: {
      padding: '0.75rem 1rem',
      backgroundColor: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: '4px solid #3182ce',
      borderRadius: '0.375rem',
    },
  };

  // Render the components
  return (
    <body style={styles.body}>
      {/* Class Performance Overview */}
      <div style={styles.container}>
        <div>
          <h2 style={styles.title}>Class Performance Overview</h2>
          <div style={styles.grid}>
            <div style={styles.item}>
              <h3 style={styles.itemTitle}>High Risk</h3>
              <p style={styles.highRisk}>
                {getClassPerformanceOverview().highRiskCount}
              </p>
            </div>
            <div style={styles.item}>
              <h3 style={styles.itemTitle}>Medium Risk</h3>
              <p style={styles.mediumRisk}>
                {getClassPerformanceOverview().mediumRiskCount}
              </p>
            </div>
            <div style={styles.item}>
              <h3 style={styles.itemTitle}>Low Risk</h3>
              <p style={styles.lowRisk}>
                {getClassPerformanceOverview().lowRiskCount}
              </p>
            </div>
          </div>
          <p style={styles.averageScore}>
            Average Score:{' '}
            {getClassPerformanceOverview().averageScore.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Student Risk Dashboard */}
      <div style={styles.container}>
        <div>
          <h2 style={styles.title}>Student Risk Dashboard</h2>
          <ul style={styles.studentList}>
            {students.map((student) => (
              <li
                key={student.name}
                style={{
                  ...styles.studentItem,
                  ':hover': styles.studentItemHover,
                }}
              >
                <div>
                  <h3 style={styles.studentName}>{student.name}</h3>
                  <p style={styles.studentDetail}>
                    Average Score:{' '}
                    {calculateAverageScore(student.scores).toFixed(2)}%
                  </p>
                  <p style={styles.studentDetail}>
                    Attendance:{' '}
                    {attendance[student.name].filter(Boolean).length}/
                    {attendance[student.name].length}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      ...styles.riskTag,
                      ...(calculateRiskFactor(
                        calculateAverageScore(student.scores)
                      ) === 1
                        ? styles.highRiskTag
                        : calculateRiskFactor(
                            calculateAverageScore(student.scores)
                          ) === 0.5
                        ? styles.mediumRiskTag
                        : styles.lowRiskTag),
                    }}
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
      <div style={styles.container}>
        <div>
          <h2 style={styles.title}>Early Intervention Alerts</h2>
          <ul style={styles.studentList}>
            {students
              .filter(
                (student) =>
                  calculateRiskFactor(calculateAverageScore(student.scores)) ===
                  1
              )
              .map((student) => (
                <li
                  key={student.name}
                  style={{
                    ...styles.studentItem,
                    borderLeft: '4px solid #e53e3e',
                  }}
                >
                  <div>
                    <h3 style={styles.studentName}>{student.name}</h3>
                    <p style={styles.studentDetail}>
                      Average Score:{' '}
                      {calculateAverageScore(student.scores).toFixed(2)}%
                    </p>
                    <p style={styles.studentDetail}>
                      Attendance:{' '}
                      {attendance[student.name].filter(Boolean).length}/
                      {attendance[student.name].length}
                    </p>
                  </div>
                  <button
                    style={{ ...styles.button, ':hover': styles.buttonHover }}
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
      <div style={styles.container}>
        <div>
          <h2 style={styles.title}>Communication Tools</h2>
          <textarea
            style={styles.textArea}
            placeholder="Enter your message..."
          ></textarea>
          <button
            style={{
              ...styles.messageButton,
              ':hover': styles.messageButtonHover,
            }}
            onClick={() => sendNotification('Message sent to students')}
          >
            Send Message
          </button>
          <div style={{ marginTop: '1rem' }}>
            <h3 style={styles.itemTitle}>Notifications</h3>
            <ul style={styles.notificationList}>
              {notifications.map((notification, index) => (
                <li key={index} style={styles.notificationItem}>
                  <p style={styles.studentDetail}>{notification}</p>
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
