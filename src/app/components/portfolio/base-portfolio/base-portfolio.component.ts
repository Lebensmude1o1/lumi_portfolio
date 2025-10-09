import { Component } from '@angular/core';
import {SnackbarService} from "../../../services/snackbar.service";
import {ImageService} from "../../../services/image/image.service";
import {Model3dService} from "../../../services/3d/model3d.service";

@Component({
  selector: 'app-base-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './base-portfolio.component.html',
  styleUrl: './base-portfolio.component.scss'
})
export class BasePortfolioComponent {
  constructor(private snackbarService: SnackbarService,private imageService:ImageService,private modelService: Model3dService) {
  }

  onPress(){
    this.snackbarService.show("this is just a test", "success");
  }

  onImage() {
    this.imageService.open("https://progress.com.np/portfolioBackground.webp");
  }


  on3Dmodel() {
    this.modelService.open("https://test.ismart.devanasoft.com.np/ismart/bankApps/RadhaOliResidency2/b120b2a265e74d02b7c0517252b1c78f_opt.glb");
  }
}
