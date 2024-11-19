import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ setIsAuthenticated }) => {
    return (
        <div>
            <LoginForm setIsAuthenticated={setIsAuthenticated} />
        </div>
    );
};

export default LoginPage;
