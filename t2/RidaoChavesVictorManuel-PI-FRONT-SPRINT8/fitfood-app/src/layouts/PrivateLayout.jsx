import React from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const PrivateLayout = ({ children }) => {
    return (
        <div className="private-layout">
            <Header />
            <Navigation />
            {children}
            <Footer />
        </div>
    );
};

export default PrivateLayout;
