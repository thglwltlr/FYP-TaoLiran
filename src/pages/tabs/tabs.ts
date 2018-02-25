import {Component, ViewChild} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, Tabs} from 'ionic-angular';
import {UserProvider} from '../../providers/tables/user/user';
import {GameProvider} from '../../providers/tables/game/game';
import {GroupProvider} from '../../providers/tables/group/group';
import {SettingProvider} from '../../providers/setting/setting';
import {StatusProvider} from '../../providers/tables/status/status';
import {ChatProvider} from '../../providers/tables/chat/chat';


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  @ViewChild('tabs') tabRef: Tabs;

  tab1: string = 'GamePage';
  tab2: string = 'ChatListPage';
  tab3: string = 'AboutPage';
  lastOnlineTimer;
  syncLocalTimer;

  constructor( private chatProvider: ChatProvider, private statusProvider: StatusProvider, private settingProvider: SettingProvider, private groupProvider: GroupProvider, private gameProvider: GameProvider, private events: Events, public userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.events.subscribe(this.userProvider.USER_TABLE_UPDATE);
    this.events.subscribe(this.gameProvider.GAME_TABLE_UPDATE);
    this.events.subscribe(this.groupProvider.GROUP_TABLE_UPDATE);
    this.events.subscribe(this.statusProvider.STATUS_TABLE_UPDATE);
    this.events.subscribe(this.chatProvider.CHAT_TABLE_UPDATE);

    this.syncLocalTimer = setInterval(() => {
      this.syncLocalTime();
    }, 10000);
    this.lastOnlineTimer = setInterval(() => {
      this.userProvider.updateLastOnline().then((res) => {
      }).catch((err) => {
      });
    }, 20000);
  }

  ionViewDidEnter() {
    this.tabRef.select(1);
  }

  ionViewWillEnter() {
    this.userProvider.checkFireBaseConnection();
    this.userProvider.getUserTable();
    this.gameProvider.getGameTable();
    this.groupProvider.getGroupTable();
    this.statusProvider.getStatusTable();
    this.chatProvider.getChatTable();
    this.syncLocalTime();
  }

  ionViewWillLeave() {
    console.log("will leave");
    this.events.unsubscribe(this.userProvider.USER_TABLE_UPDATE);
    this.events.unsubscribe(this.gameProvider.GAME_TABLE_UPDATE);
    this.events.unsubscribe(this.groupProvider.GROUP_TABLE_UPDATE);
    this.events.unsubscribe(this.statusProvider.STATUS_TABLE_UPDATE);
    this.events.unsubscribe(this.chatProvider.CHAT_TABLE_UPDATE);

    this.settingProvider.stopLocalTimer();
    clearInterval(this.lastOnlineTimer);
    clearInterval(this.syncLocalTimer);
  }

  syncLocalTime() {
    this.settingProvider.getEstimatedServerTimeOnce().then((res) => {
      this.settingProvider.startLocalTimer();
    }).catch((err) => {
    })
  }
}
