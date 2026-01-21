import React from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Navigation />
      <Login />
      <Footer />
    </div>
  );
}

export default App;
