import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1>Welcome to Expense Tracker</h1>
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
    fontSize: '24px',
  },
};

export default Home;
