import { Injectable, NgZone } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';

@Injectable()
export class MediaService {

  public state = '';
  columns;

  screen_break_points = {
    xsmall: false,
    small: false,
    medium: false,
    large: false,
    xlarge: false,
  }


  
  constructor(public media:ObservableMedia, private ngZone:NgZone) {
    media.asObservable()
      .subscribe((change:MediaChange) => {
        this.state = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : ""
        if(media.isActive('xs')){
          this.columns = 3;
          this.screen_break_points.xsmall = true;
        }
        else if(media.isActive('sm')){
          this.columns = 3;
          this.screen_break_points.small = true;
        }
        else if(media.isActive('md')){
          this.columns = 3;
          this.screen_break_points.medium = true;
        }
        else if(media.isActive('lg')){
          this.columns = 5;
          this.screen_break_points.large = true;
        }
        else if(media.isActive('xl')){
          this.columns = 6;
          this.screen_break_points.xlarge = true;
        }
      });
      
      window.onresize = (e) =>
      {
          //ngZone.run will help to run change detection
          this.ngZone.run(() => {
              if(media.isActive('xs')){
                this.columns = 1;

              }
              else if(media.isActive('sm')){
                this.columns = 2;

              }
              else if(media.isActive('md')){
                this.columns = 3;

              }
              else if(media.isActive('lg')){
                this.columns = 4;

              }
              else if(media.isActive('xl')){
                this.columns = 5;

              }
          });
      };
  }



}
