import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { AuthResponse, LoginPayload, RegisterPayload } from '../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:3000/api';
  private TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) { }

  // Register: Mengirim data user baru
  register(data: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data);
  }

  // Login: Mengirim kredensial untuk dapat Token
  login(data: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  // --- MANAJEMEN SESI (CAPACITOR) ---

  // Simpan Token ke penyimpanan aman HP
  async setToken(token: string): Promise<void> {
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
  }

  // Ambil Token (untuk cek login)
  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  // Cek apakah user sedang login (Boolean)
  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return (token !== null); // True jika token ada
  }

  // Logout: Hapus token dari memori
  async logout(): Promise<void> {
    await Preferences.remove({ key: this.TOKEN_KEY });
  }
}