import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";
import TransactionForm from "./components/TransactionForm";
import "./App.css";
import bg from "./assets/background.png";

function App() {
  const [maas, setmaas] = useState(0);
  const [transactions, setTransactions] = useState(() => {
    const kayitliVeri = localStorage.getItem("transactions");
    return kayitliVeri ? JSON.parse(kayitliVeri) : [];
  });

  function yeniKayitEkle(yeniVeri) {
    setTransactions((prevTransactions) => [...prevTransactions, yeniVeri]);
    console.log("Formdan gelen yeni veri:", yeniVeri);
  }

  function kayitSil(index) {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((_, i) => i !== index)
    );
  }

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const gelirToplam = transactions
    .filter((item) => item.type === "gelir")
    .reduce((toplam, item) => toplam + item.miktar, 0);

  const giderToplam = transactions
    .filter((item) => item.type === "gider")
    .reduce((toplam, item) => toplam + item.miktar, 0);

  const kalanPara = maas - giderToplam;
  const bakiye = gelirToplam - giderToplam;

  const giderVerisi = [];

  transactions
    .filter((item) => item.type === "gider")
    .forEach((item) => {
      const mevcutKategori = giderVerisi.find(
        (g) => g.kategori === item.kategori
      );
      if (mevcutKategori) {
        mevcutKategori.miktar += item.miktar;
      } else {
        giderVerisi.push({
          kategori: item.kategori,
          miktar: item.miktar,
          oran: maas ? ((item.miktar / maas) * 100).toFixed(1) : 0,
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
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        color: "#fff",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "900px", margin: "0 auto" }}
      >
        <h1>Kişisel Finans Analiz Uygulaması</h1>

        <TransactionForm onYeniKayitEkle={yeniKayitEkle} />

        <div>
          <label htmlFor="maas">Aylık Maaş:</label>
          <input
            type="text"
            id="maas"
            placeholder="örnek: 30.000"
            value={maas.toLocaleString("tr-TR")}
            onChange={(e) => {
              const temizDeger = e.target.value
                .replace(/\./g, "")
                .replace(/,/g, ".");
              const sayi = parseFloat(temizDeger);
              if (!isNaN(sayi) && sayi >= 0) {
                setmaas(sayi);
              } else if (e.target.value === "") {
                setmaas(0);
              }
            }}
          />
        </div>

        <div>
          <h2>Özet</h2>
          <p>Toplam Gelir: {gelirToplam.toLocaleString("tr-TR")} TL</p>
          <p>Toplam Gider: {giderToplam.toLocaleString("tr-TR")} TL</p>
          <p>Bakiye: {bakiye.toLocaleString("tr-TR")} TL</p>
          <p>Kalan Para: {kalanPara.toLocaleString("tr-TR")} TL</p>
        </div>

        <ul>
          {transactions.map((item, index) => (
            <li key={index}>
              {item.tarih} - {item.kategori} - {item.type} - {item.miktar} TL
              <button
                style={{ marginLeft: "10px" }}
                onClick={() => kayitSil(index)}
              >
                Sil
              </button>
            </li>
          ))}
        </ul>

        <div className="chart-container">
          <div>
            <h2>Gider Dağılımı (Aylık Maaş Oranları)</h2>
            <PieChart width={400} height={400}>
              <Pie
                data={giderVerisi}
                dataKey="miktar"
                nameKey="kategori"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {giderVerisi.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} TL (%${props.payload.oran})`,
                  name,
                ]}
              />
              <Legend />
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
