/**
 * BACKEND SERVER - AUTHENTICATION
 * Stack: Express.js, MySQL, Bcrypt, JWT
 * Tujuan: Menangani Register (Enkripsi) & Login (Validasi Token)
 */

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');       // Library untuk hashing password
const jwt = require('jsonwebtoken');    // Library untuk membuat token

const app = express();
const PORT = 3000;
const SECRET_KEY = "kunci_rahasia_kelompok_kami"; // Kunci untuk tanda tangan token

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 1. KONEKSI DATABASE
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Sesuaikan jika ada password
    database: 'db_auth'
});

// 2. ENDPOINT REGISTER (Mendaftar Akun)
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    // Validasi Input
    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan Password wajib diisi!' });
    }

    try {
        // ENKRIPSI: Mengubah password asli menjadi hash acak (Salt Rounds: 10)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Simpan ke MySQL
        const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
        db.query(sql, [username, hashedPassword], (err, result) => {
            if (err) {
                // Error biasanya karena username duplicate (UNIQUE constraint)
                return res.status(400).json({ error: 'Username sudah digunakan!' });
            }
            res.status(201).json({ message: 'Registrasi Berhasil! Silakan Login.' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Terjadi kesalahan server' });
    }
});

// 3. ENDPOINT LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Cari user di Database
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        // Jika user tidak ditemukan
        if (results.length === 0) {
            return res.status(401).json({ error: 'Username tidak ditemukan!' });
        }

        const user = results[0];

        // VALIDASI: Bandingkan password input vs password hash di DB
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Password salah!' });
        }

        // GENERATE TOKEN: Membuat tiket masuk digital
        // Payload: Data yang disimpan dalam token (ID & Username)
        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' } // Token kadaluarsa dalam 1 jam (Security Practice)
        );

        // Kirim token ke Frontend
        res.json({ message: 'Login Sukses', token: token });
    });
});

app.listen(PORT, () => {
    console.log(`🔐 Server Auth berjalan di http://localhost:${PORT}`);
});