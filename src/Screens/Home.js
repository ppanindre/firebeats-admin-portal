// src/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h2>Welcome to the Landing Page</h2>
    <p>Choose an action:</p>
    <div>
      <Link to="/notification-approval">
        <button>Approve Notification</button>
      </Link>
      <Link to="/test-models">
        <button>Test Models</button>
      </Link>
    </div>
  </div>
);

export default Home;
