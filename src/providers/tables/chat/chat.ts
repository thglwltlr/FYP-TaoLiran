import {Injectable} from '@angular/core';
import {Events} from 'ionic-angular';
import {SettingProvider} from '../../setting/setting';
import * as firebase from 'firebase';
import {Message} from '../../../assets/models/interfaces/Message';
import {UserProvider} from '../user/user';


@Injectable()
export class ChatProvider {
  readonly CHAT_TABLE = '/ChatTable';
  chatTableRef = firebase.database().ref(this.CHAT_TABLE);
  readonly CHAT_TABLE_UPDATE = "chatTableUpdate";
  chatTableInfo = [] as Message[][];
  chatTableInfoKeys = [];
  firstTimeFlag = true;

  constructor(private userProvider: UserProvider, private events: Events, private settingProvider: SettingProvider) {

  }

  getChatTable() {
    this.chatTableRef.on('value', (snapshot) => {
      var infoTemp = this.settingProvider.snapshotToArray(snapshot);
      for (let receiverId of Object.keys(infoTemp)) {
        this.chatTableInfo[receiverId] = [] as Message[];
        for (let messageId of Object.keys(infoTemp[receiverId])) {
          this.chatTableInfo[receiverId][messageId] = infoTemp[receiverId][messageId];
        }
        this.chatTableInfoKeys[receiverId] = Object.keys(this.chatTableInfo[receiverId]);
      }
      this.events.publish(this.CHAT_TABLE_UPDATE);
      this.firstTimeFlag = false;
    });
  }

  sendMessage(receiver, messageTemp: Message) {
    messageTemp.time = this.settingProvider.getFireBaseTimeStamp();
    messageTemp.sender = this.userProvider.getUid();

    var promise = new Promise((resolve, reject) => {
      this.chatTableRef.child(receiver).push(messageTemp).then((res) => {
        console.log("push response", res);
      })
    })
    return promise;
  }

}
