import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BarangService {

  private apiUrl = 'http://192.168.1.5:3000/api/barang';

  constructor(private http: HttpClient) {}

  // GET
  getBarang(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // POST
  tambahBarang(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}
