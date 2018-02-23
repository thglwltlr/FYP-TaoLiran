import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {StatusProvider} from '../../../providers/tables/status/status';
import {GroupProvider} from '../../../providers/tables/group/group';
import {GameProvider} from '../../../providers/tables/game/game';
import {UserProvider} from '../../../providers/tables/user/user';
import {SettingProvider} from '../../../providers/setting/setting';
import {GalleryModal} from 'ionic-gallery-modal';


@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {

  constructor(private modalCtrl: ModalController, private settingProvider: SettingProvider, private userProvider: UserProvider, private gameProvider: GameProvider, private statusProvider: StatusProvider, private groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {
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

  viewRank() {
    this.navCtrl.push("RankPage");
  }

  viewTable() {
    var photos = [];
    photos.push({
      url: 'https://firebasestorage.googleapis.com/v0/b/fyp03-136e5.appspot.com/o/Table.jpg?alt=media&token=a1264fe1-983b-464e-8690-95ab6dfe3228'
    })
    let modal = this.modalCtrl.create(GalleryModal, {
        photos: photos,
        initialSlide: 0
      })
    ;
    modal.present();
  }

  viewMap() {
    this.navCtrl.push("MapPage");
  }
}
