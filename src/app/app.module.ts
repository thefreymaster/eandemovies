import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DataTransferService } from '../app/services/data-transfer.service'
import { FirebaseService } from './services/firebase.service';
import { MediaService } from './services/media.service';
import { ConversionService } from './services/conversion.service';

//Angular Analytics
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';


//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from 'angularfire2/database';


//Angular Material Modules
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MovielistComponent } from './movielist/movielist.component';
import { MovieInfoComponent } from './movie-info/movie-info.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AccountInfoComponent } from './account-info/account-info.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SearchPipe } from '../app/pipes/search.pipe';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { RetrieveComponent } from './retrieve/retrieve.component';
import { ErrorComponent } from './error/error.component';
import { ConvertComponent } from './convert/convert.component';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
  { path: 'movies', component: MovielistComponent},
  { path: 'login', component: LoginComponent},
  { path: 'convert', component: ConvertComponent},  
  { path: 'search', component: SearchComponent},
  { path: 'search/retrieve', component: RetrieveComponent},
  { path: 'movies/info', component: MovieInfoComponent},
  { path: 'error', component: ErrorComponent},
  { path: '', redirectTo: '/movies', pathMatch: 'full'}
  

];


@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MovielistComponent,
    SidenavComponent,
    MovieInfoComponent,
    AccountInfoComponent,
    WelcomeComponent,
    SearchPipe,
    RegisterComponent,
    SearchComponent,
    RetrieveComponent,
    ErrorComponent,
    ConvertComponent,
    LoginComponent
    ],
  imports: [
    RouterModule.forRoot(
      appRoutes
      // ,{ enableTracing: true }
    ),
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase, 'e-and-e-movies'),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatGridListModule,
    MatCardModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatInputModule,
    FormsModule,
    MatListModule,
    MatIconModule,
    HttpClientModule,
    FlexLayoutModule,
    MatChipsModule,
    MatTooltipModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    Angulartics2Module.forRoot([Angulartics2GoogleAnalytics])
  ],
  providers: [DataTransferService, FirebaseService, MediaService, AngularFireAuth],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent]
})
export class AppModule { }
