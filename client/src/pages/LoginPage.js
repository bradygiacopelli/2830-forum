import React from 'react';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css'

const LoginPage = ({ setIsAuthenticated }) => {
    return (
        <div className='login-page'>
            <img src="/image.png" alt="Scrollspace Logo" className="login-logo" />
            <LoginForm setIsAuthenticated={setIsAuthenticated} />
        </div>
    );
};

export default LoginPage;
