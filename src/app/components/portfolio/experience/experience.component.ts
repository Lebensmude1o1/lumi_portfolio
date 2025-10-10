import {Component, Input, OnInit} from '@angular/core';
import {JobExperienceDTO} from "../../../model/api-responses";
import {CommonModule} from "@angular/common";
import {ImageService} from "../../../services/image/image.service";
import {Model3dService} from "../../../services/3d/model3d.service";

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit{
  @Input() experience!: JobExperienceDTO;
  showDetails = false;

  constructor(private imageService: ImageService, private modelService: Model3dService) {}

  ngOnInit(): void {
    if (this.experience.photos && this.experience.photos.length > 0) {
      this.experience.photos.sort((a, b) => a.displayOrder - b.displayOrder);
    }
  }

  getBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      internship: 'badge-internship',
      academic: 'badge-academic',
      freelance: 'badge-freelance',
      training: 'badge-training',
      project: 'badge-academic',
      'full-time': 'badge-fulltime'
    };
    return classes[type] || 'badge-internship';
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  openImage(url: string): void {
    this.imageService.open(url);
  }

  show3DModel(extraElement: string) {
    this.modelService.open(extraElement);
  }
}
