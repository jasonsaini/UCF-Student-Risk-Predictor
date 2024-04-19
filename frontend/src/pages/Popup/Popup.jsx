import React, { useState } from 'react';
import './Popup.css';
import youtube from '../Popup/imgs/youtube.png';
import StudentView from './Studentview';
import InstructorView from './InstructorView';
const Popup = () => {

  const myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer 7~qgjCewHFGcI25c2nfC4C7WsHZFqMiPcOyzT2SgcCxA0xcm6PvJRMKdwLr5iRMcaD");
  myHeaders.append("Cookie", "_csrf_token=E92j7dJYyWJC%2B1c76fzV%2BB9Gx1apfx1MgEoPRrZYRr50jJC74SinBjfJE1arz6OdUW3zJscvUiCzZUEM8xIs8A%3D%3D; _legacy_normandy_session=hWYkcDI52hz7WxTktAnWyA.-I-h_fm_Chw7ZbiGjANpdM-hXwR0yhZODLcm78e8iz1GoDTQUE_aNMhUbpbshIPWzV6vCOAIAmVacxFTh7MIZNkXLEXpyiqhfSPLdg7BtIQByX9-A1hz2jf_5XZuSlNF.fiy-CqkiEbv3VawUafy05I9mc7o.Zfzt7Q; canvas_session=hWYkcDI52hz7WxTktAnWyA.-I-h_fm_Chw7ZbiGjANpdM-hXwR0yhZODLcm78e8iz1GoDTQUE_aNMhUbpbshIPWzV6vCOAIAmVacxFTh7MIZNkXLEXpyiqhfSPLdg7BtIQByX9-A1hz2jf_5XZuSlNF.fiy-CqkiEbv3VawUafy05I9mc7o.Zfzt7Q; log_session_id=417d68957a9507a555430e469bf82e4a");

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };

  fetch("https://canvas.instructure.com/api/v1/courses/8660249/quizzes/17522683/submissions", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));



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
