
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { DataTransferService } from '../services/data-transfer.service';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(router: Router, private firebase: FirebaseService, private service: DataTransferService) { 

  }

  newAccountID: string;


  keydownSubmit(this, event, newAccountID){
    if(event.keyCode == 13) {
      this.changeAccountID(newAccountID)
    }
  }
  changeAccountID(newID){
    this.service.firstSearch = true;
    localStorage.setItem('accountID', newID);
    this.firebase.accountID = newID;
    // setTimeout(() => {
    //   location.reload();
    // }, 200);
  }

}

