export const exportToCSV = (expenses) => {
  const headers = ['Date', 'Description', 'Amount'];
  const rows = expenses.map(expense => [expense.date, expense.description, expense.moneySpent]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") 
    + "\n" 
    + rows.map(row => row.join(",")).join("\n");

  return encodeURI(csvContent);
};
