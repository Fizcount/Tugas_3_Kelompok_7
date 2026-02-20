# Autentikasi Ionic + Express

Login/Register aman dengan:
- JWT
- Bcrypt
- Capacitor Preferences
- Auth Guard

Folder:
- server-auth → backend Express + MySQL
- client-auth → frontend Ionic + Angular

Jalankan:
1. Buat DB `db_kampus` + tabel `users`
```sql
CREATE DATABASE IF NOT EXISTS db_kampus;
USE db_kampus;

CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL
);
```
2. cd server-auth → npm install → node server.js
3. cd client-auth → npm install → ionic serve

**TUGAS DISKUSI KELOMPOK:**  
https://docs.google.com/document/d/1C6a_oeLrTiz3kdw-OD6rq9-lo67HilXMeDNwFeKy3ig/edit?usp=sharing
