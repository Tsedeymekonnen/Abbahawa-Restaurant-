import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import './App.css';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Logout from "./pages/Logout";
import Dashboard from "./components/Dashboard";
import Orders from './pages/Orders';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />  
          <Route path="/menu" element={<Menu />} />
          <Route path='/Signup' element={<SignUp/>}/> 
          <Route path='Signin' element={<SignIn/>}/>
          <Route path="/Logout" element={<Logout />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/Orders/" element={<Orders />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;