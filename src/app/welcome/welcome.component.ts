import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(public dialog: MatDialog, public router: Router) {
    // const dialog = new MDCDialog(document.querySelector('#my-mdc-dialog'));
  }


  goToSearch(){

    this.router.navigate(['welcome/search']);
    document.getElementsByTagName('app-welcome')[0].remove();
  }



  ngOnInit() {
  }

}

