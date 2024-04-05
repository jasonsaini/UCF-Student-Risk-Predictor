import React, { useState } from 'react';
import './Popup.css';
import youtube from '../Popup/imgs/youtube.png';
import StudentView from './Studentview';
import InstructorView from './InstructorView';
const Popup = () => {
  const [activeTab, setActiveTab] = useState('assignments');

  const [userRole, setUserRole] = useState('student'); // Example: set this based on authenticated user role

  const imgs = { youtube };

  const assignments = [
    { name: 'COT 4210 -- Homework 3', score: 77 },
    { name: 'COP 4934 - Journal Week 5', score: 33 },
  ];

  // Calculate average score to determine risk
  const averageScore =
    assignments.reduce((acc, assignment) => acc + assignment.score, 0) /
    assignments.length;

  // Risk factor, simple logic where below 50% is high risk
  const riskFactor = averageScore < 50 ? 1 : averageScore < 70 ? 0.5 : 0;

  const students = [{ name: 'Student One', assignments: assignments }];

  // Define the risk meter color based on the risk factor
  const riskMeterColor =
    riskFactor === 1
      ? 'bg-red-600'
      : riskFactor === 0.5
      ? 'bg-yellow-500'
      : 'bg-green-500';

  return (
    <div>
      {userRole === 'student' ? (
        <StudentView assignments={assignments} />
      ) : (
        <InstructorView students={students} />
      )}
    </div>
  );
};

export default Popup;
