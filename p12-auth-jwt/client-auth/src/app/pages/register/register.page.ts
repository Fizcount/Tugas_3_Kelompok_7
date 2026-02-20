import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { RegisterPayload } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class RegisterPage {
  
  // Model data strict type
  data: RegisterPayload = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onRegister() {
    if (!this.data.username || !this.data.password) {
      this.showToast('Isi data dengan lengkap!', 'warning');
      return;
    }

    this.authService.register(this.data).subscribe({
      next: () => {
        this.showToast('Registrasi Berhasil! Silakan Login.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        // Ambil pesan error dari backend
        const pesan = err.error.error || 'Gagal Mendaftar';
        this.showToast(pesan, 'danger');
      }
    });
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg, duration: 2000, color: color, position: 'bottom'
    });
    toast.present();
  }
}