import React, { useState, useEffect } from 'react';

const Profile = () => {
  const [fullName, setFullName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

  useEffect(() => {
    const fetchUserProfile = async () => {
      const idToken = localStorage.getItem('token');

      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: idToken,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const user = result.users[0];
        setFullName(user.displayName || '');
        setPhotoURL(user.photoUrl || '');
      } catch (error) {
        alert('Error fetching profile data: ' + (error.message || 'Something went wrong'));
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async () => {
    const idToken = localStorage.getItem('token');

    try {
      const response = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idToken: idToken,
            displayName: fullName,
            photoUrl: photoURL,
            returnSecureToken: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + (error.message || 'Something went wrong'));
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        style={styles.input}
      />
      <input
        type="text"
        placeholder="Profile Photo URL"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleUpdateProfile} style={styles.button}>
        Update Profile
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  input: {
    margin: '10px',
    padding: '10px',
    width: '300px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    marginTop: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Profile;
