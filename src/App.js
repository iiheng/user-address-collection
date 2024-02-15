import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./containers/Home/Home";
import Admin from "./containers/Admin/Admin"; // 确保路径正确
// 如果您在页面上使用logo，确保以下import保留

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
