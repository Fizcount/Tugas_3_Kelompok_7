import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { LoginPayload } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class LoginPage {

  data: LoginPayload = { username: '', password: '' };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async onLogin() {
    if (!this.data.username || !this.data.password) {
      this.showToast('Username dan Password wajib diisi!', 'warning');
      return;
    }

    this.authService.login(this.data).subscribe({
      next: async (res) => {
        // 1. Jika sukses, simpan Token ke Capacitor
        if (res.token) {
          await this.authService.setToken(res.token);
          
          this.showToast('Login Berhasil!', 'success');
          // 2. Arahkan ke Halaman Rahasia
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        const pesan = err.error.error || 'Gagal Login';
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