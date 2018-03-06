import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, Content, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GameProvider} from '../../../providers/tables/game/game';
import {StatusProvider} from '../../../providers/tables/status/status';
import {UserProvider} from '../../../providers/tables/user/user';
import {SettingProvider} from '../../../providers/setting/setting';
import {ToastProvider} from '../../../providers/utility/toast/toast';
import {LoaderProvider} from '../../../providers/utility/loader/loader';
import {ModalController} from 'ionic-angular';
import {GalleryModal} from 'ionic-gallery-modal';
import {CanvasDrawComponent} from '../../../components/canvas-draw/canvas-draw';

@IonicPage()
@Component({
  selector: 'page-puzzle-solve',
  templateUrl: 'puzzle-solve.html',
})
export class PuzzleSolvePage {
  puzzleId = '';
  lock = false;
  answerTemp = '';
  @ViewChild('content') content: Content;

  constructor(private actionSheetCtrl: ActionSheetController, private modalCtrl: ModalController, private loaderProvider: LoaderProvider, private toastProvider: ToastProvider, private settingProvider: SettingProvider, private userProvider: UserProvider, private gameProvider: GameProvider, private statusProvider: StatusProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.puzzleId = this.navParams.get('puzzleId');
    if (this.statusProvider.puzzleStatus[this.puzzleId] == null) {
      this.navCtrl.pop();
    }
    if (!this.statusProvider.puzzleStatus[this.puzzleId].solved) {
      this.statusProvider.solvingPuzzle = this.puzzleId;
    }
    this.answerTemp = '';
  }

  hideTimeScore() {
    this.settingProvider.showTimeScoreFlag = false;
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

  viewIntro() {
    this.navCtrl.push('IntroPage');
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

  openImage() {
    var photos = [];
    photos.push({
      url: this.gameProvider.puzzleDetails[this.puzzleId].photoUrl
    })
    let modal = this.modalCtrl.create(GalleryModal, {
        photos: photos,
        initialSlide: 0
      })
    ;
    modal.present();
  }

  ionViewWillEnter() {
    // this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom(1000);
    }, 1000);
  }

  ionViewWillLeave() {
    this.statusProvider.solvingPuzzle = '';
  }

  checkAnswer(): boolean {
    var correctAnswer = this.gameProvider.puzzleDetails[this.puzzleId].answer.trim().toLowerCase();
    var strictFlag = this.gameProvider.puzzleDetails[this.puzzleId].strictAnswer;
    //ignore space, lower case only
    var cookedAnswer = this.answerTemp.trim().toLowerCase();
    if (strictFlag) {
      return correctAnswer == cookedAnswer;
    } else {
      //cookedAnswer match 80% of correct answer length, correct answer contains cookedAnswer, or cookedAnswer contains correct answer
      return (cookedAnswer.length >= 0.8 * correctAnswer.length && (cookedAnswer.indexOf(correctAnswer) >= 0 || correctAnswer.indexOf(cookedAnswer) >= 0))
    }
  }

  answerPuzzle() {
    if (!this.checkAnswer()) {
      this.toastProvider.showToast("Oops, wrong answer, try again");
      return
    }
    this.lock = true;
    this.loaderProvider.showLoader("Correct answer, updating!");
    this.statusProvider.answerPuzzle(this.puzzleId).then((res) => {
      this.statusProvider.changePoint(this.statusProvider.answerPoint).then((res) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
        if (res) {
          this.navCtrl.pop();
        }
      }).catch((err) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
      });
    }).catch((err) => {
      this.lock = false;
      this.loaderProvider.dismissLoader();
    });
  }

  viewHint1() {
    if (this.checkPoint()) {
      this.lock = true;
      this.loaderProvider.showLoader("Hint will be uncovered");
      this.statusProvider.viewHint1(this.puzzleId).then((res) => {
        this.statusProvider.changePoint(this.statusProvider.hintPoint).then((res) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        }).catch((err) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        });
      }).catch((err) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
      });
    }
  }

  viewHint2() {
    if (this.checkPoint()) {
      this.lock = true;
      this.loaderProvider.showLoader("Hint will be uncovered");
      this.statusProvider.viewHint2(this.puzzleId).then((res) => {
        this.statusProvider.changePoint(this.statusProvider.hintPoint).then((res) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        }).catch((err) => {
          this.lock = false;
          this.loaderProvider.dismissLoader();
        });
      }).catch((err) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
      });
    }
  }

  checkPoint() {
    if (this.statusProvider.groupStatus.point < 20) {
      //to do
      return false
    }
    return true;
  }
}
