const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// --- KEAMANAN SIBER DASAR: PROTEKSI ENDPOINT ---
// Hanya izinkan request dari Aplikasi Ionic (Port 8100)
const corsOptions = {
origin: 'http://localhost:8100',
optionsSuccessStatus: 200
};
app.use(cors(corsOptions)); // Terapkan aturan keamanan
app.use(bodyParser.json());
// Simulasi Database
let dataMahasiswa = [
{ id: 1, nama: 'Andi Setiawan', jurusan: 'TI' },
{ id: 2, nama: 'Ita Purnamasari', jurusan: 'SI' }
];
// Endpoint GET (Ambil Data)
app.get('/api/mahasiswa', (req, res) => {
res.json(dataMahasiswa);
});
// Endpoint POST (Terima Data Baru)
app.post('/api/mahasiswa', (req, res) => {
const dataBaru = req.body;
dataBaru.id = Date.now(); // ID Unik sederhana
dataMahasiswa.push(dataBaru);
console.log('Data baru diterima:', dataBaru);
res.status(201).json({ pesan: 'Sukses', data: dataBaru });
});
app.listen(PORT, () => {
console.log(`Server Aman berjalan di http://localhost:${PORT}`);
});