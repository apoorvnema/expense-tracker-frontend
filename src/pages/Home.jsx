import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/UI/Loader';
import DailyExpenses from './DailyExpenses';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../store/auth';
import { exportToCSV } from '../utils/exportToCSV';
import expense, { expensesAction } from '../store/expense';
import { themeActions } from '../store/theme';

const Home = () => {
    const navigate = useNavigate();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const expense = useSelector((state) => state.expense.expenses);
    const premiumActive = useSelector((state) => state.expense.premiumActive)
    const premiumPurchase = useSelector((state) => state.expense.premiumPurchase)
    const dispatch = useDispatch();

    useEffect(() => {
        const checkEmailVerification = async () => {
            const idToken = localStorage.getItem('token');
            const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

            try {
                setLoading(true);
                const response = await fetch(
                    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${API_KEY}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ idToken }),
                    }
                );

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                const user = result.users[0];
                setFullName(user.displayName || '');
                setPhotoURL(user.photoUrl || '');
                setIsEmailVerified(user.emailVerified || false);
                setIsProfileComplete(Boolean(user.displayName && user.photoUrl));
            } catch (error) {
                alert('Error fetching profile data: ' + (error.message || 'Something went wrong'));
            }
            setLoading(false);
        };

        checkEmailVerification();
    }, []);

    const handleCompleteProfile = () => {
        navigate('/complete-profile', { state: { fullName, photoURL } });
    };

    const handleVerifyEmail = async () => {
        const idToken = localStorage.getItem('token');
        const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;

        try {
            setLoading(true);
            const response = await fetch(
                `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestType: 'VERIFY_EMAIL',
                        idToken: idToken,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('Check your email. You might have received a verification link. Click on it to verify.');
        } catch (error) {
            let errorMessage = 'Something went wrong';
            switch (error.message) {
                case 'INVALID_ID_TOKEN':
                    errorMessage = 'The provided ID token is invalid.';
                    break;
                case 'USER_NOT_FOUND':
                    errorMessage = 'No user record found for the provided ID token.';
                    break;
                case 'MISSING_ID_TOKEN':
                    errorMessage = 'The request is missing an ID token.';
                    break;
                default:
                    errorMessage = error.message || 'An unknown error occurred.';
            }
            alert('Error sending verification email: ' + errorMessage);
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        dispatch(authActions.logout());
        navigate('/login');
    };

    const handleDownload = () => {
        const csvData = exportToCSV(expense);
        const link = document.createElement('a');
        link.href = csvData;
        link.download = 'expenses.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePremiumPurchase = () => {
        dispatch(expensesAction.activatePremium());
    };

    const handleDarkMode = () => {
        dispatch(themeActions.toggleTheme())
    };

    return (
        <div style={styles.container}>
            {loading && <Loader />}
            <nav style={styles.navbar}>
                <h1 style={styles.expenseHeading}>Expense Tracker</h1>
                <div style={styles.navItems}>
                    {premiumActive && !premiumPurchase && <button style={styles.premiumButton} onClick={handlePremiumPurchase}>
                        Activate Premium
                    </button>}
                    {premiumActive && premiumPurchase && (<button style={styles.darkMode} onClick={handleDarkMode}>
                        Dark Mode
                    </button>)}
                    {premiumActive && premiumPurchase && (
                        <button style={styles.downloadButton} onClick={handleDownload}>
                            Download Expenses
                        </button>
                    )}
                    <button style={styles.logoutButton} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </nav>

            {isProfileComplete ? (
                isEmailVerified ? <DailyExpenses /> : <p>Your profile is complete but your email is not verified. Please verify your email to continue.</p>
            ) : (
                <p>Your profile is incomplete. Please complete your profile to continue.</p>
            )}

            {!isProfileComplete && (
                <button style={styles.button} onClick={handleCompleteProfile}>
                    Complete Profile
                </button>
            )}

            {!isEmailVerified && (
                <button style={styles.button} onClick={handleVerifyEmail}>
                    Verify Email ID
                </button>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontSize: '24px',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '10px 0px',
        backgroundColor: '#343a40',
        color: '#fff',
        position: 'sticky',
        top: 0,
    },
    expenseHeading: {
        fontSize: '24px',
        color: '#fff',
    },
    navItems: {
        display: 'flex',
        gap: '10px',
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
    darkMode: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#343a40',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    downloadButton: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    logoutButton: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#dc3545',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    premiumButton: {
        padding: '10px 20px',
        fontSize: '16px',
        color: '#fff',
        backgroundColor: '#28a745',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default Home;
