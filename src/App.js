// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import Home from './Screens/Home';
import NotificationApproval from './Screens/NotificationApproval';
import TestModels from './Screens/TestModels';



const firebaseConfig = {
  apiKey: "AIzaSyAmjLsb5swRa1dDc5k9u8wrDjKhnAnaa6E",
  authDomain: "firebeats-43aaf.firebaseapp.com",
  databaseURL: "https://firebeats-43aaf-default-rtdb.firebaseio.com",
  projectId: "firebeats-43aaf",
  storageBucket: "firebeats-43aaf.appspot.com",
  messagingSenderId: "159173208911",
  appId: "1:159173208911:web:8d3f2a16d53392d685333a",
  measurementId: "G-ES44NPK01P"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const defaultLocale = 'en';


const App = () => (


  // You can add logic here to dynamically determine the user's preferred locale
  // and update the `locale` variable accordingly



  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/notification-approval">Notification Approval</Link>
          </li>
          <li>
            <Link to="/test-models">Test Models</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/notification-approval" element={<NotificationApproval />} />
        <Route path="/test-models" element={<TestModels />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  </Router>
);

export { firebaseApp, db };
export default App;