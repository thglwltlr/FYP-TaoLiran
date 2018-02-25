import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {GroupProvider} from '../../../providers/tables/group/group';
import {StatusProvider} from '../../../providers/tables/status/status';
import {UserProvider} from '../../../providers/tables/user/user';
import {ChatProvider} from '../../../providers/tables/chat/chat';

@IonicPage()
@Component({
  selector: 'page-group',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  constructor(private chatProvider: ChatProvider, private userProvider: UserProvider, private statusProvider: StatusProvider, public navCtrl: NavController, public navParams: NavParams, private groupProvider: GroupProvider) {
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

}
