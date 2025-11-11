import { useState, useRef } from "react";

function TransactionForm(props) {
  const [tur, setTur] = useState("");
  const [kategori, setKategori] = useState("");
  const [miktar, setMiktar] = useState("");
  const [tarih, setTarih] = useState("");
  const kategoriInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const yeniVeri = {
      type: tur,
      kategori: kategori,
      miktar: parseFloat(miktar),
      tarih: tarih,
    };
    props.onYeniKayitEkle(yeniVeri);

    setTur("");
    setKategori("");
    setMiktar("");
    setTarih("");
    kategoriInputRef.current.focus();
  };

  return (
    <form className="TransactionForm" onSubmit={handleSubmit}>
      <h2>Yeni Kayıt Ekle</h2>
      <label htmlFor="type">Tür:</label>
      <select
        id="type"
        name="type"
        value={tur}
        onChange={(e) => setTur(e.target.value)}
      >
        <option value="">Seçiniz</option>
        <option value="gelir">Gelir</option>
        <option value="gider">Gider</option>
      </select>
      <label htmlFor="Kategori">Kategori:</label>
      <input
        ref={kategoriInputRef}
        type="text"
        id="Kategori"
        name="Kategori"
        placeholder="Kategori giriniz"
        value={kategori}
        onChange={(e) => setKategori(e.target.value)}
      />
      <label htmlFor="Miktar">Miktar:</label>
      <input
        type="text"
        id="Miktar"
        name="Miktar"
        placeholder="örnek: 1.250"
        value={
          miktar
            ? parseFloat(
                miktar.replace(/\./g, "").replace(/,/g, ".")
              ).toLocaleString("tr-TR")
            : ""
        }
        onChange={(e) => {
          const temizDeger = e.target.value
            .replace(/\./g, "")
            .replace(/,/g, ".");
          const sayi = parseFloat(temizDeger);
          if (!isNaN(sayi) && sayi >= 0) {
            setMiktar(sayi.toString());
          } else if (e.target.value === "") {
            setMiktar("");
          }
        }}
      />

      <label htmlFor="Tarih">Tarih:</label>
      <input
        type="date"
        id="Tarih"
        name="Tarih"
        value={tarih}
        onChange={(e) => setTarih(e.target.value)}
      />
      <button type="submit">Ekle</button>
    </form>
  );
}

export default TransactionForm;
