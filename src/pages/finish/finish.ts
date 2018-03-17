import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';
import {StatusProvider} from '../../providers/tables/status/status';
import {GameProvider} from '../../providers/tables/game/game';

@IonicPage()
@Component({
  selector: 'page-finish',
  templateUrl: 'finish.html',
})
export class FinishPage {
  readonly forwardSlash = /\//g;
  readonly backSlash = /\\/g;
  memoryPieces = [];

  constructor(private gameProvider: GameProvider, private domSanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams) {
    this.memoryPieces = [];
    for (let puzzleId of Object.keys(this.gameProvider.puzzleDetails)) {
      if (this.gameProvider.puzzleDetails[puzzleId] != null
        && this.gameProvider.puzzleDetails[puzzleId].memory != null
        && this.gameProvider.puzzleDetails[puzzleId].memory != '') {
        this.memoryPieces.push(this.gameProvider.puzzleDetails[puzzleId].memory);
      }
    }}

  back() {
    this.navCtrl.pop();
  }


}
