import { Component, OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from '@angular/common/http';
import {DataTransferService} from '../services/data-transfer.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';
import {MatSidenavModule, MatSidenav} from '@angular/material/sidenav';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

  disableSearch = false;

  items: Observable<any[]>;
  localRouter;
  constructor(public service: DataTransferService, public firebase: FirebaseService, db: AngularFireDatabase, router: Router) {
    this.localRouter = router;

  }

  keydownSubmit(this, event){
    if(event.keyCode == 13) {
      console.log('enter pressed')

      
      this.service.search(this.firebase.searchObject.title, this.firebase.searchObject.year);

    }
  }

  search(this, title, year){
    this.service.search(title, year);
  }

  clear(){
    this.disableSearch = false;
    this.firebase.searchObject.title = '';
    this.firebase.searchObject.year = '';
    this.service.movies = [];
  }
  change(){
    this.disableSearch = false;
  }
  

  ngOnInit() {
    
  }



}
