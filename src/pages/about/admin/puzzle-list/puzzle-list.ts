import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GameProvider} from '../../../../providers/tables/game/game';
import {SettingProvider} from '../../../../providers/setting/setting';
import {Puzzle} from '../../../../assets/models/interfaces/Puzzle';
import {CameraProvider} from '../../../../providers/utility/camera/camera';

@IonicPage()
@Component({
  selector: 'page-puzzle-list',
  templateUrl: 'puzzle-list.html',
})
export class PuzzleListPage {
  locationId: string;
  puzzleTemp = {} as Puzzle;
  puzzleTempKey = '';

  constructor(private cameraProvider: CameraProvider, private settingProvider: SettingProvider, private gameProvider: GameProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.locationId = this.navParams.get("locationId");
    console.log("locationId", this.locationId);
    console.log(this.gameProvider.puzzleInfoKeys[this.locationId]);
    this.initPuzzle();
  }

  initPuzzle() {
    this.puzzleTemp = {} as Puzzle;
    this.puzzleTemp.title = '';
    this.puzzleTemp.strictAnswer = false;
    this.puzzleTemp.puzzleContent = '';
    this.puzzleTemp.hint1 = '';
    this.puzzleTemp.hint2 = '';
    this.puzzleTemp.answer = '';
    this.puzzleTemp.photoUrl = this.cameraProvider.puzzleDefault;
    this.puzzleTemp.order = 0;
    this.puzzleTemp.special = false;
    this.puzzleTempKey = '';
  }

  editPuzzle(puzzleId) {
    this.puzzleTemp = this.gameProvider.gameTableInfo[this.locationId].puzzles[puzzleId];
    this.puzzleTempKey = puzzleId;
    this.cameraProvider.initStartUpImage(this.puzzleTemp.photoUrl);
  }

  deletePuzzle(puzzleId) {
    this.puzzleTemp = null;
    this.puzzleTempKey = puzzleId;
    this.updatePuzzle();
  }

  addPuzzle() {
    this.puzzleTempKey = this.settingProvider.time;
    this.cameraProvider.initStartUpImage(this.puzzleTemp.photoUrl);
  }

  updatePuzzle() {
    if (this.puzzleTemp.photoUrl != this.cameraProvider.base64Image) {
      this.cameraProvider.uploadImage(this.cameraProvider.puzzleRef).then((url: any) => {
        this.puzzleTemp.photoUrl = url;
        this.updateFurther();
      }).catch((err) => {

      });
    } else {
      this.updateFurther();
    }
  }

  chooseImage() {
    this.cameraProvider.presentChoice();
  }

  updateFurther() {
    this.gameProvider.updatePuzzle(this.locationId, this.puzzleTempKey, this.puzzleTemp).then((res) => {
      console.log("update game table res", res)
    }).catch((err) => {
      console.log("update game table err", err);
    })
    this.initPuzzle();
  }

  cancel() {
    this.initPuzzle();
  }

}
