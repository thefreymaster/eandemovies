import { Injectable, Optional } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DataTransferService } from './data-transfer.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UNIQUE_SELECTION_DISPATCHER_PROVIDER } from '@angular/cdk/collections';

@Injectable()
export class FirebaseService {
  searchObject = {
    title: '',
    year: ''
  }
  accountID;
  changingID = false;
  sortedAlpha;
  sortedRatingDecending;
  oldAccountID;
  currentVersion = '2.03'
  FIREBASE_AUTH_DATA = {};

  listnames = ['cinema', 'movie', 'film', 'theater', 'camera', 'hollywood', 'popcorn', 'candy', 'megaplex', 'imax', 'premiere', 'motion', 'frame', 'flick', 'animation', 'projector', 'release', 'screen', 'reel', 'still', 'storyboard', 'screenplay', 'studio', 'stunt', 'star', 'lead', 'actor', 'actress', 'director', 'producer', 'nacho', 'boxoffice', 'dialog', 'script', 'cinematic', 'cast', 'lights', 'scene', 'outtake', 'filmstar', 'remake', 'trilogy', 'sequel', 'butter', 'light', 'bulb', 'ticket', 'stub', 'que', 'lens', 'preview', 'genres', 'documentary', 'drama', 'comedy', 'horror'];



  moviesObject = {
    loading: true,
    firebaseMoviesRef: {},
    firebaseRef: {},
    firebaseMovies: {},
    localMovies: [],
    account: { id: localStorage.getItem('accountID') }
  }
  tempmoviesObject = {
    loading: true,
    firebaseMoviesRef: {},
    firebaseRef: {},
    firebaseMovies: {},
    localMovies: [],
    account: { id: localStorage.getItem('accountID') }
  }
  items: Observable<any[]>;
  localRouter;

  constructor(public db: AngularFireDatabase, public service: DataTransferService, public http: HttpClient, public router: Router) {
    this.localRouter = router;
    this.setAccountID();
    this.getFirebaseGoogleDataFromLocalStorage();

    this.moviesObject.firebaseRef = db.list('accounts');
    this.items = db.list('accounts/' + this.accountID).valueChanges();
    this.items.subscribe(items => {
      this.moviesObject.localMovies = [];

      if(items[0].data.Rated != undefined){
        console.log('V1.0 data found');
        this.oldAccountID = localStorage.getItem('accountID');
        localStorage.removeItem('accountID');   
        this.setAccountID();   
        this.router.navigate(['convert']); 
        items.forEach(movie => {
          this.convert(movie.data);       
        });
        setTimeout(() => {
          location.reload();
        }, 30000);
      }
      else{
        items.forEach(item => {
          this.moviesObject.localMovies.push(item);       
        });
        this.moviesObject.loading = false;
        // console.log(this.moviesObject);
      }
    });
  }
  firebaseAccountData = {
    user_name: '',
    user_photo: '',
    uid: ''
  };
  firebaseAccountLocalStorage


  updateUserDataInFirebase(newID){
    var firebaseUserInfo = this.db.list('users');
    var newFirebaseUserData;
    var uid = this.firebaseAccountData.uid
    var oldFirebaseUserInfo = this.db.list('users/' + this.firebaseAccountData.uid).valueChanges();
    oldFirebaseUserInfo.subscribe(items => {
      items[0]['assigned_list'] = newID
      newFirebaseUserData = items;
      firebaseUserInfo.update(uid, newFirebaseUserData).then(function (this, results) {
        console.log(results)
      });
    })

  }

  getFirebaseGoogleDataFromLocalStorage(){
    if(localStorage.getItem('FIREBASE_DATA')){
      this.firebaseAccountLocalStorage = localStorage.getItem('FIREBASE_DATA')
      this.firebaseAccountLocalStorage = JSON.parse(this.firebaseAccountLocalStorage);
      this.firebaseAccountData = {
        user_name: this.firebaseAccountLocalStorage.user.displayName,
        user_photo: this.firebaseAccountLocalStorage.user.photoURL,
        uid: this.firebaseAccountLocalStorage.user.uid
      };
    }
  }


  convert(movie){
      var replaced = movie.Title.split(' ').join('%20');
      this.moviesObject.localMovies;
      setTimeout(() => {
        this.http.get('/api/movie_data/:' + movie.Year + '/:' + replaced).subscribe(data => {
          this.addConvertedMovie(data);
        });
      }, 500);
  
  }
  addConvertedMovie(this, movie) {
    this.service.currentlyRegistering = false;
    this.searchObject = {
      title: '',
      year: ''
    }
    this.service.movies = [];
    this.moviesObject.localMovies.push({ data: movie.results[0], metrics: { watched: false } });

    this.moviesObject.firebaseRef.update(this.accountID, this.moviesObject.localMovies).then(function (this, results) {

    });
  }



  addMovie(this, movie, scrollOverride:Optional, convert:Optional) {
    this.service.currentlyRegistering = false;
    this.searchObject = {
      title: '',
      year: ''
    }
    this.service.movies = [];
    this.moviesObject.localMovies.push({ data: movie, metrics: { watched: false } });

    this.moviesObject.firebaseRef.update(this.accountID, this.moviesObject.localMovies).then(function (this, results) {
    });


    this.service.movieAdded(movie);


    if (this.moviesObject.localMovies.length > 0 && convert === false) {
      this.localRouter.navigate(['movies']);

    }
    if(scrollOverride === true)
    {
      this.service.perviousScrollY = 10000;
      if(this.localRouter.url === '/movies'){
        setTimeout(() => {
          window.scrollBy({
            top: this.service.perviousScrollY,
            left: 0,
            behavior: 'smooth'
          });
        }, 500);
      }
    }

    

  }

  updateMovie(this, movie) {
    for (let j = 0; j < this.moviesObject.localMovies.length; j++) {
      if (movie.data.imdbID == this.moviesObject.localMovies[j].data.imdbID) {
        this.moviesObject.localMovies[j] = movie;
        // this.moviesObject.localMovies.push(movie);
        this.moviesObject.firebaseRef.update(this.accountID, this.moviesObject.localMovies).then(function (results) {
          // console.log(results);
          if (this.moviesObject.localMovies.length > 0) {
            this.router.navigate(['movies']);
          }
        });
      }
    }
  }
  removeMovie(this, movie) {
    for (let k = 0; k < this.moviesObject.localMovies.length; k++) {
      if (movie.data.imdbID == this.moviesObject.localMovies[k].data.imdbID) {
        this.moviesObject.localMovies.splice(k, 1);
        debugger;
        this.moviesObject.firebaseRef.remove('account/' + this.moviesObject.account.id + '/' + k).then(function (results) {
          // console.log(results);
        });
      }
    }
  }

  setAccountID() {
    this.accountID = localStorage.getItem('accountID');
    if (this.accountID == null) {
      let randomNum = Math.floor(56) * Math.random();
      randomNum = Math.round(randomNum);
      this.accountID = Math.random()*100000;
      this.accountID = Math.floor(this.accountID);
      this.accountID = Math.round(this.accountID);

      this.accountID = this.listnames[randomNum] + this.accountID;
      localStorage.setItem('accountID', this.accountID);
    }
    console.log(this.accountID);

  }

  sortRating(this){
    if(this.sortedAlpha == true || this.sortedAlpha == false)
    {
      this.sortedAlpha = null;
    }

    if(this.sortedRatingDecending = null || this.sortedRatingDecending == false){
      this.sortedRatingDecending = true;
      this.moviesObject.localMovies.reverse(function (c, d) {
        var ratingA = c.data.imdbRating, ratingB = d.data.imdbRating
        if (ratingA < ratingB) //sort string ascending
          return -1
        if (ratingA > ratingB)
          return 1
        return 0 //default return value (no sorting)
      })
      this.moviesObject.firebaseRef.update(this.accountID, this.moviesObject.localMovies)
      console.log(this.moviesObject.localMovies)
    }
    else{
      this.sortedRatingDecending = false;
      this.moviesObject.localMovies.sort(function (a, b) {
        var ratingA = a.data.imdbRating, ratingB = b.data.imdbRating
        if (ratingA < ratingB) //sort string ascending
          return -1
        if (ratingA > ratingB)
          return 1
        return 0 //default return value (no sorting)
      })
      this.moviesObject.firebaseRef.update(this.accountID, this.moviesObject.localMovies)
      console.log(this.moviesObject.localMovies)

    }
  }

  sortAlphabetical(this) {

    if(this.sortedRatingDecending == true || this.sortedRatingDecending == false)
    {
      this.sortedRatingDecending = null;
    }

    if(this.sortedAlpha = null || this.sortedAlpha == false){
      this.sortedAlpha = true;
      this.moviesObject.localMovies.reverse(function (a, b) {
        var nameA = a.data.Title.toLowerCase(), nameB = b.data.Title.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      })
      this.moviesObject.firebaseRef.update(this.accountID, this.moviesObject.localMovies)
      console.log(this.moviesObject.localMovies)

    }
    else{
      this.sortedAlpha = false;
      this.moviesObject.localMovies.sort(function (a, b) {
        var nameA = a.data.Title.toLowerCase(), nameB = b.data.Title.toLowerCase()
        if (nameA < nameB) //sort string ascending
          return -1
        if (nameA > nameB)
          return 1
        return 0 //default return value (no sorting)
      })
      this.moviesObject.firebaseRef.update(this.accountID, this.moviesObject.localMovies)
      console.log(this.moviesObject.localMovies)

    }

  }

  sortAntiAlphabetical() {

  }


  ngAfterViewInit() {

  }
  ngOnInit() {

  }

}
