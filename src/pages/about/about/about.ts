import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from '../../../providers/tables/user/user';
import {ProfilePage} from '../../profile/profile';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  showContributorFlag = false;
  tapCounter = 0;

  constructor(private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.tapCounter = 0;
  }

  goToAdminPage() {
    this.navCtrl.push("AdminPage");
  }

  editProfile() {
    this.navCtrl.push('ProfilePage', {'uid': this.userProvider.getUid()});
  }

  toggleContributor() {
    this.showContributorFlag = !this.showContributorFlag;
  }

  adminOption() {
    this.tapCounter++;
    if (this.tapCounter >= 7) {
      this.goToAdminPage();
    }
  }

}
