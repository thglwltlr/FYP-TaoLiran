import {Injectable} from '@angular/core';
import * as firebase from 'firebase';
import {Group} from '../../../assets/models/interfaces/Group';
import {SettingProvider} from '../../setting/setting';
import {Events} from 'ionic-angular';
import {UserProvider} from '../user/user';


@Injectable()
export class GroupProvider {

  readonly GROUP_TABLE = '/GroupTable';
  groupTableRef = firebase.database().ref(this.GROUP_TABLE);
  groupTableInfo: Group[];
  groupTableInfoKeys = [];
  readonly GROUP_TABLE_UPDATE = "groupTableUpdate";
  readonly groupSyncTime = 'groupSyncTime';
  firstTimeFlag = true;
  userGroupId = '';
  groupLeaderFlag = false;
  filterString = '';
  filteredKeys = [];

  constructor(private settingProvider: SettingProvider, private events: Events, private userProvider: UserProvider) {
  }

  getGroupTable() {
    this.groupTableRef.on('value', (snapshot) => {
      this.groupTableInfo = this.settingProvider.snapshotToArray(snapshot);
      this.groupTableInfo.sort((group1, group2) => {
        if (group1.groupNumber < group2.groupNumber)
          return -1;
        if (group1.groupNumber > group2.groupNumber)
          return 1;
        return 0;
      });
      this.groupTableInfoKeys = Object.keys(this.groupTableInfo);
      this.updateUserGroupStatus();
      this.filterGroupTable();
      this.events.publish(this.GROUP_TABLE_UPDATE);
    });
  }

  filterGroupTable() {
    this.filteredKeys = this.groupTableInfoKeys;
    if (this.filterString != null && this.filterString != '') {
      this.filteredKeys = this.filteredKeys.filter((groupId) => {
        if (((this.groupTableInfo[groupId].groupNumber + '').toLowerCase().indexOf(this.filterString) > -1)
          || ((this.groupTableInfo[groupId].name).toLowerCase().indexOf(this.filterString) > -1)) {
          return true;
        }
        else {
          return false;
        }
      })
    }
  }

  updateUserGroupStatus() {
    this.userGroupId = '';
    this.groupLeaderFlag = false;
    for (let groupId of this.groupTableInfoKeys) {
      if (this.groupTableInfo[groupId].members.indexOf(this.userProvider.getUid()) > -1) {
        this.userGroupId = groupId;
        if (this.groupTableInfo[groupId].groupCreator == this.userProvider.getUid()) {
          this.groupLeaderFlag = true;
        }
        break;
      }
    }
    this.firstTimeFlag = false;
  }

  createGroup(groupTemp) {
    groupTemp.groupSyncTime = this.settingProvider.getFireBaseTimeStamp();
    groupTemp.groupNumber = this.getNextGroupNumber();
    var promise = new Promise((resolve, reject) => {
      this.groupTableRef.child(this.settingProvider.time).set(groupTemp).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })

    });
    return promise;
  }

  updateGroup(groupId, groupTemp) {
    var promise = new Promise((resolve, reject) => {
      this.groupTableRef.child(groupId).update(groupTemp).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    })

    return promise;
  }

  getNextGroupNumber() {
    var nextNumber = 0;
    for (let groupId of this.groupTableInfoKeys) {
      if (nextNumber < this.groupTableInfo[groupId].groupNumber) {
        nextNumber = this.groupTableInfo[groupId].groupNumber;
      }
    }
    return nextNumber + 1;
  }

  joinGroup(groupId) {
    var promise = new Promise((resolve, reject) => {
      this.getGroupSynTime(groupId).then((res) => {
        if (res != this.groupTableInfo[groupId].groupSyncTime) {
          reject("Network busy, join later");
        }
        else {
          this.groupTableInfo[groupId].groupSyncTime = this.settingProvider.getFireBaseTimeStamp();
          this.groupTableInfo[groupId].members.push(this.userProvider.getUid());
          this.groupTableRef.child(groupId).update(this.groupTableInfo[groupId]).then((res) => {
            resolve(true)
          }).catch((err) => {
            reject(err);
          })
        }
      }).catch((err) => {
        reject(err);
      })

    })
    return promise;
  }

  dismissGroup(groupId) {
    var promise = new Promise((resolve, reject) => {
      this.groupTableRef.child(groupId).remove().then((res) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  quitGroup() {
    var groupId = this.userGroupId;
    var promise = new Promise((resolve, reject) => {
      if (this.userGroupId != null) {
        this.getGroupSynTime(groupId).then((res) => {
          if (res != this.groupTableInfo[groupId].groupSyncTime) {
            reject("Network busy, quit later");
          }
          else {
            this.groupTableInfo[groupId].groupSyncTime = this.settingProvider.getFireBaseTimeStamp();
            var index = this.groupTableInfo[groupId].members.indexOf(this.userProvider.getUid());
            if (index > -1) {
              this.groupTableInfo[groupId].members.splice(index, 1);
            }

            this.groupTableRef.child(groupId).update(this.groupTableInfo[groupId]).then((res) => {
              resolve(true)
            }).catch((err) => {
              reject(err);
            })
          }
        }).catch((err) => {
          reject(err);
        })
      }
      resolve(true);
    })
    return promise;
  }

  getGroupSynTime(groupId) {
    var promise = new Promise((resolve, reject) => {
      this.groupTableRef.child(groupId).child(this.groupSyncTime).once('value').then((snapshot) => {
        resolve(snapshot.val());
      }).catch((err) => {
        reject(err);
      });
    });
    return promise;
  }

}
