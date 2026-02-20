import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    // Cek Status Login
    const isLogged = await this.authService.isLoggedIn();

    if (isLogged) {
      return true; // Boleh Masuk
    } else {
      // Jika belum login, tendang ke halaman login
      this.router.navigate(['/login']);
      return false;
    }
  }
} 