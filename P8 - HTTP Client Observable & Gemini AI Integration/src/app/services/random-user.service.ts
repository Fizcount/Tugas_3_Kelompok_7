import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RandomUserService {

  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  async getRandomUser() {

    const response = await lastValueFrom(
      this.http.get<any[]>(this.apiUrl)
    );

    // Ambil user random dari array
    const randomIndex = Math.floor(Math.random() * response.length);
    return response[randomIndex];
  }
}