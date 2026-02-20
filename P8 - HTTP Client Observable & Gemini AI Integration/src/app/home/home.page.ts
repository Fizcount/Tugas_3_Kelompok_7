import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonFooter,
IonItem, IonInput, IonButton, IonIcon, IonList, IonLabel, IonSpinner
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
// Import Service
import { GeminiService } from '../services/gemini.service';
@Component({
selector: 'app-home',
templateUrl: 'home.page.html',
styleUrls: ['home.page.scss'],
standalone: true,
imports: [CommonModule, FormsModule, RouterModule, IonHeader, IonToolbar,
IonTitle, IonContent, IonFooter, IonItem, IonInput, IonButton,
IonIcon, IonList, IonLabel, IonSpinner],
})
export class HomePage {
userInput = '';

chatHistory: { role: 'user' | 'model', text: string }[] = [];
isLoading = false;
constructor(private geminiService: GeminiService) {
addIcons({ send });
}
kirimPesan() {
if (!this.userInput.trim()) return;
// 1. Tampilkan pesan User di layar
const pesanUser = this.userInput;
this.chatHistory.push({ role: 'user', text: pesanUser });
this.userInput = ''; // Kosongkan input
this.isLoading = true; // Nyalakan loading
// 2. Panggil Service AI (Konsep Observable: Subscribe)
this.geminiService.generateText(pesanUser).subscribe({
next: (response) => {
// 3. Ambil jawaban dari struktur JSON Google
const jawabanAI =

response.candidates[0].content.parts[0].text;

// 4. Tampilkan jawaban AI
this.chatHistory.push({ role: 'model', text: jawabanAI });
this.isLoading = false;
},
error: (err) => {
console.error('Error:', err);
this.chatHistory.push({ role: 'model', text: 'Maaf, AI sedang pusing (Error koneksi).' });
this.isLoading = false;
}
});
}
}