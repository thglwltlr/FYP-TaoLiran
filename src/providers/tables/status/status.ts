import {Injectable} from '@angular/core';
import {Status} from '../../../assets/models/interfaces/Status';
import * as firebase from 'firebase';
import {Events} from 'ionic-angular';
import {SettingProvider} from '../../setting/setting';
import {PuzzleStatus} from '../../../assets/models/interfaces/PuzzleStatus';
import {GroupStatus} from '../../../assets/models/interfaces/GroupStatus';
import {GameProvider} from '../game/game';
import {GroupProvider} from '../group/group';
import {UserProvider} from '../user/user';
import {RandomStyle} from '../../../assets/models/interfaces/RandomStyle';

@Injectable()
export class StatusProvider {
  readonly STATUS_TABLE = '/StatusTable';
  statusTableRef = firebase.database().ref(this.STATUS_TABLE);
  statusTableInfo: Status;
  readonly STATUS_TABLE_UPDATE = "statusTableUpdate";
  readonly groups = "groups";
  readonly puzzles = "puzzles";
  readonly hintPoint = -20;
  readonly answerPoint = 10;
  firstTimeFlag = true;
  firstUnsolved = '';
  puzzleStatus = [] as PuzzleStatus[];
  puzzleStatusKeys = [];
  groupStatus = {} as GroupStatus;
  randomStyle = [] as RandomStyle[];
  readonly animationArray = ['moveHorizon', 'moveAround','rotate','moveVertical'];

  constructor(private userProvider: UserProvider, private groupProvider: GroupProvider, private gameProvider: GameProvider, private settingProvider: SettingProvider, private events: Events) {
  }

  initParams() {
    this.groupStatus = {} as GroupStatus;
    this.puzzleStatus = [] as PuzzleStatus[];
    this.puzzleStatusKeys = [];
  }

  getStatusTable() {
    this.statusTableRef.on('value', (snapshot) => {
      this.initParams();
      this.statusTableInfo = snapshot.val();
      if (this.statusTableInfo.groups != null
        && this.statusTableInfo.groups.length != 0
        && this.groupProvider.userGroupId != null
        && this.groupProvider.userGroupId != '') {
        this.groupStatus = this.statusTableInfo.groups[this.groupProvider.userGroupId];
        this.getPuzzleStatus();
        this.getRandomStyle();
        this.getFirstUnsolved();

      }
      this.events.publish(this.STATUS_TABLE_UPDATE);
      if (this.firstTimeFlag)
        this.firstTimeFlag = false;
    });
  }

  getPuzzleStatus() {
    console.log(this.groupStatus.puzzles);
    this.puzzleStatus = this.settingProvider.jsonToArray(this.groupStatus.puzzles);
    this.puzzleStatusKeys = Object.keys(this.puzzleStatus);
    this.puzzleStatusKeys.sort((puzzleId1, puzzleId2) => {
      if (this.puzzleStatus[puzzleId1].order < this.puzzleStatus[puzzleId2].order) {
        return -1;
      }
      if (this.puzzleStatus[puzzleId1].order > this.puzzleStatus[puzzleId2].order) {
        return 1;
      }
      return 0;
    });
  }

  getFirstUnsolved() {
    this.firstUnsolved = '';
    for (let puzzleId of this.puzzleStatusKeys) {
      if (this.puzzleStatus[puzzleId].solved == false) {
        this.firstUnsolved = puzzleId;
        console.log("firstUnsolved:", this.firstUnsolved);
        break;
      }
    }
    if ((this.firstUnsolved == null || this.firstUnsolved == '')
      && (this.groupStatus.endTime == null || this.groupStatus.endTime == '')) {
      this.groupEnd().then((res) => {

      }).catch((err => {

      }));
    }
  }

  changePoint(point) {
    var updatedPoint = point + this.groupStatus.point;
    var groupTemp = {} as GroupStatus;
    groupTemp.point = updatedPoint;
    var promise = this.updateGroupStatus(groupTemp);
    return promise;
  }

  viewHint1(puzzleId) {
    var puzzleTemp = {} as PuzzleStatus;
    puzzleTemp.hint1 = true;
    var promise = this.updatePuzzleStatus(puzzleId, puzzleTemp);
    return promise;
  }

  viewHint2(puzzleId) {
    var puzzleTemp = {} as PuzzleStatus;
    puzzleTemp.hint2 = true;
    var promise = this.updatePuzzleStatus(puzzleId, puzzleTemp);
    return promise;
  }

  groupStart() {
    //need to use set to create puzzles branch
    var groupTemp = {} as GroupStatus;
    groupTemp.startTime = this.settingProvider.getFireBaseTimeStamp();
    groupTemp.endTime = '';
    groupTemp.point = 50;
    groupTemp.puzzles = this.getRandomPuzzles();
    var promise = new Promise((resolve, reject) => {
      this.statusTableRef.child(this.groups).child(this.groupProvider.userGroupId)
        .set(groupTemp).then((res) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    });
    return promise;
  }

  groupEnd() {
    var groupTemp = {} as GroupStatus;
    this.groupStatus.endTime = this.settingProvider.getFireBaseTimeStamp();
    var promise = this.updateGroupStatus(groupTemp);
    return promise;
  }

  answerPuzzle(puzzleId) {
    this.firstUnsolved = '';
    var puzzleTemp = {} as PuzzleStatus;
    puzzleTemp.solved = true;
    puzzleTemp.solvedBy = this.userProvider.getUid();
    var promise = this.updatePuzzleStatus(puzzleId, puzzleTemp);
    return promise;
  }

  updatePuzzleStatus(puzzleId, puzzleTemp) {
    var promise = new Promise((resolve, reject) => {
      this.statusTableRef.child(this.groups).child(this.groupProvider.userGroupId)
        .child(this.puzzles).child(puzzleId)
        .update(puzzleTemp).then((res) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  updateGroupStatus(groupTemp: GroupStatus) {
    console.log('groupTemp', groupTemp);
    var promise = new Promise((resolve, reject) => {
      this.statusTableRef.child(this.groups).child(this.groupProvider.userGroupId)
        .update(groupTemp).then((res) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      });
    });
    return promise;

  }

  getRandomPuzzles() {
    var puzzleStatusArray = [] as PuzzleStatus[];
    var order = 0;
    var locationOrder = this.getLocationOrder();

    for (let locationId of locationOrder) {
      if (this.gameProvider.gameTableInfo[locationId].puzzles != null) {
        for (let puzzleId of this.gameProvider.puzzleInfoKeys[locationId]) {
          var puzzleStatus = this.initPuzzleStatus();
          puzzleStatus.order = order;
          puzzleStatusArray[puzzleId] = puzzleStatus;
          order++;
        }
      }
    }
    console.log("puzzleStatusArray", puzzleStatusArray);
    return puzzleStatusArray;
  }

  getLocationOrder() {
    var locationOrder = [];
    locationOrder[0] = this.gameProvider.gameTableInfoKeys[0];
    var random = Math.floor(Math.random() * (this.gameProvider.gameTableInfoKeys.length - 1)) + 1;
    for (var i = 0; i < this.gameProvider.gameTableInfoKeys.length - 1; i++) {
      if (random + i == this.gameProvider.gameTableInfoKeys.length)
        random = 1 - i;
      locationOrder[i + 1] = this.gameProvider.gameTableInfoKeys[random + i];
    }
    return locationOrder;
  }

  getRandomStyle() {
    for (let puzzleId of this.puzzleStatusKeys) {
      if (this.puzzleStatus[puzzleId].solved) {
        this.randomStyle[puzzleId] = {} as RandomStyle;
        this.randomStyle[puzzleId].randomColor = this.compileRandomColors();
        this.randomStyle[puzzleId].randomDuration = this.getRandomAnimationDuration();
        this.randomStyle[puzzleId].randomAnimation = this.getRandomAnimation();
      }
    }
    console.log(this.randomStyle);
  }

  getRandomAnimation() {
    var animation = this.animationArray[Math.floor(Math.random() * this.animationArray.length)];
    return animation + ' infinite'
  }

  compileRandomColors() {
    var param1 = this.getRandomColor();
    var param2 = this.getRandomColor();
    var param3 = this.getRandomColor();
    return 'linear-gradient(-45deg, ' + param1 + ', ' + param2 + ', ' + param3 + ')';
  }

  getRandomColor() {
    var maxVal = 200;
    var minVal = 20;

    var r = Math.floor(Math.random() * maxVal) + minVal;
    var g = Math.floor(Math.random() * maxVal) + minVal;
    var b = Math.floor(Math.random() * maxVal) + minVal;
    var a = 1;
    return "rgba(" + r + "," + g + "," + b + "," + a + ")";

  }

  getRandomAnimationDuration() {
    var d = Math.floor(Math.random() * 10) * 1000+10000;
    return d + 'ms';
  }


  initPuzzleStatus() {
    var puzzleStatus = {} as PuzzleStatus;
    puzzleStatus.solved = false;
    puzzleStatus.solvedBy = '';
    puzzleStatus.hint1 = false;
    puzzleStatus.hint2 = false;
    return puzzleStatus;
  }


  startGame() {
    var statusTemp = {} as Status;
    statusTemp.startTime = this.settingProvider.getFireBaseTimeStamp();
    statusTemp.endTime = '';
    var promise = new Promise((resolve, reject) => {
        this.statusTableRef.set(statusTemp).then((res) => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      }
    )
    return promise;
  }


  endGame() {
    var statusTemp = {} as Status;
    statusTemp.endTime = this.settingProvider.getFireBaseTimeStamp();
    var promise = new Promise((resolve, reject) => {
        this.statusTableRef.update(statusTemp).then((res) => {
          resolve(true);
        }).catch((err) => {
          reject(err);
        })
      }
    )
    return promise;
  }

}
