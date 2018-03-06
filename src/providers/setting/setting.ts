import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network';
import * as firebase from "firebase";

@Injectable()
export class SettingProvider {

  readonly CONNECTION_STATE = '.info/connected';
  readonly SERVER_OFFSET = '.info/serverTimeOffset';
  connectionGood = true;
  timer;
  time;
  showTimeScoreFlag = true;
  readonly regExString = '^[a-zA-Z0-9 _]+$';

  constructor(private network: Network) {
  }

  startLocalTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.time += 1000;
    }, 1000);
  }

  stopLocalTimer() {
    clearInterval(this.timer);
  }


  getEstimatedServerTimeOnce() {
    var offsetRef = firebase.database().ref(this.SERVER_OFFSET);
    var promise = new Promise((resolve, reject) => {
      offsetRef.once('value').then((snapshot) => {
        var offset = snapshot.val();
        var estimatedServerTimeMs = new Date().getTime() + offset;
        this.time = parseInt(estimatedServerTimeMs);
        resolve(estimatedServerTimeMs);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  checkFireBaseConnection() {
    var connectedRef = firebase.database().ref(this.CONNECTION_STATE);
    connectedRef.on("value", (snapshot) => {
      if (snapshot.val() === true) {
      } else {
      }
    });
  }

  checkConnection() {
    this.network.onDisconnect().subscribe(() => {
      this.connectionGood = false;
    });

    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.connectionGood = true;
        if (this.network.type === 'wifi') {
        }
        if (this.network.type = 'cellular') {
        }
      }, 3000);
    });
  }

  getFireBaseTimeStamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

  snapshotToArray = (snapshot) => {
    let returnArr = [];
    snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      returnArr[childSnapshot.key] = item;
    });
    return returnArr;
  }
  jsonToArray = (json) => {
    var array = [];
    var keys = Object.keys(json);
    for (let key of keys) {
      array[key] = json[key];
    }
    return array;
  }

  checkName(name) {
    if (name == null) {
      return false;
    }
    var trimmedName = name.trim();
    if (trimmedName == 'admin')
      return false;
    var regEx = new RegExp(this.regExString);
    return regEx.test(name);

  }
}
