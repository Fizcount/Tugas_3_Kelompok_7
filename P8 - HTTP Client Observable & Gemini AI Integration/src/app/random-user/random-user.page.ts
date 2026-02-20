import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton,
  IonCard, IonCardHeader,
  IonCardTitle, IonCardContent
} from '@ionic/angular/standalone';

import { RandomUserService } from '../services/random-user.service';

@Component({
  selector: 'app-random-user',
  templateUrl: './random-user.page.html',
  styleUrls: ['./random-user.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class RandomUserPage {

  user: any;
  avatarUrl: string = '';

  constructor(private randomUserService: RandomUserService) {}

  async generateUser() {
    try {
      this.user = await this.randomUserService.getRandomUser();

      // Generate random avatar 1 - 70
      const randomAvatar = Math.floor(Math.random() * 70) + 1;
      this.avatarUrl = `https://i.pravatar.cc/150?img=${randomAvatar}`;

    } catch (error) {
      console.error(error);
    }
  }
}