import React from 'react';
import LoginForm from '../components/LoginForm';

import "./css/Global_Styling.css";
import './css/Login_Signup_Styling.css';

const LoginPage = ({ setIsAuthenticated }) => {
    return (
        <div className="login-page">
            <h1>Login</h1>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
