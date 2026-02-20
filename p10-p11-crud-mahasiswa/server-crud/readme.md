# Backend API Service

Service Node.js Express yang terhubung ke MySQL.

## Setup Database
Jalankan Query ini di HeidiSQL/PhpMyAdmin:

```sql
CREATE DATABASE db_kampus;
USE db_kampus;
CREATE TABLE mahasiswa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nim VARCHAR(20) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    jurusan VARCHAR(50) NOT NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL
);
```

## Error Handling
Backend akan mengembalikan status 400 Bad Request dengan pesan spesifik jika terjadi duplikasi NIM (Error Code 1062).