import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // WAJIB
import { FormsModule } from '@angular/forms';   // kalau pakai ngModel
import { IonHeader, IonToolbar, IonTitle, IonContent,
         IonTextarea, IonCard, IonCardContent } 
from '@ionic/angular/standalone';

import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GeminiService } from '../services/gemini.service';

@Component({
  selector: 'app-grammar-checker',
  templateUrl: './grammar-checker.page.html',
  styleUrls: ['./grammar-checker.page.scss'],
  standalone: true,
  imports: [
    CommonModule,   // <-- INI PENTING UNTUK *ngIf
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonTextarea,
    IonCard,
    IonCardContent
  ]
})
export class GrammarCheckerPage {

  private textSubject = new Subject<string>();
  result: any;

  constructor(private geminiService: GeminiService) {

    this.textSubject.pipe(
      debounceTime(1000),
      switchMap(text => this.geminiService.checkGrammar(text))
    ).subscribe(response => {

      const aiText =
        response.candidates[0].content.parts[0].text;

      console.log("RAW AI RESPONSE:", aiText);

      // Ambil hanya bagian JSON
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          this.result = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("JSON Parse Error:", e);
        }
      } else {
        console.error("Tidak menemukan JSON");
      }
    });
  }

  onTextChange(event: any) {
    const text = event.target.value;
    this.textSubject.next(text);
  }
}