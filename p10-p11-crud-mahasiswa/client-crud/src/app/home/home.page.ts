import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonList, IonItem, IonLabel, IonButton, 
  IonInput, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonSelect, IonSelectOption, IonSearchbar, IonRefresher, IonRefresherContent,
  IonItemSliding, IonItemOptions, IonItemOption, IonNote, 
  IonRadioGroup, IonRadio, IonIcon, IonListHeader,
  AlertController, ToastController 
} from '@ionic/angular/standalone';

// 1. IMPORT DARI IONICONS
import { addIcons } from 'ionicons';
import { createOutline, trashOutline, chevronBackOutline } from 'ionicons/icons';

import { ApiService } from '../services/api.services';
import { Mahasiswa, MahasiswaDTO } from '../interfaces/mahasiswa';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonButton,
    IonInput, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonSelect, IonSelectOption, IonSearchbar, IonRefresher, IonRefresherContent,
    IonItemSliding, IonItemOptions, IonItemOption, IonNote,
    IonRadioGroup, IonRadio,
    IonIcon,
    IonListHeader
  ]
})
export class HomePage implements OnInit {
  
  allMahasiswa: Mahasiswa[] = [];
  filteredMahasiswa: Mahasiswa[] = [];

  inputNim: string = '';
  inputNama: string = '';
  inputJurusan: string = '';
  inputJenisKelamin: 'L' | 'P' | '' = ''; 

  idEdit: number | null = null;

  constructor(
    private api: ApiService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    addIcons({ createOutline, trashOutline, chevronBackOutline });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(event?: any) {
    this.api.getMahasiswa().subscribe({
      next: (res) => {
        this.allMahasiswa = res;
        this.filteredMahasiswa = res;
        if (event) event.target.complete();
      },
      error: (err) => {
        console.error(err);
        this.tampilkanToast('Gagal memuat data', 'danger');
        if (event) event.target.complete();
      }
    });
  }

  handleRefresh(event: any) {
    this.loadData(event);
  }

  handleSearch(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredMahasiswa = this.allMahasiswa.filter(mhs => 
      mhs.nama.toLowerCase().includes(query) || mhs.nim.includes(query)
    );
  }

  simpanData() {
    if (!this.inputNim || !this.inputNama || !this.inputJurusan || !this.inputJenisKelamin) {
      this.tampilkanToast('Semua data wajib diisi!', 'warning');
      return;
    }

    const data: MahasiswaDTO = {
      nim: this.inputNim,
      nama: this.inputNama,
      jurusan: this.inputJurusan,
      jenis_kelamin: this.inputJenisKelamin as 'L' | 'P'
    };

    if (this.idEdit) {
      this.api.updateMahasiswa(this.idEdit, data).subscribe({
        next: () => {
          this.tampilkanToast('Data berhasil diperbarui', 'success');
          this.resetForm();
          this.loadData();
        },
        error: (err) => {
          this.tampilkanToast(err.error.message || 'Gagal update data', 'danger');
        }
      });
    } else {
      this.api.tambahMahasiswa(data).subscribe({
        next: () => {
          this.tampilkanToast('Data berhasil ditambahkan', 'success');
          this.resetForm();
          this.loadData();
        },
        error: (err) => {
          this.tampilkanToast(err.error.message || 'Gagal tambah data', 'danger');
        }
      });
    }
  }

  editData(mhs: Mahasiswa) {
    this.idEdit = mhs.id;
    this.inputNim = mhs.nim;
    this.inputNama = mhs.nama;
    this.inputJurusan = mhs.jurusan; 
    this.inputJenisKelamin = mhs.jenis_kelamin;
    
    document.querySelector('ion-content')?.scrollToTop(500);
  }

  resetForm() {
    this.idEdit = null;
    this.inputNim = '';
    this.inputNama = '';
    this.inputJurusan = '';
    this.inputJenisKelamin = '';
  }

  async konfirmasiHapus(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Hapus Data?',
      message: 'Yakin ingin menghapus data ini?',
      buttons: [
        { text: 'Batal', role: 'cancel' },
        {
          text: 'Hapus',
          role: 'confirm',
          handler: () => {
            this.api.deleteMahasiswa(id).subscribe(() => {
              this.tampilkanToast('Data dihapus', 'danger');
              this.loadData();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async tampilkanToast(pesan: string, warna: string) {
    const toast = await this.toastCtrl.create({
      message: pesan,
      duration: 2000,
      color: warna,
      position: 'bottom'
    });
    await toast.present();
  }
}