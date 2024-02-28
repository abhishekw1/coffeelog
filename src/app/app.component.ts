import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'coffeelog';

  constructor(
    private _snackBar: MatSnackBar,
    private swUpdate: SwUpdate,
    private swPush: SwPush
  ) {}

  registerForPush() {
    if (this.swPush.isEnabled) {
      Notification.requestPermission((permission) => {
        if (permission === 'granted') {
          this.swPush
            .requestSubscription({
              serverPublicKey:
                'BOxv4sx-pn4yVgFkxRu-H6HyH1xmlf1sw9EqgXioeBizMjV6-IZiykiPxYPFgF9cIAquHoPXGE9fb7yPQ3XGTNc',
            })
            .then((registration) => {
              //send these deatils to a push backend server /Q37fVm4A7dgrz56rxcbg0uQIutW0_g9V6dvusXsLEUc-AsT
              console.log(registration);
            });
        }
      });
    }
  }

  updateNetworkStatusUI() {
    if (navigator.onLine) {
      (document.querySelector('body') as any).style = '';
    } else {
      (document.querySelector('body') as any).style = 'filter: grayscale(1)';
    }
  }
  ngOnInit(): void {
    this.swPush.notificationClicks.subscribe((value) => {
      console.log(value);
    });
    //checking the sw update.
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate();
      this.swUpdate.versionUpdates.subscribe((update) => {
        if (update.type == 'VERSION_READY') {
          // location.reload();
          const sb = this._snackBar.open(
            'There is an update version available',
            'Install Now',
            { duration: 4000 }
          );
          sb.onAction().subscribe(() => {
            // ux check before the reolading
            location.reload();
          });
        }
      });
    }
    //update the ui on newtwork changes
    this.updateNetworkStatusUI();
    window.addEventListener('online', this.updateNetworkStatusUI);
    window.addEventListener('offline', this.updateNetworkStatusUI);

    //Inviting th user to install the pwa
    if (window.matchMedia('(display-mode: browser)').matches) {
      //we are in the borwser
      if ('standalone' in navigator) {
        // only availabe in safari
        this._snackBar.open(
          'You can install the app, use Share > Add to Home Screen',
          '',
          { duration: 3000 }
        );
      } else {
        // is not for safari
        window.addEventListener('beforeinstallprompt', (event: any) => {
          event.preventDefault();
          const sb = this._snackBar.open(
            'You can install this app',
            'Install',
            {
              duration: 5000,
            }
          );
          sb.onAction().subscribe(() => {
            event.prompt();
            event.userChoice.then((result: any) => {
              // peroform loging
              console.log('peroform loging', result);
            });
          });
        });
      }
    }
  }
}
