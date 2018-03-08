import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {UserProvider} from '../../providers/tables/user/user';
import {GroupProvider} from '../../providers/tables/group/group';

@IonicPage()
@Component({
  selector: 'page-all-user',
  templateUrl: 'all-user.html',
})
export class AllUserPage {
  lock = false;

  constructor(private userProvider: UserProvider, private groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  inviteMemberOut(userId) {
    this.lock = true;
    this.groupProvider.inviteMemberOut(userId).then((res) => {
      this.lock = false;
    }).catch((err) => {
      this.lock = false;
    })
  }
}
