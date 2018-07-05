

import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { DataTransferService } from '../services/data-transfer.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  searchItemDisplayed = false;
  constructor(public router: Router, public firebase: FirebaseService, public service: DataTransferService) { 

  }
  ngOnInit() {
    if(localStorage.getItem('FIRST_TIME') === 'false'){
      this.router.navigate(['movies']); 
    }
  }


  keydownSubmit(this, event){
    if(event.keyCode == 13) {
      console.log('enter pressed'); 
      this.searchItemDisplayed = true;   
      this.service.search(this.firebase.searchObject.title, this.firebase.searchObject.year);
    }
  }


  search(this, title, year){
    this.searchItemDisplayed = true;
    this.service.search(title, year);
  }




}

