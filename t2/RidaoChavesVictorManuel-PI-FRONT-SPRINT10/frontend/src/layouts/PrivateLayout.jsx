import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AIAssistant from '../components/AIAssistant';

const PrivateLayout = ({ children }) => {
    return (
        <div className="private-layout">
            <Header />
            <Navigation />
            {children}
            <Footer />
            <AIAssistant />
        </div>
    );
};

export default PrivateLayout;
