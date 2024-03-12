import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  return (
    <div className="task-container">
      <div className="header">
        <h1>Tasks</h1>
        <div className="date-range">Mar 4 to Mar 11</div>
      </div>
      <div className="progress">
        <div className="progress-circle">
          <span>0%</span>
          <span>0/4 Complete</span>
        </div>
      </div>
      <div className="task-list">
        {/* Task Section */}
        <div className="task-section">
          <h2>due 2 days</h2>
          <div className="task" data-points={4}>
            <span className="task-title">Practice Exam</span>
            <span className="due-date">Due Mar 7 at 11:59 PM</span>
          </div>
          <div className="task" data-points={11}>
            <span className="task-title">Honor Code</span>
            <span className="due-date">Due Mar 7 at 11:59 PM</span>
          </div>
          <div className="task" data-points={100}>
            <span className="task-title">Homework Assignment 3</span>
            <span className="due-date">Due Mar 7 at 11:59 PM</span>
          </div>
        </div>
        {/* Another Task Section */}
        <div className="task-section">
          <h2>due 3 days</h2>
          <div className="task" data-points={5}>
            <span className="task-title">Journal - Week 4</span>
            <span className="due-date">Due Mar 8 at 11:59 PM</span>
          </div>
        </div>
      </div>
      <div className="add-task-button">
        <button>+ New Task</button>
      </div>
    </div>

  );
};

export default Popup;
