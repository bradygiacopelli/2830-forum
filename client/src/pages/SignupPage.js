import React from 'react';
import SignupForm from '../components/SignupForm';
import '../styles/SignupPage.css';

const SignupPage = () => {
    return (
        <div className="signup-page">
            <img src="/image.png" alt="Scrollspace Logo" className="login-logo" />
            <SignupForm />
        </div>
    );
};

export default SignupPage;
