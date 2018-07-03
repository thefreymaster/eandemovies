import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MediaService } from './services/media.service';
import { DataTransferService } from './services/data-transfer.service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { FirebaseService } from './services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  getRouteAnimation(outlet) {
    return outlet.activatedRouteData.animation
  }

  firebaseAccountLocalStorage;
  firebaseAccountDataPopulated = false;
  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics, public mediaService: MediaService, public service: DataTransferService, public firebase: FirebaseService, public router: Router) {

  }
  ngOnInit(){

  }

  position: any = 'below';

  changeWatchedSwitch() {
    if(this.service.checked == false)
    {
      this.service.checked = true;
    }
    else{
      this.service.checked = false;
    }
  }
  scrollToTop(){
    window.scrollBy({ 
      top: -50000, // could be negative value
      left: 0, 
      behavior: 'smooth' 
    });
  }

}
