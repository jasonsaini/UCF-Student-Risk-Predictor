import React, { useState } from 'react';
import './Popup.css';
// Note: You typically cannot import HTML files like this in React. Consider serving it separately or integrating its content into your React app differently.

const Popup = () => {
  // State to track the active tab ('assignments' or 'videos')
  const [activeTab, setActiveTab] = useState('assignments');
  

  return (
    <body>
       <div>
        <div className='text-center text-3xl font-bold'>Risk Predictor</div>
       </div>
      

      {/* Tab Buttons */}
      <div>
        <button className='text-md px-8 text-center border-solid bg-gray-300 hover:bg-gray-400' id='assignment' onClick={() => setActiveTab('assignments')} >Assignments</button>
        <button
          className='text-md px-8 text-center border-solid bg-gray-300 hover:bg-gray-400'
          id='video'
          onClick={() => setActiveTab('videos')} // Set active tab to 'videos'
        >
          Videos
        </button>
      </div>
      


      <br />

    
      <div>
        {activeTab === 'assignments' && (
          <div className="task-section">
            {/* Assignment-specific content here */}


              

            {/* Include your assignment tasks here */}
          </div>
        )}
        {activeTab === 'videos' && (
          <div className="video-section">
            {/* Video-specific content here */}
            <div className="collapse collapse-plus bg-base-200 bg-orange-400">
              <input type="radio" name="my-accordion-3" defaultChecked /> 
              <div className="collapse-title text-lg font-bold">
                COP4210 
              </div>
              <div className="collapse-content"> 
                <li className='text-lg underline'><a href="https://www.youtube.com/watch?v=XISnO2YhnsY" target='_blank'>CS-50</a></li>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 bg-orange-400">
              <input type="radio" name="my-accordion-3" /> 
              <div className="collapse-title text-lg font-bold">
                COP4533
              </div>
              <div className="collapse-content"> 
                <li className='text-lg underline'><a href="https://www.youtube.com/watch?v=XISnO2YhnsY" target='_blank'>CS-50</a></li>
              </div>
            </div>
            <div className="collapse collapse-plus bg-base-200 bg-orange-400">
              <input type="radio" name="my-accordion-3" /> 
              <div className="collapse-title text-lg font-bold">
                COP4934
              </div>
              <div className="collapse-content"> 
                <li className='text-lg underline'><a href="https://www.youtube.com/watch?v=XISnO2YhnsY" target='_blank'>CS-50</a></li>

              </div>
            </div>
            {/* Include your video tasks here */}
          </div>
        )}
      </div>
      </body>


    
  );
};

export default Popup;
