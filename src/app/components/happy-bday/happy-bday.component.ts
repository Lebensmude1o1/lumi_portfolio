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
        animate('1000ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('bounce', [
      transition(':enter', [
        animate('2s ease-in-out', keyframes([
          style({ transform: 'translateY(-100vh)', offset: 0 }),
          style({ transform: 'translateY(0)', offset: 0.7 }),
          style({ transform: 'translateY(-20px)', offset: 0.85 }),
          style({ transform: 'translateY(0)', offset: 1 })
        ]))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100vh)', opacity: 0 }),
        animate('1500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
          style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class HappyBdayComponent implements OnInit {
  // 🎉 PUT YOUR PERSONAL MESSAGE HERE 🎉
  personalMessage = `Dear Lumanti, Kindly Go Fuck OFF`;

  // Animation control
  showName = false;
  showMessage = false;
  displayedMessage = '';
  confetti: Array<{left: number, animationDelay: string, color: string}> = [];
  balloons: Array<{left: number, animationDelay: string, color: string}> = [];
  hearts: Array<{left: number, animationDelay: string}> = [];

  constructor(private router: Router,
              private snackbarService : SnackbarService) {}

  ngOnInit() {
    // Check if today is November 26th
    if (!this.isBirthdayToday()) {
      this.snackbarService.show('today is not the day','error',5);
      this.router.navigate(['/portfolio']).catch(
        err => {
          this.snackbarService.show("Theres Been An Error Navigating to Portfolio. Check Console Logs",'error',5);
          console.error(err);
        }
      );
      return;
    }

    // Generate confetti
    for (let i = 0; i < 50; i++) {
      this.confetti.push({
        left: Math.random() * 100,
        animationDelay: `${Math.random() * 3}s`,
        color: this.getRandomColor()
      });
    }

    // Generate balloons
    const balloonColors = ['#ff6b9d', '#c44569', '#f8b500', '#00d2ff', '#a29bfe'];
    for (let i = 0; i < 8; i++) {
      this.balloons.push({
        left: (i * 12) + 5,
        animationDelay: `${i * 0.2}s`,
        color: balloonColors[i % balloonColors.length]
      });
    }

    // Generate hearts
    for (let i = 0; i < 20; i++) {
      this.hearts.push({
        left: Math.random() * 100,
        animationDelay: `${Math.random() * 5}s`
      });
    }

    // Animation sequence
    setTimeout(() => {
      this.showName = true;
    }, 1000);

    setTimeout(() => {
      this.showMessage = true;
      this.typeMessage();
    }, 4000);
  }

  typeMessage() {
    let index = 0;
    const interval = setInterval(() => {
      if (index < this.personalMessage.length) {
        this.displayedMessage += this.personalMessage[index];
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
  }

  getRandomColor(): string {
    const colors = ['#ff6b9d', '#c44569', '#f8b500', '#00d2ff', '#a29bfe', '#fd79a8'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  isBirthdayToday(): boolean {
    const today = new Date();
    const month = today.getMonth(); // 0-indexed (0 = January, 10 = November)
    const day = today.getDate();

    // Check if it's November 26th (month = 10, day = 26)
    return month === 10 && day === 26;
  }
}
