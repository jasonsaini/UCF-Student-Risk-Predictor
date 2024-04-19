import React, { useState } from 'react';
import './Popup.css';
import youtube from "../Popup/imgs/youtube.png"
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


  const imgs = { youtube }


  const assignments = [
    { name: 'COT 4210 -- Homework 3', score: 77 },
    { name: 'COP 4934 - Journal Week 5', score: 33 },
    // Add more assignments as needed
  ];

  // Calculate average score to determine risk
  const averageScore =
    assignments.reduce((acc, assignment) => acc + assignment.score, 0) / assignments.length;

  // Risk factor, simple logic where below 50% is high risk
  const riskFactor = averageScore < 50 ? 1 : averageScore < 70 ? 0.5 : 0;

  // Define the risk meter color based on the risk factor
  const riskMeterColor =
    riskFactor === 1 ? 'bg-red-600' : riskFactor === 0.5 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <body className="bg-gray-100">
      <div className="text-center text-2xl font-semibold text-gray-700 py-4">
        Risk Predictor
      </div>

      {/* Risk Meter */}
      <div className="max-w-2xl mx-auto my-4">
        <div className="w-full bg-gray-300 rounded-full h-4">
          <div
            className={`h-4 rounded-full transition-all duration-300 ease-in-out ${riskMeterColor}`}
            style={{ width: `${(1 - riskFactor) * 100}%` }}
          ></div>
        </div>
        <p className="text-center text-sm font-medium mt-1">
          Risk of Failing: {riskFactor === 1 ? 'High' : riskFactor === 0.5 ? 'Medium' : 'Low'}
        </p>
      </div>




      <div className="flex justify-center gap-4 my-4">
        <button
          className={`text-md px-4 py-2 border rounded ${activeTab === 'assignments' ? 'bg-blue-600 text-white' : 'bg-white border-gray-300 text-gray-600'
            } hover:bg-blue-700 focus:outline-none`}
          onClick={() => setActiveTab('assignments')}
        >
          Assignments
        </button>
        <button
          className={`text-md px-4 py-2 border rounded ${activeTab === 'videos' ? 'bg-blue-600 text-white' : 'bg-white border-gray-300 text-gray-600'
            } hover:bg-blue-700 focus:outline-none`}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
      </div>

      {activeTab === 'assignments' && (
        <div className="max-w-2xl mx-auto ">
          <ul className="space-y-2  ">
            <li className='flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 border-blue-500 rounded hover:bg-blue-200 transition-colors duration-150 ease-in-out'>
              <span className="font-medium text-gray-700">COT 4210 -- Homework 3</span>
              <span className='text-sm font-bold text-red-600'> 44%</span>
            </li>
            <li className='flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 border-blue-500 rounded hover:bg-blue-200 transition-colors duration-150 ease-in-out'>
              <span className="font-medium text-gray-700">COP 4934 - Journal Week 5</span>
              <span className='text-sm font-bold text-red-600'>18%</span>
            </li>

            {/* Repeat for other list items */}
          </ul>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="max-w-2xl mx-auto">
          {/* Video-specific content here */}
          <ul className="space-y-2  ">
            <li className='flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 border-blue-500 rounded hover:bg-blue-200 transition-colors duration-150 ease-in-out'>
              <span className="font-medium text-gray-700">COT 4210 -- Homework 3</span>
              <span className='text-sm font-bold text-red-600'><a href="https://youtube.com" target='_blank'><img className='h-6 w-9' src={youtube} alt="youtube-logo" /></a></span>
            </li>
            <li className='flex justify-between items-center bg-white shadow-sm px-4 py-3 border-l-4 border-blue-500 rounded hover:bg-blue-200 transition-colors duration-150 ease-in-out'>
              <span className="font-medium text-gray-700">COP 4934 - Journal Week 5</span>
              <span className='text-sm font-bold text-red-600'><a href="https://youtube.com" target='_blank'><img className='h-6 w-9' src={youtube} alt="youtube-logo" /></a></span>
            </li>

            {/* Repeat for other list items */}
          </ul>
          {/* Use similar styling for videos as assignments */}
        </div>
      )}
    </body>
  );
};

export default Popup;
