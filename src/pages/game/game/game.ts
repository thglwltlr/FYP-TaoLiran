import {Component} from '@angular/core';
import {
  ActionSheetController, IonicPage, ModalController, NavController, NavParams
} from 'ionic-angular';
import {StatusProvider} from '../../../providers/tables/status/status';
import {GroupProvider} from '../../../providers/tables/group/group';
import {GameProvider} from '../../../providers/tables/game/game';
import {UserProvider} from '../../../providers/tables/user/user';
import {SettingProvider} from '../../../providers/setting/setting';
import {GalleryModal} from 'ionic-gallery-modal';
import {CanvasDrawComponent} from '../../../components/canvas-draw/canvas-draw';


@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',


})
export class GamePage {
  constructor(private actionSheetCtrl: ActionSheetController, private modalController: ModalController, private modalCtrl: ModalController, private settingProvider: SettingProvider, private userProvider: UserProvider, private gameProvider: GameProvider, private statusProvider: StatusProvider, private groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {
  }

  showOptions() {
    if (this.settingProvider.showTimeScoreFlag) {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Hey yo! What do yo wanna do?',
        buttons: [
          {
            text: 'Hide Time & Score',
            handler: () => {
              this.settingProvider.showTimeScoreFlag = false;
            }
          },
          {
            text: 'Ask Admin',
            handler: () => {
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      actionSheet.present();
    } else {
      let actionSheet = this.actionSheetCtrl.create({
        title: 'Hey yo! What do yo wanna do?',
        buttons: [
          {
            text: 'Show Time & Score',
            handler: () => {
              this.settingProvider.showTimeScoreFlag = true;
            }
          },
          {
            text: 'Ask Admin',
            handler: () => {
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  hideTimeScore() {
    this.settingProvider.showTimeScoreFlag = false;
  }

  joinGroup() {
    this.navCtrl.push("GroupListPage");
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

  showCanvas() {
    let canvasModal = this.modalCtrl.create(CanvasDrawComponent);
    canvasModal.onDidDismiss((data => {
    }));
    canvasModal.present();
  }

}
