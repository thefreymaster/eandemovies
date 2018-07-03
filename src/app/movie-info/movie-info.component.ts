import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../services/data-transfer.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { MediaService } from '../services/media.service';
import { slideInOutAnimation } from '../_animations/slide.animation';



@Component({
  selector: 'app-movie-info',
  animations: [slideInOutAnimation],
  templateUrl: './movie-info.component.html',
  styleUrls: ['./movie-info.component.css']
})
export class MovieInfoComponent implements OnInit {


  constructor(public service: DataTransferService, router: Router, public firebase: FirebaseService, public mediaService: MediaService) {
    this.checkRoute(router);
    console.log(router.url);

  }


  above = 'above';
  position = 'below';

  ngOnInit() {
    
    document.getElementById('body').className = 'no-scroll';
  }
  checkRoute(router){
    if(this.service.currentBigScreenObject == undefined) {
      router.navigate(['movies']);
    }
  }

  openAmazonPage(){
    window.open(this.service.amazonItems);
  }
  radioChange(event, movie) {
    console.log(event);
    console.log(movie);
    if(event.value == "true")
    {
      movie.metrics.watched = true;
    }
    else{
      movie.metrics.watched = false;
    }
    this.firebase.updateMovie(movie);
}


}
