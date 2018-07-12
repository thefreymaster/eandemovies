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
  items;
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
      
      if(localStorage.getItem('uid') ===  null)
      {
        localStorage.setItem('uid', data.user.uid);
      }
      _this.items = _this.database.list('users/' + data.user.uid).valueChanges();
      _this.items.subscribe(items => {
        console.log(items);
        //user does NOT exist in database
        if(items.length === 0 && localStorage.getItem('FIRST_TIME') != 'true')
        {
          _this.firebaseUserInfo = _this.database.list('users');
          let assigned_list = _this.firebase.setAccountID();
          userdata = [{
            name: data.user.displayName,
            email: data.user.email,
            uid: data.user.uid,
            assigned_list: assigned_list,
            locate: data.additionalUserInfo.profile.locale,
            gender: data.additionalUserInfo.profile.gender,
            photo: data.user.photoURL
          }]
          _this.firebaseUserInfo.update(userdata[0].uid, userdata)
          localStorage.setItem('FIRST_TIME', 'true');
          localStorage.setItem('accountID', assigned_list);

          _this.router.navigate(['search']); 
        }
        else{
          localStorage.setItem('accountID', items[0].assigned_list);
          localStorage.setItem('uid', items[0].uid);
          
          if(localStorage.getItem('FIRST_TIME') === 'true')
          {
            _this.router.navigate(['search']); 
          }
          else{
            localStorage.setItem('FIRST_TIME', 'false');
            _this.firebase.accountID = items[0].assigned_list;
            _this.firebase.items = _this.database.list('accounts/' + localStorage.getItem('accountID')).valueChanges();
            _this.firebase.items.subscribe(items => {
              _this.firebase.moviesObject.localMovies = [];
                items.forEach(item => {
                  _this.firebase.moviesObject.localMovies.push(item);       
                });
                if(_this.firebase.moviesObject.localMovies.length === 0)
                {
                  _this.router.navigate(['search']); 
                }
            });
            _this.router.navigate(['movies']); 
          }

          // location.reload();
          
        }
      })
      console.log(_this.items);

  
    });
  }

}
