import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/fonts.css';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';
import PreventBack from './components/PreventBack';

function App() {
  const [department, setDepartment] = useState(() => {
    return localStorage.getItem("department") || "";
  });

  useEffect(() => {
    localStorage.setItem("department", department);
  }, [department]);

  return (
    <Router>
      <PreventBack />
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
