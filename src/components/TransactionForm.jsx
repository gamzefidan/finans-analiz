import { useState, useRef } from "react";

function TransactionForm(props) {
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const categoryInputRef = useRef(null);

  const isFormValid = type && category && amount && date;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      type: type,
      category: category,
      amount: parseFloat(amount),
      date: date,
    };

    props.onAddRecord(newRecord);

    setType("");
    setCategory("");
    setAmount("");
    setDate("");

    categoryInputRef.current.focus();
  };

  return (
    <form className="TransactionForm" onSubmit={handleSubmit}>
      <h2>Add New Record</h2>

      <label htmlFor="type">Type:</label>
      <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Select</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <label htmlFor="category">Category:</label>
      <input
        ref={categoryInputRef}
        type="text"
        id="category"
        placeholder="Enter category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <label htmlFor="amount">Amount:</label>
      <input
        type="text"
        id="amount"
        placeholder="example: 1250"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <label htmlFor="date">Date:</label>
      <input
        type="date"
        id="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit" disabled={!isFormValid}>
        Add
      </button>
    </form>
  );
}

export default TransactionForm;
