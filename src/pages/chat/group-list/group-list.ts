import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from '../../../providers/tables/group/group';
import {StatusProvider} from '../../../providers/tables/status/status';
import {ToastProvider} from '../../../providers/utility/toast/toast';

@IonicPage()
@Component({
  selector: 'page-group-list',
  templateUrl: 'group-list.html',
})
export class GroupListPage {

  lock = false;

  constructor(private toastProvider: ToastProvider, private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController, private statusProvider: StatusProvider, private groupProvider: GroupProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.lock = false;
  }

  createGroup() {
    if (!this.groupProvider.groupLeaderFlag
      && this.statusProvider.groupStatus != null
      && this.statusProvider.groupStatus.startTime != null
      && this.statusProvider.groupStatus.startTime != ''
    ) {
      this.toastProvider.showToast("Your team has started, ask your team leader to end game or invite you out!");
      return;
    }
    this.navCtrl.push("GroupProfilePage");
  }

  showDismissAlert() {
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
            this.statusProvider.deleteGroupStatus(this.groupProvider.userGroupId).then((res) => {
            }).catch((err) => {
            });
          }
        }
      ]
    });
    alert.present();
  }

  showGroupOptions() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Options:',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.editGroup();
          }
        },
        {
          text: 'Dismiss',
          handler: () => {
            this.showDismissAlert();
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
      this.statusProvider.deleteGroupStatus(this.groupProvider.userGroupId).then((res) => {
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
    this.statusProvider.getStatusTableOnce();
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
    if (!this.groupProvider.groupLeaderFlag
      && this.statusProvider.groupStatus != null
      && this.statusProvider.groupStatus.startTime != null
      && this.statusProvider.groupStatus.startTime != ''
    ) {
      this.toastProvider.showToast("Your team has started, ask your team leader to end game or invite you out!");
      return;
    }
    var promise = new Promise((resolve, reject) => {
      this.groupProvider.quitGroup().then((res) => {
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
    });
    return promise;
  }

  editGroup() {
    this.navCtrl.push("GroupProfilePage", {'groupId': this.groupProvider.userGroupId});
  }
}
