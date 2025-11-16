import { useState, useRef } from "react";

function TransactionForm({ onAddRecord }) {
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const categoryInputRef = useRef(null);

  const isFormValid = type && category && amount && date;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecord = {
      type,
      category,
      amount: parseFloat(amount),
      date,
    };

    onAddRecord(newRecord);

    setType("");
    setCategory("");
    setAmount("");
    setDate("");

    categoryInputRef.current.focus();
  };

  return (
    <form className="TransactionForm" onSubmit={handleSubmit}>
      <h2>Yeni Kayıt Ekle</h2>

      <label>Tür:</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">Seçiniz</option>
        <option value="income">Gelir</option>
        <option value="expense">Gider</option>
      </select>

      <label>Kategori:</label>
      <input
        ref={categoryInputRef}
        type="text"
        placeholder="Kategori"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <label>Miktar:</label>
      <input
        type="text"
        placeholder="Örn: 1250"
        value={amount}
        onChange={(e) => {
          const clean = e.target.value.replace(/\./g, "").replace(",", ".");
          setAmount(clean);
        }}
      />

      <label>Tarih:</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit" disabled={!isFormValid}>
        Ekle
      </button>
    </form>
  );
}

export default TransactionForm;
