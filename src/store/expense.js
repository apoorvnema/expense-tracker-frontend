import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  totalAmount: 0,
  premiumActive: false,
  premiumPurchase: false,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense(state, action) {
      state.expenses.push(action.payload);
      state.totalAmount += action.payload.moneySpent;

      if (state.totalAmount >= 10000) {
        state.premiumActive = true;
      }
    },
    setExpenses(state, action) {
      state.expenses = action.payload.expenses;
    },
    setSummary(state, action) {
      state.totalAmount = action.payload.totalAmount;
      state.premiumPurchase = action.payload.premiumPurchase;
      state.premiumActive = action.payload.premiumActive;

      if (state.totalAmount >= 10000) {
        state.premiumActive = true;
      }
    },
    activatePremium(state) {
      state.premiumPurchase = true;
    },
    deleteExpense(state, action) {
      const deletedExpense = state.expenses.find(
        (expense) => expense.id === action.payload
      );
      if (deletedExpense) {
        state.totalAmount -= deletedExpense.moneySpent;
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload
        );
      }
    },
    updateExpense(state, action) {
      const updatedExpense = action.payload;
      const index = state.expenses.findIndex(
        (expense) => expense.id === updatedExpense.id
      );
      if (index !== -1) {
        state.totalAmount -= state.expenses[index].moneySpent;
        state.expenses[index] = updatedExpense;
        state.totalAmount += updatedExpense.moneySpent;
      }
    },
  },
});

export const fetchExpensesSummary = () => {
  return async (dispatch) => {
    const API_KEY = import.meta.env.VITE_DATABASE_URL;
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`${API_KEY}/expensesSummary${userId}.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch expenses summary');
      }
      const data = await response.json();
      
      dispatch(
        expensesSlice.actions.setSummary({
          totalAmount: data.totalAmount || 0,
          premiumPurchase: data.premiumPurchase || false,
          premiumActive: data.premiumActive || false,
        })
      );
    } catch (error) {
      console.error('Error fetching expenses summary:', error.message);
    }
  };
};

export const putExpensesSummary = (summaryData) => {
  return async () => {
    const API_KEY = import.meta.env.VITE_DATABASE_URL;
    const userId = localStorage.getItem('userId');
    try {
      const response = await fetch(`${API_KEY}/expensesSummary${userId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(summaryData),
      });
      if (!response.ok) {
        throw new Error('Failed to update expenses summary');
      }
    } catch (error) {
      console.error('Error updating expenses summary:', error.message);
    }
  };
};

export const expensesAction = expensesSlice.actions;
export default expensesSlice.reducer;
