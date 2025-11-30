import React, { createContext, useReducer } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/navbar';
import Home from './Components/Home';
import About from './Components/About';
import Logout from './Components/Logout';
import './App.css';

export const context = createContext();

const Routing = () => {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Forgot route removed – handled inside Login modal now */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  const reducer = (state, action) => {
    if (action.type === 'USER') {
      return action.payload;
    }
    return state;
  };

  const [state, dispatch] = useReducer(reducer, true);

  return (
    <context.Provider value={{ state, dispatch }}>
      <Routing />
    </context.Provider>
  );
};

export default App;