// ======================================================
// 
// Di bagian ini saya mengimpor semua library dan modul
// yang dibutuhkan oleh halaman Home.
// ======================================================

// Import decorator Component dari Angular
import { Component } from '@angular/core';

// Import module dasar Angular untuk fitur umum
import { CommonModule } from '@angular/common';

// Import FormsModule agar bisa menggunakan ngModel
import { FormsModule } from '@angular/forms';

// Import Geolocation dari Capacitor untuk mengambil GPS
import { Geolocation } from '@capacitor/geolocation';

// Import Camera dari Capacitor untuk mengambil foto
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Import Leaflet untuk menampilkan peta
import * as L from 'leaflet';

// Import Firebase untuk koneksi ke database
import { initializeApp } from "firebase/app";

// Import Firestore untuk menyimpan data laporan
import { getFirestore, collection, addDoc } from "firebase/firestore";


// ======================================================
// 
// Di sini saya mengimpor semua komponen Ionic
// yang digunakan di file HTML.
// ======================================================
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonItem, IonLabel, IonIcon 
} from "@ionic/angular/standalone";


// ======================================================
// 
// Import icon yang akan digunakan di tombol.
// ======================================================
import { addIcons } from 'ionicons';
import { logInOutline, locationOutline, cameraOutline, saveOutline } from 'ionicons/icons';


// ======================================================
// 
// Konfigurasi Firebase project.
// Ini berisi identitas project yang terdaftar di Firebase.
// ======================================================
const firebaseConfig = {
  apiKey: "AIzaSyCmMhS36yI_YOsIz9glS6WTntG0MFWPNRY",
  authDomain: "geopotral.firebaseapp.com",
  projectId: "geopotral",
  storageBucket: "geopotral.firebasestorage.app",
  messagingSenderId: "139988864445",
  appId: "1:139988864445:web:3a4a0b5b9f13e36b2896d4"
};


// ======================================================
// 
// Inisialisasi Firebase dan menghubungkan ke Firestore.
// ======================================================
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================================================
// 
// Deklarasi komponen HomePage.
// Standalone true artinya tidak perlu module terpisah.
// ======================================================
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonItem, IonLabel, IonIcon
  ],
})
export class HomePage {

  // ======================================================
  // 
  // Deklarasi variabel state yang digunakan di halaman.
  // ======================================================

  username = ''; // Menyimpan nama atau ID kurir
  noResi = '';   // Menyimpan nomor resi paket
  isLogin = false; // Status login

  latitude: any;   // Menyimpan nilai latitude
  longitude: any;  // Menyimpan nilai longitude
  foto: any;       // Menyimpan foto dalam bentuk Base64

  map: any;        // Objek map Leaflet
  marker: any;     // Marker lokasi di map


  // ======================================================
  // 
  // Constructor dijalankan saat halaman pertama kali dibuat.
  // ======================================================
  constructor() {

    // Mendaftarkan icon agar bisa digunakan di HTML
    addIcons({ logInOutline, locationOutline, cameraOutline, saveOutline });
  }


  // ======================================================
  // 
  // Fungsi login dijalankan saat tombol Masuk ditekan.
  // ======================================================
  login() {

    // Validasi jika username kosong
    if(this.username.trim() === '') {
      alert('Isi ID Kurir / Nama terlebih dahulu!');
      return;
    }

    // Jika valid, ubah status login menjadi true
    this.isLogin = true;
  }


  // ======================================================
  // 
  // Fungsi untuk mengambil lokasi GPS dari perangkat.
  // ======================================================
  async ambilLokasi() {

    try {

      // Mengambil posisi GPS saat ini
      const coordinates = await Geolocation.getCurrentPosition();

      // Simpan latitude dan longitude
      this.latitude = coordinates.coords.latitude;
      this.longitude = coordinates.coords.longitude;
      
      // Delay agar div map sudah dirender sebelum Leaflet dipanggil
      setTimeout(() => {
        this.tampilkanMap();
      }, 300);

    } catch (e) {

      // Jika gagal mengambil lokasi
      alert("Gagal mengambil lokasi. Pastikan GPS aktif dan izin diberikan.");
    }
  }


  // ======================================================
  // 
  // Fungsi untuk menampilkan peta menggunakan Leaflet.
  // ======================================================
  tampilkanMap() {

    // Jika map sudah ada sebelumnya, hapus dulu
    if(this.map) {
      this.map.remove();
    }

    // Inisialisasi map dengan koordinat dan zoom level 18
    this.map = L.map('map').setView([this.latitude, this.longitude], 18);

    // Tambahkan tile dari OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // Tambahkan marker lokasi pengiriman
    this.marker = L.marker([this.latitude, this.longitude])
      .addTo(this.map)
      .bindPopup("Lokasi Pengiriman")
      .openPopup();
  }


  // ======================================================
  // 
  // Fungsi untuk mengambil foto dari kamera perangkat.
  // ======================================================
  async ambilFoto() {

    try {

      const image = await Camera.getPhoto({
        quality: 90, // Kualitas gambar tinggi
        allowEditing: false, // Tidak bisa edit
        resultType: CameraResultType.DataUrl, // Hasil berupa Base64
        source: CameraSource.Camera // Ambil langsung dari kamera
      });

      // Simpan hasil foto ke variabel
      this.foto = image.dataUrl;

    } catch (e) {

      // Jika user membatalkan
      console.log("Pengambilan foto dibatalkan atau gagal");
    }
  }


  // ======================================================
  // 
  // Fungsi untuk menyimpan data laporan ke Firebase Firestore.
  // ======================================================
  async simpanData() {

    // Validasi nomor resi
    if(this.noResi.trim() === '') {
      alert("Mohon isi nomor resi paket!");
      return;
    }

    // Validasi lokasi
    if(!this.latitude || !this.longitude) {
      alert("Mohon ambil koordinat lokasi terlebih dahulu!");
      return;
    }

    // Validasi foto
    if(!this.foto) {
      alert("Mohon ambil foto bukti paket terlebih dahulu!");
      return;
    }

    try {

      // Tambahkan data ke collection "laporan"
      await addDoc(collection(db, "laporan"), {

        user: this.username,
        noResi: this.noResi,
        latitude: this.latitude,
        longitude: this.longitude,
        foto: this.foto,
        status: "Terkirim",
        waktu: new Date()

      });

      alert("Laporan berhasil disimpan & dikirim ke database!");
      
      // Reset sebagian form setelah berhasil
      this.noResi = '';
      this.foto = null;

    } catch (e) {

      alert("Gagal menyimpan data ke Firebase.");
    }
  }
}