import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import StartScreen from './screens/StartScreen';
import DivideScreen from './screens/DivideScreen';
import MakeScreen from './screens/MakeScreen';
import ResultScreen from './screens/ResultScreen';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<StartScreen />} />
        <Route path='/divide' element={<DivideScreen />} />
        <Route path='/make' element={<MakeScreen />} />
        <Route path='/result' element={<ResultScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
