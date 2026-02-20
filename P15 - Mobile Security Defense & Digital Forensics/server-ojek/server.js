// ======================================================
// 
// Di bagian awal ini saya mengimpor semua library yang
// dibutuhkan untuk membangun backend server.
// Server ini berfungsi sebagai penghubung antara
// aplikasi frontend (misalnya Ionic) dengan database.
// ======================================================

// Mengimpor library Express untuk membuat server backend
const express = require("express");

// Mengimpor body-parser untuk membaca data JSON dari request client
// Tanpa ini, server tidak bisa membaca data yang dikirim dalam format JSON
const bodyParser = require("body-parser");

// Mengimpor mysql2 untuk koneksi ke database MySQL
// Library ini digunakan untuk menjalankan query ke database
const mysql = require("mysql2");

// Mengimpor CORS agar backend bisa diakses dari frontend berbeda origin (misalnya Ionic)
// Tanpa CORS, browser akan memblokir request karena beda port / domain
const cors = require("cors");

// Membuat instance aplikasi Express
const app = express();

// Mengaktifkan CORS middleware
app.use(cors());

// Mengaktifkan parsing JSON pada body request
app.use(bodyParser.json());

// ======================================================
// KONEKSI DATABASE
// ======================================================
// 
// Di bagian ini saya membuat koneksi ke database MySQL.
// Database digunakan untuk menyimpan dan memvalidasi data user.
// ======================================================

// Membuat koneksi ke database MySQL dengan konfigurasi berikut
const db = mysql.createConnection({
  host: "localhost", // Database berada di localhost (server sendiri)
  user: "root", // Username MySQL
  password: "", // Password MySQL (kosong pada XAMPP default)
  database: "db_ojeksiber", // Nama database yang digunakan
});

// Mencoba melakukan koneksi ke database
db.connect((err) => {
  if (err) {
    // Jika gagal konek, tampilkan pesan error agar mudah debugging
    console.error("❌ Gagal konek ke database:", err.message);
  } else {
    // Jika berhasil konek, tampilkan pesan sukses
    console.log("✅ Terhubung ke Database MySQL");
  }
});

// ======================================================
// ROUTE TEST ROOT
// ======================================================
// 
// Route ini hanya untuk memastikan server berjalan.
// Jika kita akses http://localhost:3000,
// maka akan muncul pesan bahwa backend aktif.
// ======================================================

app.get("/", (req, res) => {
  res.send("Backend OjekSiber Aktif ✅");
});

// ======================================================
// MIDDLEWARE FORENSIK
// ======================================================
// 
// Middleware ini berjalan sebelum endpoint diproses.
// Fungsinya untuk mencatat aktivitas user seperti:
// - IP Address
// - Device / User Agent
// - Waktu akses
// Ini berguna untuk keamanan dan analisis log.
// ======================================================

app.use((req, res, next) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const timestamp = new Date().toISOString();

  console.log(
    `[FORENSIC LOG] TIME: ${timestamp} | IP: ${ip} | DEVICE: ${userAgent} | PATH: ${req.path}`,
  );

  // next() artinya lanjut ke proses endpoint berikutnya
  next();
});

// ======================================================
// 1️⃣ LOGIN VULNERABLE
// ======================================================
// 
// Endpoint ini sengaja dibuat rentan terhadap SQL Injection.
// Tujuannya untuk menunjukkan bagaimana serangan bisa terjadi
// jika query dibuat dengan cara yang tidak aman.
// ======================================================

app.post("/api/login-vulnerable", (req, res) => {
  const { username, password } = req.body;

  // Query dibuat dengan string langsung (BERBAHAYA)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  console.log("⚠ QUERY VULNERABLE:", query);

  db.query(query, (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({ message: "LOGIN BERHASIL (Vulnerable)", user: results[0] });
    } else {
      res.status(401).json({ message: "Login Gagal" });
    }
  });
});

// ======================================================
// 2️⃣ LOGIN SECURE
// ======================================================
// 
// Endpoint ini adalah versi aman.
// Menggunakan parameterized query dengan placeholder (?)
// sehingga mencegah SQL Injection.
// ======================================================

app.post("/api/login-secure", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0) {
      res.json({ message: "LOGIN BERHASIL (Secure)", user: results[0] });
    } else {
      res.status(401).json({ message: "Login Gagal" });
    }
  });
});

// ======================================================
// 3️⃣ FAKE GPS DETECTION
// ======================================================
// 
// Endpoint ini digunakan untuk menerima data lokasi dari client.
// Jika terdeteksi menggunakan Fake GPS (mock location),
// maka request akan ditolak.
// Ini simulasi sistem keamanan berbasis lokasi.
// ======================================================

app.post("/api/absen-lokasi", (req, res) => {
  const { lat, lng, isMock } = req.body;
  const ip = req.socket.remoteAddress;

  // Jika terdeteksi lokasi palsu
  if (isMock === true) {
    console.log(`[ALERT] FAKE GPS DETECTED from IP: ${ip}`);

    return res.status(403).json({ message: "DILARANG MENGGUNAKAN FAKE GPS!" });
  }

  res.json({ message: "Absen Lokasi Berhasil Diterima" });
});

// ======================================================
// MENJALANKAN SERVER
// ======================================================
// 
// Di bagian terakhir ini server dijalankan pada port 3000.
// Artinya backend bisa diakses melalui http://localhost:3000
// ======================================================

app.listen(3000, () => {
  console.log("🚀 Server OjekSiber berjalan di port 3000");
});
