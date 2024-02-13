import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./containers/Home/Home";
import Admin from "./containers/Admin/Admin"; // 确保路径正确
// 如果您在页面上使用logo，确保以下import保留

function App() {
  return (
    <Router>
      <div className="App">
        <Routes> {/* 使用Routes代替Switch */}
          <Route path="/" element={<Home />} exact /> {/* 使用element属性指定组件 */}
          <Route path="/admin" element={<Admin />} />
          {/* 可以根据需要添加更多的路由 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
