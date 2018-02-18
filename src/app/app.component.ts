import { Component } from '@angular/core';
import {ModalController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {OpenPage} from '../pages/open/open';
import {UserProvider} from '../providers/tables/user/user';
import {User} from '../assets/models/interfaces/User';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = OpenPage;

  constructor(modalCtrl: ModalController, userProvider: UserProvider, platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      userProvider.anonymousLogin().then((res) => {
        if (res == true) {
          console.log("login success");
          userProvider.checkUser().then((res: User) => {
            if (res == null || (res).edited == null || (res).edited == false) {
              this.rootPage = 'ProfilePage';
            }
            else {
              this.rootPage = 'TabsPage';
            }
          }).catch((err) => {
            console.log("err", err.message);
          });
        }
      }).catch((err) => {
        console.log("login fail")
      });
    });
  }
}

