import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login_Styling.css';

const LoginPage = ({ setIsAuthenticated }) => {
    return (
        <div className="login-page">
            <LoginForm />
        </div>
    );
};

export default LoginPage;
