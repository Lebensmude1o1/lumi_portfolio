import { Component } from '@angular/core';
import {SnackbarService} from "../../../services/snackbar.service";
import {ImageService} from "../../../services/image/image.service";
import {Model3dService} from "../../../services/3d/model3d.service";
import {Subscription} from "rxjs";
import {ExperienceService} from "../../../services/experience/experience.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-base-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './base-portfolio.component.html',
  styleUrl: './base-portfolio.component.scss'
})
export class BasePortfolioComponent {

  private subscriptions= new Subscription();
  constructor(private snackbarService: SnackbarService,
              private imageService:ImageService,
              private modelService: Model3dService,
              private experienceService: ExperienceService) {
  }

  onPress(){
    this.snackbarService.show("this is just a test", "info");
  }

  onImage() {
    this.imageService.open("https://progress.com.np/portfolioBackground.webp");
  }


  on3Dmodel() {
    this.modelService.open("https://test.ismart.devanasoft.com.np/ismart/bankApps/RadhaOliResidency2/b120b2a265e74d02b7c0517252b1c78f_opt.glb");
  }

  onLoadExp(){
    this.subscriptions.add(
      this.experienceService.getExperience().subscribe({
        next:(response) => {
          console.log(response);
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err);
        }
      })
    )
  }
}
