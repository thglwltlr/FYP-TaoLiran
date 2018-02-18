import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {SettingProvider} from '../../setting/setting';
import {Events} from 'ionic-angular';
import {Location} from '../../../assets/models/interfaces/Location';
import {Puzzle} from '../../../assets/models/interfaces/Puzzle';

@Injectable()
export class GameProvider {
  readonly GAME_TABLE = '/GameTable';
  gameTableRef = firebase.database().ref(this.GAME_TABLE);
  gameTableInfo: Location[];
  gameTableInfoKeys = [];
  puzzleInfoKeys = [];
  readonly GAME_TABLE_UPDATE = "gameTableUpdate";
  readonly PUZZLE_TABLE = 'puzzles';
  firstTimeFlag = true;
  puzzleDetails = [] as Puzzle[];

  constructor(private events: Events, private settingProvider: SettingProvider) {

  }

  getGameTable() {
    this.gameTableRef.on('value', (snapshot) => {
      this.gameTableInfo = this.settingProvider.snapshotToArray(snapshot);
      this.gameTableInfoKeys = Object.keys(this.gameTableInfo);
      if (this.gameTableInfo != null) {
        this.sortLocation();
        this.puzzleDetails = [] as Puzzle[];
        this.sortPuzzles();
      }
      this.events.publish(this.GAME_TABLE_UPDATE);
      this.firstTimeFlag = false;
    });
  }

  sortLocation() {
    this.gameTableInfoKeys.sort((locationId1, locationId2): number => {
      if (this.gameTableInfo[locationId1].order < this.gameTableInfo[locationId2].order)
        return -1;
      if (this.gameTableInfo[locationId1].order > this.gameTableInfo[locationId2].order)
        return 1;
      return 0;
    });
  }

  sortPuzzles() {
    for (let locationId of this.gameTableInfoKeys) {
      if (this.gameTableInfo[locationId].puzzles != null) {
        var puzzleArray = this.settingProvider.jsonToArray(this.gameTableInfo[locationId].puzzles);
        var puzzleArrayKey = Object.keys(puzzleArray);
        puzzleArrayKey.sort((puzzleId1, puzzleId2) => {
          if (puzzleArray[puzzleId1].order < puzzleArray[puzzleId2].order)
            return -1;
          if (puzzleArray[puzzleId1].order > puzzleArray[puzzleId2].order)
            return 1;
          return 0;
        })

        this.puzzleInfoKeys[locationId] = puzzleArrayKey;
        this.savePuzzleInfo(puzzleArrayKey, puzzleArray);
      }
    }
  }

  savePuzzleInfo(puzzleArrayKey, puzzleArray) {
    for (let puzzleId of puzzleArrayKey) {
      this.puzzleDetails[puzzleId] = puzzleArray[puzzleId];
    }
  }

  updateLocation(locationId, locationTemp) {
    var promise = new Promise((resolve, reject) => {
        this.gameTableRef.child(locationId).set(locationTemp).then(() => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      }
    )
    return promise;
  }


  updatePuzzle(locationId, puzzleId, puzzleTemp) {
    var promise = new Promise((resolve, reject) => {
        this.gameTableRef.child(locationId).child(this.PUZZLE_TABLE).child(puzzleId).set(puzzleTemp).then(() => {
          resolve(true);
        }).catch((err) => {
          resolve(err);
        })
      }
    )
    return promise;
  }
}
