import React from 'react';
import SignupForm from '../components/SignupForm';

import "./css/Global_Styling.css";
import './css/Login_Signup_Styling.css';

const SignupPage = () => {
    return (
        <div className='login-page'>
            <h1>Sign Up</h1>
            <SignupForm />
        </div>
    );
};

export default SignupPage;
