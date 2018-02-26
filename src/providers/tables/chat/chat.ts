import {Injectable} from '@angular/core';
import {Content, Events} from 'ionic-angular';
import {SettingProvider} from '../../setting/setting';
import * as firebase from 'firebase';
import {Message} from '../../../assets/models/interfaces/Message';
import {UserProvider} from '../user/user';
import {GroupProvider} from '../group/group';
import {NotificationProvider} from '../../utility/notification/notification';


@Injectable()
export class ChatProvider {
  readonly CHAT_TABLE = '/ChatTable';
  chatTableRef = firebase.database().ref(this.CHAT_TABLE);
  readonly CHAT_TABLE_UPDATE = "chatTableUpdate";
  chatTableInfo = [] as Message[][];
  chatTableInfoKeys = [];
  firstTimeFlag = true;
  newMsgNo = [];
  readonly public = 'public';
  totalMsgNo = 0;
  currentView = '';
  newMsgFlag = false;
  readonly text = 'text';
  readonly image = 'image';

  constructor(private notificationProvider: NotificationProvider, private groupProvider: GroupProvider, private userProvider: UserProvider, private events: Events, private settingProvider: SettingProvider) {

  }

  getChatTable() {
    this.chatTableRef.on('value', (snapshot) => {
      var infoTemp = this.settingProvider.snapshotToArray(snapshot);
      for (let receiverId of Object.keys(infoTemp)) {
        if (!this.groupProvider.firstTimeFlag && (this.groupProvider.userGroupId == null || this.groupProvider.userGroupId == ''))
          break;
        if (receiverId != this.groupProvider.userGroupId && receiverId != this.public)
          continue;
        if (this.chatTableInfo[receiverId] == null) {
          this.chatTableInfo[receiverId] = [] as Message[]
        }
        for (let messageId of Object.keys(infoTemp[receiverId])) {
          if (this.newMsgNo[receiverId] == null) {
            this.newMsgNo[receiverId] = 0;
          }
          if (this.chatTableInfo[receiverId][messageId] == null) {
            this.chatTableInfo[receiverId][messageId] = infoTemp[receiverId][messageId];
            if (this.currentView != receiverId
              && this.chatTableInfo[receiverId][messageId].sender != this.userProvider.getUid() && !this.firstTimeFlag) {
              this.notificationProvider.showNotification("new message", "You have received new message!");
              this.newMsgNo[receiverId]++;
            }
            if (this.currentView == receiverId
              && this.chatTableInfo[receiverId][messageId].sender != this.userProvider.getUid() && !this.firstTimeFlag) {
              this.newMsgFlag = true;
            }
          }
        }
        this.chatTableInfoKeys[receiverId] = Object.keys(this.chatTableInfo[receiverId]);
        this.getNewMsgCount();
      }
      this.events.publish(this.CHAT_TABLE_UPDATE);
      this.firstTimeFlag = false;
    });
  }


  getNewMsgCount() {
    if (this.newMsgNo == null)
      return;
    this.totalMsgNo = 0;
    for (let receiverId of Object.keys(this.newMsgNo)) {
      if (receiverId == this.groupProvider.userGroupId) {
        this.totalMsgNo += this.newMsgNo[receiverId];
      }
    }
  }

  sendMessage(receiver, messageTemp: Message) {
    messageTemp.time = this.settingProvider.getFireBaseTimeStamp();
    messageTemp.sender = this.userProvider.getUid();

    var promise = new Promise((resolve, reject) => {
      this.chatTableRef.child(receiver).push(messageTemp).then((res) => {
        resolve(true);
      })
    })
    return promise;
  }

}
