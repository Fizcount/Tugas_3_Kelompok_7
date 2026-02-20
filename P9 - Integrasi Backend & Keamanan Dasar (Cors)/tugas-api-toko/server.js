const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// ================== KEAMANAN CORS ==================
const corsOptions = {
  origin: 'http://192.168.1.5:8100',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// ================== DATABASE SEMENTARA ==================
let dataBarang = [
  { id: 1, nama_barang: 'Beras 5kg', harga: 65000 }
];

// ================== ENDPOINT GET ==================
app.get('/api/barang', (req, res) => {
  res.json(dataBarang);
});

// ================== ENDPOINT POST ==================
app.post('/api/barang', (req, res) => {
  const barangBaru = req.body;
  barangBaru.id = Date.now();
  dataBarang.push(barangBaru);

  console.log("Barang baru masuk:", barangBaru);

  res.status(201).json({
    pesan: "Berhasil ditambahkan",
    data: barangBaru
  });
});

// ================== JALANKAN SERVER ==================
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
