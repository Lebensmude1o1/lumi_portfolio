import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  email = 'sadikshashrestha9@gmail.com';
  linkedinUrl = 'https://www.linkedin.com/in/progress-maharjan-641747286/'; // Replace with your LinkedIn URL
  instagramUrl = 'https://www.instagram.com/__sadiksha____/?hl=en'; // Replace with your Instagram URL
  facebookUrl = 'https://www.facebook.com/sadikshya.shrestha.501'; // Replace with your Facebook URL
}
