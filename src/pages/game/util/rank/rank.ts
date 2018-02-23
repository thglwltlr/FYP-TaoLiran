import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {StatusProvider} from '../../../../providers/tables/status/status';
import {GroupProvider} from '../../../../providers/tables/group/group';

@IonicPage()
@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html',
})
export class RankPage {

  constructor(private groupProvider:GroupProvider,private statusProvider: StatusProvider, public navCtrl: NavController, public navParams: NavParams) {
  }
}
