import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { FirebaseService } from '../services/firebase.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  firebaseUserInfo;
  constructor(public afAuth: AngularFireAuth, public router: Router, public firebase: FirebaseService, public database: AngularFireDatabase) {
    
  }

  ngOnInit() {
    if(localStorage.getItem('FIREBASE_DATA')){
      this.router.navigate(['search']); 
    }
  }

  login() {
    let _this = this;
    let userdata;
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(function(data){
      console.log(data);
      _this.firebase.FIREBASE_AUTH_DATA = data;
      localStorage.setItem('FIREBASE_DATA', JSON.stringify(data));
      _this.firebase.getFirebaseGoogleDataFromLocalStorage();
      _this.router.navigate(['search']); 
      _this.firebaseUserInfo = _this.database.list('users');
      userdata = [{
        name: data.user.displayName,
        uid: data.user.uid,
        assigned_list: localStorage.getItem('accountID'),
        locate: data.additionalUserInfo.profile.locale,
        gender: data.additionalUserInfo.profile.gender
      }]
      _this.firebaseUserInfo.update(userdata[0].uid, userdata).then(function (this, results) {
        console.log(results)
      });
  
    });
  }

}
