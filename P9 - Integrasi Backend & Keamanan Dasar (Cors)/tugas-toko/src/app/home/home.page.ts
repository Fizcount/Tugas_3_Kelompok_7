import { Component, OnInit } from '@angular/core';
import { BarangService } from '../services/barang.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent,
         IonList, IonItem, IonLabel,
         IonButton, IonInput, IonCard, IonCardContent }
from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel,
    IonButton, IonInput, IonCard, IonCardContent,
    CommonModule, FormsModule
  ],
})
export class HomePage implements OnInit {

  listBarang: any[] = [];
  namaBarang = '';
  hargaBarang: any = '';

  constructor(private barangService: BarangService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.barangService.getBarang().subscribe({
      next: (res) => this.listBarang = res,
      error: (err) => console.error(err)
    });
  }

  simpanBarang() {
    if (!this.namaBarang || !this.hargaBarang) return;

    const data = {
      nama_barang: this.namaBarang,
      harga: this.hargaBarang
    };

    this.barangService.tambahBarang(data).subscribe({
      next: () => {
        alert("Barang berhasil ditambahkan!");
        this.namaBarang = '';
        this.hargaBarang = '';
        this.loadData();
      },
      error: (err) => console.error(err)
    });
  }
}
