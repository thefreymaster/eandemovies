
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { DataTransferService } from '../services/data-transfer.service';



@Component({
  selector: 'app-retrieve',
  templateUrl: './retrieve.component.html',
  styleUrls: ['./retrieve.component.css']
})
export class RetrieveComponent {

  changingIDs = false;
  constructor(router: Router, public firebase: FirebaseService, public service: DataTransferService) { 

  }
  newAccountID: string;
  
  keydownSubmit(this, event, newAccountID){
    if(event.keyCode == 13) {
      this.changeAccountID(newAccountID)
    }
  }

  changeAccountID(newID){
    this.changingIDs = true;
    this.service.firstSearch = true;
    this.firebase.updateUserDataInFirebase(newID);
    localStorage.setItem('accountID', newID);
    this.firebase.accountID = newID;
    setTimeout(() => {
      location.reload();
    }, 200);
  }

}

