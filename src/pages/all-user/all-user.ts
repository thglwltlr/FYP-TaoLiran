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

  constructor(private userProvider: UserProvider, private groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  inviteMemberOut(userId) {

  }
}
