import React, { useState } from 'react';

const DailyExpenses = () => {
  const [moneySpent, setMoneySpent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expenses, setExpenses] = useState([]);

  const categories = ['Food', 'Petrol', 'Salary', 'Entertainment', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (moneySpent && description && category) {
      const newExpense = {
        moneySpent,
        description,
        category,
        id: Date.now(),
      };
      setExpenses([...expenses, newExpense]);
      setMoneySpent('');
      setDescription('');
      setCategory('');
    } else {
      alert('Please fill out all fields');
    }
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
        <button type="submit" style={styles.button}>Add Expense</button>
      </form>
      <div style={styles.expensesList}>
        {expenses.length > 0 ? (
          <ul>
            {expenses.map(exp => (
              <li key={exp.id} style={styles.expenseItem}>
                {exp.moneySpent} - {exp.description} ({exp.category})
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
  },
};

export default DailyExpenses;
