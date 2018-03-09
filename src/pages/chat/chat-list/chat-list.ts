import {Component} from '@angular/core';
import {ActionSheetController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from '../../../providers/tables/group/group';
import {StatusProvider} from '../../../providers/tables/status/status';
import {UserProvider} from '../../../providers/tables/user/user';
import {ChatProvider} from '../../../providers/tables/chat/chat';
import {NotificationProvider} from '../../../providers/utility/notification/notification';

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  constructor(private alertCtrl: AlertController, private actionSheetCtrl: ActionSheetController, private chatProvider: ChatProvider, private userProvider: UserProvider, private statusProvider: StatusProvider, public navCtrl: NavController, public navParams: NavParams, private groupProvider: GroupProvider) {
  }

  publicChat() {
    this.viewedChat(this.chatProvider.public);
    this.navCtrl.push("ChatPage", {"title": "Public Chat", "receiver": this.chatProvider.public});
  }

  groupChat() {
    this.viewedChat(this.groupProvider.userGroupId);
    this.navCtrl.push("ChatPage", {"title": "Group Chat", "receiver": this.groupProvider.userGroupId});
  }

  joinGroup() {
    this.navCtrl.push("GroupListPage");
  }

  viewedChat(receiverId) {
    this.chatProvider.newMsgNo[receiverId] = 0;
    this.chatProvider.getNewMsgCount();
  }

  showGroupLeaderOption() {

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Group Leader Option:',
      buttons: [
        {
          text: 'Manage Group Member',
          handler: () => {
            this.navCtrl.push('AllUserPage', {'allUserFlag': false});
          }
        },
        {
          text: 'End Game',
          handler: () => {
            this.confirmEndGame();
          }
        },
        {
          text: 'Edit Group Profile',
          handler: () => {
            this.editGroup();
          }
        },
        {
          text: 'Dismiss Group',
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

  editGroup() {
    this.navCtrl.push("GroupProfilePage", {'groupId': this.groupProvider.userGroupId});
  }

  confirmEndGame() {
    let alert = this.alertCtrl.create({
      title: 'Confirm ending game',
      message: 'Your team will have to start over!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'End it!',
          handler: () => {
            this.statusProvider.groupForceEnd().then((res) => {

            }).catch((err) => {

            });
          }
        }
      ]
    });
    alert.present();
  }

}
