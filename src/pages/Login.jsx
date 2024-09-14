import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/UI/Loader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

  useEffect(() => {
    if (error.trim() !== '') {
      alert(error);
    }
  }, [error]);

  const handleLogin = async () => {
    setError('');

    if (!email || !password) {
      setError('All fields are mandatory.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.idToken);
        console.log('User has successfully logged in.');

        navigate('/expense-tracker');
      } else {
        setError(data.error.message || 'Login failed.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div style={styles.container}>
      {loading && <Loader />}
      <div style={styles.card}>
        <h2 style={styles.header}>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button
          onClick={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={styles.loginText}>
          Don't have an account? <a href="/signup" style={styles.signupLink}>Sign Up</a>
        </p>
        <p style={styles.forgotPasswordText}>
          <a href="#" onClick={handleForgotPassword} style={styles.forgotPasswordLink}>Forgot Password?</a>
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
  loginText: {
    fontSize: '14px',
    color: '#888',
  },
  signupLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
  forgotPasswordText: {
    fontSize: '14px',
    color: '#888',
    marginTop: '10px',
  },
  forgotPasswordLink: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;
