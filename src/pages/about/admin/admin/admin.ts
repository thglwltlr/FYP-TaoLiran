import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SettingProvider} from '../../../../providers/setting/setting';
import {Status} from '../../../../assets/models/interfaces/Status';
import {StatusProvider} from '../../../../providers/tables/status/status';

@IonicPage()
@Component({
  selector: 'page-admin',
  templateUrl: 'admin.html',
})
export class AdminPage {

  constructor(private statusProvider: StatusProvider, private settingProvider: SettingProvider, public navCtrl: NavController, public navParams: NavParams) {

  }


  goToLocationPage() {
    this.navCtrl.push("LocationListPage");
  }

  startGame() {
    this.statusProvider.startGame().then((res) => {
    }).catch((err) => {
    });
  }

  endGame() {
    this.statusProvider.endGame().then((res) => {
    }).catch((err) => {
    });
  }
}
