import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCompleteProfile = () => {
    navigate('/complete-profile');
  };

  return (
    <div style={styles.container}>
      <h1>Welcome to Expense Tracker</h1>
      Your Profile is incomplete. Please complete your profile to continue.
      <button style={styles.button} onClick={handleCompleteProfile}>
        Complete Now
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
    fontSize: '24px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Home;
