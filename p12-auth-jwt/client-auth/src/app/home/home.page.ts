import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HomePage {

  constructor(private authService: AuthService, private router: Router) {}

  async logout() {
    // Hapus Token
    await this.authService.logout();
    // Kembali ke Login
    this.router.navigate(['/login']);
  }
}