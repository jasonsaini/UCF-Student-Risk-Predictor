import React, { useState } from 'react';
import './Popup.css';
import youtube from "../Popup/imgs/youtube.png"
const Popup = () => {
  const [activeTab, setActiveTab] = useState('assignments');


  const imgs = { youtube }

  return (
    <body className="bg-gray-100">
      <div className="text-center text-2xl font-semibold text-gray-700 py-4">
        Risk Predictor
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
              <span className='text-sm font-bold text-red-600'>43%</span>
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
              <span className='text-sm font-bold text-red-600'><a href="https://youtube.com" target='_blank'><img className='h-8 w-9' src={youtube} alt="youtube-logo" /></a></span>
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
