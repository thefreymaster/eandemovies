import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable()
export class DataTransferService {

  movies = [];
  currentBigScreenObject = {
    data: {},
    metrics: {
      watched: {}
    }
  };
  checked = false;
  error = false;
  firstSearch = false;
  currentlyRegistering = false;
  amazonItems = '';
  bigScreenIndex: number;


  loadingBigScreenItem = false;
  perviousScrollY = 0;
  movieListShowFrame: string;
  appOpenLogged: boolean = false;
  movieSearchCollection: object;
  amazonItemsFound: boolean = false;



  nav_bar_items = [{
    icon: '&#xE838;',
    title: '',
    url: '',
    tooltip: 'Sort By Rating',
    functionToCall: 'firebase.sortRating()',
    tagType: 'button'
  },{
    icon: '&#xE053;',
    title: '',
    url: '',
    tooltip: 'Alphabetical',
    functionToCall: 'firebase.sortAlphabetical()',
    tagType: 'button'
  }]
  

  constructor(private http: HttpClient, private router: Router) { 
    if(! this.movies){
      this.movies = []
    }
    if(localStorage.getItem('movieListShowFrame') == null)
    {
      localStorage.setItem('movieListShowFrame', 'true');
      this.movieListShowFrame = 'true';
    }
    else{
      this.movieListShowFrame = localStorage.getItem('movieListShowFrame');
    }
  }

  getMovieData(title, year){
  }

  toggleListFrame(){
    if(this.movieListShowFrame === 'true')
    {
      this.movieListShowFrame = 'false';
      localStorage.setItem('movieListShowFrame', 'false');
    }
    else{
      this.movieListShowFrame = 'true';
      localStorage.setItem('movieListShowFrame', 'true');
    }
  }

  getMovies(){
    return this.movies;
  }

  search(title, year) {
    this.movies = [];
    var replaced = title.split(' ').join('%20');
    this.http.get('/api/movie_data/:' + year + '/:' + replaced).subscribe(data => {
      // Read the result field from the JSON response.
        
      //  this.movies.push(data);
      this.movieSearchCollection = data;
      // console.log(this.movieSearchCollection)
      this.showOneSearch(this.movieSearchCollection);
    });

  }

  getDetailedMovieData(movie, index){
    this.http.get('/api/detailed_movie_data/' + movie.data.id).subscribe(data => {
      // console.log(data);
      this.currentBigScreenObject.data = data;
      this.currentBigScreenObject.metrics.watched = movie.metrics.watched;
      // console.log(data)
      this.movieClicked(data);
      this.getAmazonData(data);
    })
  }

  showOneSearch(movieCollection){
    this.movies.push(movieCollection.results[0]);
    // console.log(this.movies);
  }

  getAmazonData(movie){
    this.amazonItems = '';
    this.amazonItemsFound = false;
    var replaced = movie.title.split(' ').join('+');
    
    this.http.get('/api/amazon_data/:' + movie.year + '/:'  + replaced).subscribe(data => {
      // Read the result field from the JSON response.
       this.amazonItems = data[0].DetailPageURL[0];
       this.amazonItemsFound = true;
    },
    error => {
      this.amazonItemsFound = false;
      console.log(error);
    })
  }
  movieClicked(movie){
    this.http.post('/api/gather/movie_clicked', movie).subscribe(data => {
    })
  }
  movieAdded(movie){
    this.http.post('/api/gather/movie_added', movie).subscribe(data => {
    })
  }
  appOpened(){
    var appObject = {
      user: localStorage.getItem('accountID'),
      user_properties: {
        platform: navigator.platform,
        vendor: navigator.vendor,
        product: navigator.product
      }
    }
    this.http.post('/api/gather/app', appObject).subscribe(data => {
    })
  }

  acquision(movie){
    var acquision = {
      acquision: true,
      movie: movie,
      user: localStorage.getItem('accountID')   
    }
    this.http.post('/api/gather/acquision', acquision).subscribe(data => {
    })
  }
  first(movie){
    var first = {
      first_movie: movie.Title,
      user: localStorage.getItem('accountID')   
    }
    this.http.post('/api/gather/first', first).subscribe(data => {
    })
  }



  
}
