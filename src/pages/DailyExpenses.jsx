import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { expensesAction } from '../store/expense';

const DailyExpenses = () => {
  const [moneySpent, setMoneySpent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentExpenseId, setCurrentExpenseId] = useState(null);
  const categories = ['Food', 'Petrol', 'Salary', 'Entertainment', 'Other'];
  const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

  const dispatch = useDispatch();
  const expense = useSelector((state) => state.expense);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`${DATABASE_URL}/expenses.json`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const expensesArray = data ? Object.entries(data).map(([id, exp]) => ({ id, ...exp })) : [];
        dispatch(expensesAction.setExpenses({ expenses: expensesArray, totalAmount: 0 }));
      } catch (error) {
        alert('Error fetching expenses: ' + error.message);
      }
    };

    fetchExpenses();
  }, [dispatch, DATABASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (moneySpent && description && category) {
      const expenseData = {
        moneySpent: Number(moneySpent),
        description,
        category,
      };

      if (isEditing) {
        try {
          const response = await fetch(`${DATABASE_URL}/expenses/${currentExpenseId}.json`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
          });

          if (!response.ok) {
            throw new Error('Failed to update expense');
          }

          dispatch(expensesAction.updateExpense({ id: currentExpenseId, ...expenseData }));
          setIsEditing(false);
          setCurrentExpenseId(null);
        } catch (error) {
          alert('Error updating expense: ' + error.message);
        }
      } else {
        try {
          const response = await fetch(`${DATABASE_URL}/expenses.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const result = await response.json();
          const newExpense = { id: result.name, ...expenseData };
          dispatch(expensesAction.addExpense(newExpense));
        } catch (error) {
          alert('Error adding expense: ' + error.message);
        }
      }

      setMoneySpent('');
      setDescription('');
      setCategory('');
    } else {
      alert('Please fill out all fields');
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      const response = await fetch(`${DATABASE_URL}/expenses/${expenseId}.json`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      dispatch(expensesAction.deleteExpense(expenseId));
    } catch (error) {
      alert('Error deleting expense: ' + error.message);
    }
  };

  const handleEdit = (expense) => {
    setMoneySpent(expense.moneySpent);
    setDescription(expense.description);
    setCategory(expense.category);
    setCurrentExpenseId(expense.id);
    setIsEditing(true);
  };

  return (
    <div style={styles.container}>
      <h2>Daily Expenses</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          placeholder="Money Spent"
          value={moneySpent}
          onChange={(e) => setMoneySpent(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.input}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          <option value="" disabled>Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>

      <div style={styles.expensesList}>
        {expense.expenses.length > 0 ? (
          <ul>
            {expense.expenses.map((exp) => (
              <li key={exp.id} style={styles.expenseItem}>
                {exp.moneySpent} - {exp.description} ({exp.category})
                <button
                  style={styles.editButton}
                  onClick={() => handleEdit(exp)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDelete(exp.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No expenses added yet</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  select: {
    marginBottom: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  expensesList: {
    marginTop: '20px',
  },
  expenseItem: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  editButton: {
    marginRight: '10px',
    padding: '5px 10px',
    backgroundColor: '#ffc107',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default DailyExpenses;
