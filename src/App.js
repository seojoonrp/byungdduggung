import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom'; // HashRouter 사용

import './styles/fonts.css';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

function App() {
  const [department, setDepartment] = useState(() => {
    return localStorage.getItem("department") || "";
  });

  useEffect(() => {
    localStorage.setItem("department", department);
  }, [department]);

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={<StartScreen department={department} setDepartment={setDepartment} />}
        />
        <Route path='/game' element={<GameScreen />} />
        <Route
          path='/result'
          element={<ResultScreen department={department} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
