import { Component, OnInit } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,  IonLabel, IonButton, IonInput, IonCard, IonCardContent } from '@ionic/angular/standalone'; 
@Component({ 
selector: 'app-home', 
templateUrl: 'home.page.html', 
standalone: true, 
imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,  IonLabel, IonButton, IonInput, IonCard, IonCardContent, CommonModule,  FormsModule], 
}) 
export class HomePage implements OnInit { 
listMahasiswa: any[] = []; 
namaBaru = ''; 
jurusanBaru = ''; 
constructor(private api: ApiService) {} 
ngOnInit() { 
this.ambilData(); 
} 
ambilData() { 
this.api.getMahasiswa().subscribe({ 
next: (res) => this.listMahasiswa = res, 
error: (err) => console.error('Error:', err) 
}); 
} 
kirimData() { 
if (!this.namaBaru || !this.jurusanBaru) return; 
const data = { nama: this.namaBaru, jurusan: this.jurusanBaru }; 
this.api.tambahMahasiswa(data).subscribe({ 
next: () => { 
alert('Data Berhasil Dikirim!'); 
this.namaBaru = '';
this.jurusanBaru = ''; 
this.ambilData(); // Refresh list 
}, 
error: (err) => { 
alert('Gagal kirim data. Cek Console.'); 
console.error(err); 
} 
}); 
} 
} 
