import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Message} from '../../../assets/models/interfaces/Message';
import {ChatProvider} from '../../../providers/tables/chat/chat';
import {SettingProvider} from '../../../providers/setting/setting';
import {UserProvider} from '../../../providers/tables/user/user';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  title: string;
  receiver: string;
  messageTemp = {} as Message;

  constructor(private userProvider:UserProvider,private chatProvider: ChatProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.title = this.navParams.get('title');
    this.receiver = this.navParams.get('receiver');
    console.log(this.receiver);
    this.initMessage();
  }

  initMessage() {
    this.messageTemp = {} as Message;
    this.messageTemp.content = '';
    this.messageTemp.type = 'text';
  }

  sendMessage() {
    this.chatProvider.sendMessage(this.receiver, this.messageTemp).then((res) => {
      this.initMessage();
    }).catch((err) => {
    });
  }


}
