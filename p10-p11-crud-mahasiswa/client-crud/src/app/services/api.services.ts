import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mahasiswa, MahasiswaDTO } from '../interfaces/mahasiswa';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  // Pastikan backend berjalan di port ini
  private apiUrl = 'http://localhost:3000/api/mahasiswa';

  constructor(private http: HttpClient) { }

  getMahasiswa(): Observable<Mahasiswa[]> {
    return this.http.get<Mahasiswa[]>(this.apiUrl);
  }

  tambahMahasiswa(data: MahasiswaDTO): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateMahasiswa(id: number, data: MahasiswaDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteMahasiswa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}