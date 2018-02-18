import {Injectable} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {Events, Platform} from 'ionic-angular';
import {Device} from '@ionic-native/device';
import * as firebase from 'firebase';
import {User} from '../../../assets/models/interfaces/User';
import {SettingProvider} from '../../setting/setting';
import {LoaderProvider} from '../../utility/loader/loader';

@Injectable()
export class UserProvider {
  readonly USER_TABLE = '/UserTable';
  readonly CONNECTION_STATE = '.info/connected';
   userTableRef = firebase.database().ref(this.USER_TABLE);
  userTableInfo: User[];
  userTableInfoKey = [];
  readonly USER_TABLE_UPDATE = "userTableUpdate";
  readonly LAST_TIME_ONLINE = "lastTimeOnline";
  firebaseConnection = false;

  constructor(private loaderProvider: LoaderProvider, private events: Events, private settingProvider: SettingProvider, private device: Device, private platform: Platform, private angularFireAuth: AngularFireAuth) {
  }

  checkFireBaseConnection() {
    var connectedRef = firebase.database().ref(this.CONNECTION_STATE);
    connectedRef.on("value", (snapshot) => {
      if (snapshot.val() === true) {
        this.firebaseConnection = true;
      } else {
        this.userTableRef.child(this.getUid()).child(this.LAST_TIME_ONLINE).onDisconnect().set(this.settingProvider.getFireBaseTimeStamp());
        this.firebaseConnection = false;
      }
    });
  }

  updateLastOnline() {
    var promise = new Promise((resolve, reject) => {
      this.userTableRef.child(this.getUid()).child(this.LAST_TIME_ONLINE).set(this.settingProvider.getFireBaseTimeStamp()).then((res) => {
      }).catch((err) => {
        }
      );
    });
    return promise;
  }

  getUserTable() {
    this.userTableRef.on('value', (snapshot) => {
      this.userTableInfo = this.settingProvider.snapshotToArray(snapshot);
      this.userTableInfoKey = Object.keys(this.userTableInfo);
      this.events.publish(this.USER_TABLE_UPDATE);
    });
  }

  anonymousLogin() {
    console.log("in sign in");
    var promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInAnonymously().then((res) => {
        console.log("sign in good")
        resolve(true);
      }).catch((err) => {
        console.log("sign in fail")
        reject(false);
      })
    });
    return promise;
  }

  checkUser() {
    var promise = new Promise((resolve, reject) => {
      this.userTableRef.child(this.getUid()).once('value').then((snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  updateUser(user: User) {
    user.edited = true;
    user.lastTimeOnline = this.settingProvider.getFireBaseTimeStamp();

    var promise = new Promise((resolve, reject) => {
      this.userTableRef.child(this.getUid()).update(user).then((snapshot) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  getUid() {
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      return "rambo1412";
    }
    return this.device.uuid;
  }


}
