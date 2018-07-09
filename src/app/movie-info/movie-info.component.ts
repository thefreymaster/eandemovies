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

  openAmazonPage(movie_title){
    // let amazon_link = 'https://www.amazon.com/gp/product/B00C1BV9Z6/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00C1BV9Z6&linkCode=as2&tag=canvas23studios-20&linkId=9b494a6cc9e43125ee3c333820b2e34d'
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
