import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {ActionSheetController, Content, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {GameProvider} from '../../../providers/tables/game/game';
import {StatusProvider} from '../../../providers/tables/status/status';
import {UserProvider} from '../../../providers/tables/user/user';
import {SettingProvider} from '../../../providers/setting/setting';
import {ToastProvider} from '../../../providers/utility/toast/toast';
import {LoaderProvider} from '../../../providers/utility/loader/loader';
import {ModalController} from 'ionic-angular';
import {GalleryModal} from 'ionic-gallery-modal';
import {CanvasDrawComponent} from '../../../components/canvas-draw/canvas-draw';
import {SpeechRecognition} from '@ionic-native/speech-recognition';

@IonicPage()
@Component({
  selector: 'page-puzzle-solve',
  templateUrl: 'puzzle-solve.html',
})
export class PuzzleSolvePage {
  puzzleId = '';
  lock = false;
  answerTemp = '';
  onScrollFlag = false;
  readonly noAudio = "Enter your answer here: ";
  placeHolderText = this.noAudio;
  matches: string[];
  isRecording = false;
  micActivated = false;
  @ViewChild('content') content: Content;

  constructor(private platform: Platform,
              private cd: ChangeDetectorRef,
              private speechRecognition: SpeechRecognition,
              private actionSheetCtrl: ActionSheetController,
              private modalCtrl: ModalController,
              private loaderProvider: LoaderProvider,
              private toastProvider: ToastProvider,
              private settingProvider: SettingProvider,
              private userProvider: UserProvider,
              private gameProvider: GameProvider,
              private statusProvider: StatusProvider,
              public navCtrl: NavController,
              public navParams: NavParams) {
    this.puzzleId = this.navParams.get('puzzleId');
    if (this.statusProvider.puzzleStatus[this.puzzleId] == null) {
      this.navCtrl.pop();
    }
    if (!this.statusProvider.puzzleStatus[this.puzzleId].solved) {
      this.statusProvider.solvingPuzzle = this.puzzleId;
    }
    this.answerTemp = '';
    this.placeHolderText = this.noAudio;
  }

  isIos() {
    return this.platform.is('ios');
  }

  checkPermission() {
    if (this.settingProvider.audioPermission)
      return;
    this.speechRecognition.hasPermission()
      .then((hasPermission: boolean) => {
        if (!hasPermission) {
          this.speechRecognition.requestPermission().then(
            () => {
              this.settingProvider.audioPermission = true;
            },
            () => this.settingProvider.audioPermission = false
          )
        }
        else {
          this.settingProvider.audioPermission = true;
          this.startListeningFurther();
        }
      });
  }

  selectMatch(match) {
    this.answerTemp = match;
    this.closeMicChanel();
  }

  stopListeningMic() {
    this.speechRecognition.stopListening().then(() => {
      this.isRecording = false;
      this.matches = [] as string[];
    });
  }

  openMicChanel() {
    this.micActivated = true;
  }

  closeMicChanel() {
    this.micActivated = false;
    this.stopListeningMic();
  }

  startListeningMic() {
    this.answerTemp = '';
    if (this.settingProvider.audioPermission)
      this.startListeningFurther();
    else
      this.checkPermission();
  }

  startListeningFurther() {
    this.micActivated = true;
    let options = {
      language: 'en-US'
    }
    this.speechRecognition.startListening().subscribe(matches => {
      this.matches = matches;
      this.cd.detectChanges();
    });
    this.isRecording = true;
  }

  hideTimeScore() {
    this.settingProvider.showTimeScoreFlag = false;
  }

  onScroll() {
    var fixedHeight = this.content.getContentDimensions().scrollHeight
    var relativeHeight = this.content.getContentDimensions().contentHeight
      + this.content.getContentDimensions().scrollTop + 50;
    if (relativeHeight > fixedHeight)
      this.onScrollFlag = false;
    else
      this.onScrollFlag = true;
  }

  onScrollStart() {
    this.onScrollFlag = true;
  }

  onScrollEnd() {
    this.onScrollFlag = false;
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
      this.content.scrollToBottom(300);
    }, 300);
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
          if (this.gameProvider.puzzleDetails[this.puzzleId] != null
            && this.gameProvider.puzzleDetails[this.puzzleId].memory != null
            && this.gameProvider.puzzleDetails[this.puzzleId].memory != '') {
            this.scrollToBottom();
          } else {
            this.navCtrl.pop();
          }
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
