import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {environment} from "../../../../environments/environment";
import {DarkModeToggleComponent} from "../../shared/dark-mode-toggle/dark-mode-toggle.component";

@Component({
  selector: 'app-public-navigation',
  standalone: true,
  imports: [CommonModule, DarkModeToggleComponent],
  templateUrl: './public-navigation.component.html',
  styleUrls: ['./public-navigation.component.scss']
})
export class PublicNavigationComponent {
  @Input() isChatOpen: boolean = false;
  name: string = environment.username;
  isMenuOpen = false;
  private readonly redirectUrl: string = "https://progress.com.np/admin/viewExperience";

  constructor() {}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  scrollTo(section: string): void {
    if (this.isMenuOpen) {
      this.toggleMenu();
    }
    // Timeout to allow menu to start closing before scroll
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  openRedirect() {
    // Open the URL in a new tab
    window.open(this.redirectUrl, '_blank');
  }
}
