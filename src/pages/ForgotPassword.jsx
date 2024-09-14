import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../components/UI/Loader';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

    const handleResetPassword = async () => {

        if (!email) {
            alert('Email is mandatory.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestType: 'PASSWORD_RESET',
                    email,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Check your email for the password reset link.');
            } else {
                alert(data.error.message || 'Failed to send password reset email.');
            }
        } catch (err) {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            {loading && <Loader />}
            <div style={styles.card}>
                <h2 style={styles.header}>Forgot Password</h2>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                />
                <button
                    onClick={handleResetPassword}
                    style={styles.button}
                    disabled={loading}
                >
                    {loading ? 'Sending...' : 'Send Password Reset Email'}
                </button>
                <p style={styles.backToLogin}>
                    <Link to="/login" style={styles.backToLoginLink}>Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f4f4',
    },
    card: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        width: '300px',
    },
    header: {
        marginBottom: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px',
    },
    error: {
        color: 'red',
    },
    success: {
        color: 'green',
    },
    backToLogin: {
        fontSize: '14px',
        color: '#888',
    },
    backToLoginLink: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default ForgotPassword;
