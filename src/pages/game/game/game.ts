import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {StatusProvider} from '../../../providers/tables/status/status';
import {GroupProvider} from '../../../providers/tables/group/group';
import {GameProvider} from '../../../providers/tables/game/game';
import {UserProvider} from '../../../providers/tables/user/user';
import {SettingProvider} from '../../../providers/setting/setting';


@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  constructor(private settingProvider: SettingProvider, private userProvider: UserProvider, private gameProvider: GameProvider, private statusProvider: StatusProvider, private groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  joinGroup() {

  }

  puzzleSolve(puzzleId) {
    console.log(puzzleId);
    this.navCtrl.push('PuzzleSolvePage', {'puzzleId': puzzleId});
  }

  startGame() {
    this.statusProvider.groupStart().then((res) => {
    }).catch((err) => {
    });
  }

  viewMap() {
    this.navCtrl.push("MapPage");
  }
}
