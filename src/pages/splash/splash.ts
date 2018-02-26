import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';


@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public splashScreen: SplashScreen) {
  }

  ionViewDidEnter() {

    this.splashScreen.hide();

    setTimeout(() => {
      this.viewCtrl.dismiss();
    }, 2000);

  }

}
