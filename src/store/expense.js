import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  totalAmount: 0,
  premiumActive: false,
};

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense(state, action) {
      state.expenses.push(action.payload);
      state.totalAmount += action.payload.moneySpent;

      if (state.totalAmount > 10000) {
        state.premiumActive = true;
      }
    },
    setExpenses(state, action) {
      state.expenses = action.payload.expenses;
      state.totalAmount = action.payload.totalAmount;

      if (state.totalAmount > 10000) {
        state.premiumActive = true;
      }
    },
    activatePremium(state) {
      state.premiumActive = true;
    },
    deleteExpense(state, action) {
      const deletedExpense = state.expenses.find(expense => expense.id === action.payload);
      if (deletedExpense) {
        state.totalAmount -= deletedExpense.moneySpent;
        state.expenses = state.expenses.filter(expense => expense.id !== action.payload);
      }
    },
    updateExpense(state, action) {
      const updatedExpense = action.payload;
      const index = state.expenses.findIndex(expense => expense.id === updatedExpense.id);
      if (index !== -1) {
        state.totalAmount -= state.expenses[index].amount;
        state.expenses[index] = updatedExpense;
        state.totalAmount += updatedExpense.amount;
      }
    },
  },
});

export const expensesAction = expensesSlice.actions;
export default expensesSlice.reducer;
