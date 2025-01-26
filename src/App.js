import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import './styles/fonts.css';
import StartScreen from './screens/StartScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

function App() {
  const [department, setDepartment] = useState("");
  const [similarity, setSimilarity] = useState(0);

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
          element={<ResultScreen department={department} similarity={similarity} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
