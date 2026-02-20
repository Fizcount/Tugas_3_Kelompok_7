import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
@Injectable({ 
 providedIn: 'root' 
}) 
export class ApiService { 
 // Alamat Backend (Endpoint) 
 private apiUrl = 'http://localhost:3000/api/mahasiswa';  constructor(private http: HttpClient) { } 
 // Mengambil Data (GET) 
 getMahasiswa(): Observable<any> { 
 return this.http.get(this.apiUrl); 
 } 
 // Mengirim Data (POST) 
 tambahMahasiswa(data: any): Observable<any> { 
 return this.http.post(this.apiUrl, data); 
 } 
}
