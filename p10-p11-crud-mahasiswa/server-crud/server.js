const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

const corsOptions = {
    origin: 'http://localhost:8100', // Ganti dengan URL frontend Anda 
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'db_kampus'
});

db.connect((err) => {
    if (err) console.error('Gagal koneksi database:', err);
    else console.log('✅ Terkoneksi ke MySQL Database: db_kampus');
});

// --- API ENDPOINTS ---

// GET: Ambil Semua Data
app.get('/api/mahasiswa', (req, res) => {
    const query = 'SELECT * FROM mahasiswa ORDER BY id DESC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST: Tambah Data (Dengan Validasi NIM Unik)
app.post('/api/mahasiswa', (req, res) => {
    const { nim, nama, jurusan, jenis_kelamin } = req.body;

    if (!nim || !nama || !jurusan || !jenis_kelamin) {
        return res.status(400).json({ message: 'Semua field wajib diisi!' });
    }

    const query = 'INSERT INTO mahasiswa (nim, nama, jurusan, jenis_kelamin) VALUES (?, ?, ?, ?)';
    db.query(query, [nim, nama, jurusan, jenis_kelamin], (err, result) => {
        if (err) {
            // Cek error duplicate entry (NIM sudah ada)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: `NIM ${nim} sudah terdaftar!` });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Data berhasil disimpan', id: result.insertId });
    });
});

// PUT: Update Data
app.put('/api/mahasiswa/:id', (req, res) => {
    const { id } = req.params;
    const { nim, nama, jurusan, jenis_kelamin } = req.body;

    const query = 'UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ?, jenis_kelamin = ? WHERE id = ?';
    db.query(query, [nim, nama, jurusan, jenis_kelamin, id], (err, result) => {
        if (err) {
             if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: `NIM ${nim} sudah digunakan mahasiswa lain!` });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Data berhasil diupdate' });
    });
});

// DELETE: Hapus Data
app.delete('/api/mahasiswa/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM mahasiswa WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Data berhasil dihapus' });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});