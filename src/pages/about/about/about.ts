import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from '../../../providers/tables/user/user';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  goToAdminPage()
  {
    this.navCtrl.push("AdminPage");
  }

}
