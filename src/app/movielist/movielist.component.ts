import { Component, OnInit } from '@angular/core';
import { DataTransferService } from '../services/data-transfer.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { MediaService } from '../services/media.service';
import { FirebaseService } from '../services/firebase.service';
import { SearchPipe } from '../pipes/search.pipe';
import { slideInOutAnimation } from '../_animations/slide.animation';
import { Router } from '@angular/router';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-movielist',
  animations: [slideInOutAnimation],
  templateUrl: './movielist.component.html',
  styleUrls: ['./movielist.component.css']
})
export class MovielistComponent implements OnInit {

  queryString = '';

  moviesObject = {
    firebaseMoviesRef: {},
    firebaseRef: {},
    firebaseMovies: {},
    localMovies: [],
    account: { id: this.firebase.accountID }
  }

  checked = true;
  //not watched
  changeWatchedSwitch(event) {
    this.service.checked = event.checked;
  }





  position = 'below';


  items: Observable<any[]>;
  constructor(db: AngularFireDatabase, public service: DataTransferService, public mediaService: MediaService, public firebase: FirebaseService, public router: Router) {
    if (localStorage.getItem('uid')) {
      this.moviesObject.firebaseRef = db.list('account');
      this.items = db.list('accounts/' + localStorage.getItem('accountID')).valueChanges();
      this.items.subscribe(items => {
        // items is an array
        this.moviesObject.localMovies = [];
        items.forEach(item => {

          this.moviesObject.localMovies.push(item);
        });
        // console.log(items);
        if (this.moviesObject.localMovies.length == 0) {
          this.service.currentlyRegistering = true;
          // router.navigate(['login']);
        }

      });
      this.firebase.moviesObject.loading = false;

      setTimeout(() => {
        window.scrollBy({
          top: this.service.perviousScrollY,
          left: 0,
          behavior: 'smooth'
        });
      }, 500);
      if (!this.service.appOpenLogged) {
        this.service.appOpened();
        this.service.appOpenLogged = true;
      }
    }
    else{
      this.router.navigate(['login']);
    }



  }
  // updateMovie(this, movie, items) {
  //   this.moviesObject.localMovies.push(movie);
  //   this.moviesObject.firebaseRef.update(this.moviesObject.account.id, this.moviesObject.localMovies).then(function (results) {

  //   });

  // }

  setBigScreenObject(movie, index) {
    this.service.loadingBigScreenItem = true;
    this.service.perviousScrollY = window.scrollY;
    this.service.getDetailedMovieData(movie, index);
    // this.service.currentBigScreenObject = movie;



    setTimeout(() => {
      this.service.loadingBigScreenItem = false;
    }, 600);



  }





  ngAfterViewInit() {

  }
  ngOnInit() {
    document.getElementById('body').className = ''
  }


}


