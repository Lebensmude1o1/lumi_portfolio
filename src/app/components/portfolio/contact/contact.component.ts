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
  email = 'lumantimaharjan0312@gmail.com';
  linkedinUrl = 'https://www.linkedin.com/in/justin-seagull-4282b8314/'; // Replace with your LinkedIn URL
  instagramUrl = 'https://www.instagram.com/crystal_snow.01/?hl=en'; // Replace with your Instagram URL
  facebookUrl = 'https://www.facebook.com/laira.maharjan.106'; // Replace with your Facebook URL
}
