import {Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {finalize, Subscription} from "rxjs";
import {ExperienceService, STATIC_JOB_DATA} from "../../../services/experience/experience.service";
import {JobExperienceDTO, ResponseStatus} from "../../../model/api-responses";
import {environment} from "../../../../environments/environment";
import {PublicNavigationComponent} from "../public-navigation/public-navigation.component";
import {CommonModule} from "@angular/common";
import {ExperienceComponent} from "../experience/experience.component";
import {ContactComponent} from "../contact/contact.component";
import {SnackbarService} from "../../../services/snackbar.service";
import {HttpErrorResponse} from "@angular/common/http";
import {ChatComponent} from "../chat-bot/chat/chat.component";
import {MatIcon} from "@angular/material/icon";
import {CdkDrag, CdkDragEnd} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-base-portfolio',
  standalone: true,
  imports: [
    PublicNavigationComponent,
    CommonModule,
    ExperienceComponent,
    ContactComponent,
    ChatComponent,
    MatIcon,
    CdkDrag
  ],
  templateUrl: './base-portfolio.component.html',
  styleUrl: './base-portfolio.component.scss'
})
export class BasePortfolioComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  experiences: JobExperienceDTO[] = [];
  isLoadingExperiences = true;
  username = environment.username;
  heroBgImage = 'backgroundHorizontal.webp';
  today = new Date();
  isChatOpen = false;

  // Store the drag position
  dragPosition = {x: 0, y: 0};

  @ViewChild('heroBg', { static: true }) heroBg!: ElementRef;

  constructor(private experienceService: ExperienceService,
              private snackbarService: SnackbarService,
              private renderer: Renderer2) {
    this.setHeroBackground();
  }

  ngOnInit(): void {
    this.loadExperiences();
  }

  toggleChat(isOpen: boolean) {
    this.isChatOpen = isOpen;
  }

  onDragStarted() {
    // Optional: Add any drag start logic
  }

  onDragEnded(event: CdkDragEnd) {
    this.dragPosition = event.source.getFreeDragPosition();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.setHeroBackground();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollY = window.scrollY;
    this.renderer.setStyle(this.heroBg.nativeElement, 'transform', `translateY(${scrollY * 0.3}px)`);
  }

  private setHeroBackground(): void {
    if (window.innerWidth > window.innerHeight) {
      this.heroBgImage = 'backgroundHorizontal.webp';
    } else {
      this.heroBgImage = 'backgroundVertical.webp';
    }
  }

  private loadExperiences(): void {
    this.isLoadingExperiences = true;
    this.subscriptions.add(this.experienceService.getExperience().pipe(
      finalize(() => this.isLoadingExperiences = false)
    ).subscribe({
      next: (response) => {
        if (response.status === ResponseStatus.SUCCESS && response.details) {
          this.experiences = response.details.sort((a, b) => a.displayOrder - b.displayOrder);
        } else {
          this.experiences = [...STATIC_JOB_DATA].sort((a, b) => a.displayOrder - b.displayOrder);
          this.snackbarService.show(response.message || 'Failed to load experiences. Displaying static data.', 'info');
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading experiences:', err);
        this.snackbarService.show('Could not connect to server. Displaying static data.', 'error');
        this.experiences = [...STATIC_JOB_DATA].sort((a, b) => a.displayOrder - b.displayOrder);
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
