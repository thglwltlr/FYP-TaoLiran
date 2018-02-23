import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from '../../../providers/tables/group/group';
import {StatusProvider} from '../../../providers/tables/status/status';

@IonicPage()
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html',
})
export class GroupListPage {

  lock = false;

  constructor(private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController, private statusProvider: StatusProvider, private groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.lock = false;
  }

  createGroup() {
    this.navCtrl.push("GroupProfilePage");
  }

  showDismissAlert(groupId) {
    let alert = this.alertCtrl.create({
      title: 'Confirm dismiss',
      message: 'If group is dismissed, all team members will have to join another group.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Dismiss',
          handler: () => {
            this.groupProvider.dismissGroup(this.groupProvider.userGroupId).then((res) => {
            }).catch((err) => {
            });
          }
        }
      ]
    });
    alert.present();
  }

  showGroupOptions(groupId) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options:',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.editGroup(groupId);
          }
        },
        {
          text: 'Dismiss',
          handler: () => {
            this.showDismissAlert(groupId);
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

  joinGroup(groupId) {
    this.lock = true;
    if (this.groupProvider.groupLeaderFlag) {
      this.groupProvider.dismissGroup(this.groupProvider.userGroupId).then((res) => {
        if (res == true) {
          this.joinGroupFurther(groupId);
        }
      }).catch((err) => {
      });
    }
    else {
      if (this.groupProvider.userGroupId == null || this.groupProvider.userGroupId == '') {
        this.joinGroupFurther(groupId);
      }
      else {
        this.quitGroup().then((res) => {
            if (res) {
              this.joinGroupFurther(groupId);
            }
          }
        ).catch((err) => {
          console.log(err);
        })
      }

    }
  }

  clearSearch() {
    this.groupProvider.filterString = '';
    this.groupProvider.filterGroupTable();
  }

  searchGroup(searchBar) {
    var query = searchBar.target.value;
    if (query == '' || query == null || query.trim() == '' || query.trim() == null) {
      this.clearSearch();
      return;
    }
    if (!isNaN(query)) {
      query = parseInt(query) + '';
    }
    query = query.toLowerCase();
    this.groupProvider.filterString = query;
    this.groupProvider.filterGroupTable();
  }

  ionViewWillLeave() {
    this.groupProvider.filterString = '';
  }


  joinGroupFurther(groupId) {
    this.groupProvider.joinGroup(groupId).then((res) => {
      console.log(res);
      this.lock = false;
    }).catch((err) => {
      console.log(err);
      this.lock = false;
    })
  }

  quitGroup() {
    var promise = new Promise((resolve, reject) => {
      this.groupProvider.quitGroup().then((res) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  editGroup(groupId) {
    this.navCtrl.push("GroupProfilePage", {'groupId': groupId});
  }
}
