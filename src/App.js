import { PieChart, Pie, Tooltip, Legend, Cell } from "recharts";
import { useState, useEffect } from "react";
import TransactionForm from "./components/TransactionForm";
import "./App.css";
import bg from "./assets/background.png";

function App() {
  const [salary, setSalary] = useState(0);

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  function addNewRecord(newRecord) {
    setTransactions((prev) => [...prev, newRecord]);
  }

  function deleteRecord(index) {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  }

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const totalExpense = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = totalIncome - totalExpense;
  const remaining = salary - totalExpense;

  const expenseChartData = [];
  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      const existing = expenseChartData.find(
        (e) => e.category === item.category
      );

      if (existing) {
        existing.amount += item.amount;
      } else {
        expenseChartData.push({
          category: item.category,
          amount: item.amount,
        });
      }
    });

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <div className="container">
        <h1>Kişisel Finans Analiz Uygulaması</h1>

        <TransactionForm onAddRecord={addNewRecord} />

        <div>
          <label htmlFor="salary">Aylık Maaş:</label>
          <input
            type="number"
            id="salary"
            placeholder="Örnek: 30000"
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
          />
        </div>

        <div>
          <h2>Özet</h2>
          <p>Toplam Gelir: {totalIncome.toLocaleString("tr-TR")} TL</p>
          <p>Toplam Gider: {totalExpense.toLocaleString("tr-TR")} TL</p>
          <p>Bakiye: {balance.toLocaleString("tr-TR")} TL</p>
          <p>Kalan Para: {remaining.toLocaleString("tr-TR")} TL</p>
        </div>

        <ul>
          {transactions.map((item, index) => (
            <li key={index}>
              {item.date} - {item.category} - {item.type} -{" "}
              {item.amount.toLocaleString("tr-TR")} TL
              <button
                onClick={() => deleteRecord(index)}
                style={{ marginLeft: 10 }}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>

        <div className="chart-container">
          <h2>Gider Dağılımı</h2>
          <PieChart width={400} height={400}>
            <Pie
              data={expenseChartData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {expenseChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`hsl(${index * 60}, 70%, 60%)`}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}

export default App;
