import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent implements OnInit {

  constructor(public firebase: FirebaseService, public database: AngularFireDatabase) {

   }

  newAccountID: string;
  firebaseAccountData;

  ngOnInit() {
    
    
  }
  changeAccountID(newID){
    this.firebase.changingID = true;
    this.firebase.updateUserDataInFirebase(newID);
    localStorage.setItem('accountID', newID);
    setTimeout(() => {
      location.reload();
    }, 200);
  }

  keydownSubmit(event, newID){
    if(event.keyCode == 13) {
      this.firebase.changingID = true;
    
      localStorage.setItem('accountID', newID);
      setTimeout(() => {
        location.reload();
      }, 200);
    }
  }
}
