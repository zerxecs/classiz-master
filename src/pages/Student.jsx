import React, { useState } from "react";
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Instructor.css'; 
import { Icon } from '@iconify/react';
import homeIcon from '@iconify/icons-heroicons/home-solid';
import classesIcon from '@iconify/icons-icomoon-free/books';
import createClassIcon from '@iconify/icons-ic/baseline-create-new-folder';
import createActivityIcon from '@iconify/icons-mdi/pencil-plus';
import quizzesIcon from '@iconify/icons-material-symbols/library-books';
import examsIcon from '@iconify/icons-healthicons/i-exam-multiple-choice';
import logoutIcon from '@iconify/icons-fluent/person-12-filled';
import helpIcon from '@iconify/icons-fluent/settings-24-filled';
import searchIcon from '@iconify/icons-material-symbols/search';

import Home from './student/Home';
import Classes from './student/Classes';
import CreateClass from './student/CreateClass';
import CreateActivity from './student/CreateActivity';
import Quizzes from './student/Quizzes';
import Exams from './student/Exams';
import Logout from './student/Logout';
import HelpSupport from './student/HelpSupport';

// Sidebar Component
const Sidebar = ({ setContent, setShowPrivate }) => {
  const [isPrivate, setIsPrivate] = useState(true); // Default to showing private classes

  const handleToggleChange = () => {
    setIsPrivate(!isPrivate);
    setShowPrivate(!isPrivate); // Pass the new state to the parent
  };

  return (
    <div id="sidebar" className="d-flex flex-column flex-shrink-0 p-3 bg-light sidebar">
      <p className="navbar-brand classiz">
        class<span style={{ color: '#BA68C8' }}>iz.</span>
      </p>
      
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item"><h6 className="nav-header">Menu</h6></li>
        <li className="nav-item">
          <a href="#" className="nav-link active" onClick={() => setContent("Home")}>
            <Icon icon={homeIcon} /> Home
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Classes")}>
            <Icon icon={classesIcon} /> Classes
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Create Class")}>
            <Icon icon={createClassIcon} /> Create Class
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Create Activity")}>
            <Icon icon={createActivityIcon} /> Create Activity
          </a>
        </li>
        <li className="nav-item">
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="classTypeToggle"
              checked={isPrivate}
              onChange={handleToggleChange}
            />
            <label className="form-check-label" htmlFor="classTypeToggle">
              {isPrivate ? 'Show Private Classes' : 'Show Public Classes'}
            </label>
          </div>
        </li>
        <li className="nav-item"><h6 className="nav-header">Assessment</h6></li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Quizzes")}>
            <Icon icon={quizzesIcon} /> Quizzes
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Exams")}>
            <Icon icon={examsIcon} /> Exams
          </a>
        </li>
        <li className="nav-item"><h6 className="nav-header">User</h6></li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Logout")}>
            <Icon icon={logoutIcon} /> Logout
          </a>
        </li>
        <li className="nav-item">
          <a href="#" className="nav-link" onClick={() => setContent("Help & Support")}>
            <Icon icon={helpIcon} /> Help & Support
          </a>
        </li>
      </ul>

      <div className="input-group mb-3">
        <input 
          type="text" 
          placeholder="   Search" 
          className="form-control" 
          onChange={(e) => setContent(`Search Results for "${e.target.value}"`)} 
        />
        <span className="input-group-text">
          <Icon icon={searchIcon} />
        </span>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  setContent: PropTypes.func.isRequired,
  setShowPrivate: PropTypes.func.isRequired, // Add this prop
};

const Content = ({ content, classes, addClass, setContent, showPrivate }) => {
  switch(content) {
    case "Home":
      return <Home classes={classes} onCardClick={(classItem) => console.log(classItem)} setContent={setContent} />;
    case "Classes":
      return <Classes classes={classes} showPrivate={showPrivate} />; // Pass showPrivate prop
    case "Create Class":
      return <CreateClass addClass={addClass} />;
    case "Create Activity":
      return <CreateActivity />;
    case "Quizzes":
      return <Quizzes />;
    case "Exams":
      return <Exams />;
    case "Logout":
      return <Logout />;
    case "Help & Support":
      return <HelpSupport />;
    default:
      return <div>{content}</div>;
  }
};

Content.propTypes = {
  content: PropTypes.string.isRequired,
  classes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      enrollment: PropTypes.number.isRequired,
    })
  ).isRequired,
  addClass: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
  showPrivate: PropTypes.bool.isRequired, // Add this prop
};

const App = () => {
  const [content, setContent] = useState("Home");
  const [classes, setClasses] = useState([]);
  const [showPrivate, setShowPrivate] = useState(true); // State to track if private classes should be shown

  const addClass = (newClass) => {
    setClasses([...classes, newClass]);
  };

  return (
    <div className="d-flex" style={{ height: '100vh' }}>
      <Sidebar setContent={setContent} setShowPrivate={setShowPrivate} /> {/* Pass the setter function */}
      <div className="main-content flex-grow-1">
        <Content content={content} classes={classes} addClass={addClass} setContent={setContent} showPrivate={showPrivate} /> {/* Pass the showPrivate state */}
      </div>
    </div>
  );
};

export default App;
