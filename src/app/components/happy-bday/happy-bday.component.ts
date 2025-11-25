import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, style, transition, animate, keyframes } from '@angular/animations';
import {SnackbarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-happy-bday',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './happy-bday.component.html',
  styleUrls: ['./happy-bday.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('800ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('bounce', [
      transition(':enter', [
        animate('1.5s ease-in-out', keyframes([
          style({ transform: 'translateY(-100vh) rotate(0deg)', offset: 0 }),
          style({ transform: 'translateY(0) rotate(360deg)', offset: 0.7 }),
          style({ transform: 'translateY(-30px) rotate(370deg)', offset: 0.85 }),
          style({ transform: 'translateY(0) rotate(360deg)', offset: 1 })
        ]))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100vh) rotate(-10deg)', opacity: 0 }),
        animate('1200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'translateY(0) rotate(0deg)', opacity: 1 }))
      ])
    ]),
    trigger('shake', [
      transition(':enter', [
        animate('0.5s', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(-5deg)', offset: 0.1 }),
          style({ transform: 'rotate(5deg)', offset: 0.2 }),
          style({ transform: 'rotate(-5deg)', offset: 0.3 }),
          style({ transform: 'rotate(5deg)', offset: 0.4 }),
          style({ transform: 'rotate(-5deg)', offset: 0.5 }),
          style({ transform: 'rotate(5deg)', offset: 0.6 }),
          style({ transform: 'rotate(-5deg)', offset: 0.7 }),
          style({ transform: 'rotate(5deg)', offset: 0.8 }),
          style({ transform: 'rotate(-5deg)', offset: 0.9 }),
          style({ transform: 'rotate(0deg)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class HappyBdayComponent implements OnInit {
  personalMessage = `la anyways 2025 samma chai bacheko raixa haina... thikai xa...
  ani congrats on sticking with hope of jungkook aaba samma. Boyfriend vanda jk ko obsession tikako😂.
  I want this year to be the year of treats okeyyy.. you got into a nice company, bet the salary is gonne be nice too. so aba im expecting atleast 1 treat a month🎉
  And keep the tea spilling.
  Also I want your part of the food you promised to be fulfilled ASAP!!!!`;

  // Animation control
  showCountdown = false;
  showExplosion = false;
  showName = false;
  showMessage = false;
  displayedMessage = '';
  countdownNumber = 3;

  confetti: Array<{left: number, animationDelay: string, color: string, rotation: number}> = [];
  emojis: Array<{emoji: string, left: number, animationDelay: string}> = [];

  constructor(private router: Router,
              private snackbarService : SnackbarService) {}

  ngOnInit() {
    if (!this.isBirthdayToday()) {
      this.snackbarService.show('today is not the day, Check Tomorrow','error',5);
      this.router.navigate(['/portfolio']).catch(
        err => {
          this.snackbarService.show("Theres Been An Error Navigating to Portfolio. Check Console Logs",'error',5);
          console.error(err);
        }
      );
      return;
    }

    // Start countdown
    setTimeout(() => {
      this.showCountdown = true;
      this.startCountdown();
    }, 500);
  }

  startCountdown() {
    const countdownInterval = setInterval(() => {
      this.countdownNumber--;
      if (this.countdownNumber === 0) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          this.showCountdown = false;
          this.explode();
        }, 800);
      }
    }, 1000);
  }

  explode() {
    this.showExplosion = true;

    // REDUCED: Generate confetti (50 instead of 100)
    for (let i = 0; i < 50; i++) {
      this.confetti.push({
        left: Math.random() * 100,
        animationDelay: `${Math.random() * 0.5}s`,
        color: this.getRandomColor(),
        rotation: Math.random() * 360
      });
    }

    // REDUCED: Generate emojis (15 instead of 30)
    const funnyEmojis = ['😂', '🤪', '🥳', '🎉', '🎊', '🎈', '🍰', '🎁', '👵', '🤡', '💩', '🙈', '🤓', '😎'];
    for (let i = 0; i < 15; i++) {
      this.emojis.push({
        emoji: funnyEmojis[Math.floor(Math.random() * funnyEmojis.length)],
        left: Math.random() * 100,
        animationDelay: `${Math.random() * 2}s`
      });
    }

    setTimeout(() => {
      this.showName = true;
    }, 1000);

    setTimeout(() => {
      this.showMessage = true;
      this.typeMessage();
    }, 1000);
  }

  typeMessage() {
    let index = 0;
    const chunkSize = 3; // Type 3 characters at a time for smoother appearance
    const interval = setInterval(() => {
      if (index < this.personalMessage.length) {
        // Add multiple characters at once
        const endIndex = Math.min(index + chunkSize, this.personalMessage.length);
        this.displayedMessage += this.personalMessage.substring(index, endIndex);
        index = endIndex;
      } else {
        clearInterval(interval);
      }
    }, 50); // Increased from 1ms to 20ms - much faster overall
  }

  getRandomColor(): string {
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#00d2ff', '#a29bfe', '#fd79a8', '#00b894', '#6c5ce7'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  isBirthdayToday(): boolean {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();

    return month === 10 && day === 26;
  }
}
