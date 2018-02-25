import {Component, ElementRef, ViewChild} from '@angular/core';
import {Content, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Message} from '../../../assets/models/interfaces/Message';
import {ChatProvider} from '../../../providers/tables/chat/chat';
import {SettingProvider} from '../../../providers/setting/setting';
import {UserProvider} from '../../../providers/tables/user/user';
import {CameraProvider} from '../../../providers/utility/camera/camera';
import {GalleryModal} from 'ionic-gallery-modal';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  title: string;
  receiver: string;
  showNewMsg = false;
  messageTemp = {} as Message;
  lock = false;
  @ViewChild('content') content: Content;
  @ViewChild('textArea') textArea: ElementRef;

  constructor(private modalCtrl: ModalController, private cameraProvider: CameraProvider, private userProvider: UserProvider, private chatProvider: ChatProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.title = this.navParams.get('title');
    this.receiver = this.navParams.get('receiver');
    this.chatProvider.currentView = this.receiver;
    this.chatProvider.newMsgFlag = false;
    this.initMessage();
    this.scrollToBottom();
  }

  resize() {
    this.textArea.nativeElement.style.height = this.textArea.nativeElement.scrollHeight + 'px';
  }

  ionViewWillLeave() {
    this.chatProvider.currentView = '';
    this.chatProvider.newMsgFlag = false;
    this.cameraProvider.initStartUpImage('');
  }

  onScrollEnd() {
    if ((this.content.getContentDimensions().scrollHeight - this.content.getContentDimensions().scrollTop) <= (this.content.getContentDimensions().contentHeight + this.content.getContentDimensions().contentBottom)) {
      this.showNewMsg = false;
      this.chatProvider.newMsgFlag = false;
    } else {
      this.showNewMsg = true;
    }
  }

  chooseImage() {
    this.cameraProvider.presentChoice();
  }

  initMessage() {
    this.messageTemp = {} as Message;
    this.messageTemp.content = '';
    this.messageTemp.type = this.chatProvider.text;
    this.scrollToBottom();
    this.cameraProvider.initStartUpImage('');
    this.lock = false;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 500);
  }

  sendMessage() {
    this.lock = true;
    this.chatProvider.sendMessage(this.receiver, this.messageTemp).then((res) => {
      this.initMessage();
    }).catch((err) => {
      this.lock = false;
    });
  }

  cancelUpload() {
    this.initMessage();
  }

  openImage(url) {
    var photos = [];
    photos.push({
      url: url
    })
    let modal = this.modalCtrl.create(GalleryModal, {
        photos: photos,
        initialSlide: 0
      })
    ;
    modal.present();
  }

  uploadImage() {
    this.cameraProvider.uploadImage(this.cameraProvider.chatImgRef).then((url: any) => {
      this.messageTemp.content = url;
      this.messageTemp.type = this.chatProvider.image;
      this.sendMessage();
    }).catch((err) => {
    });
  }

}
