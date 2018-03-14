import {Component, ElementRef, ViewChild} from '@angular/core';
import {Content, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {Message} from '../../../assets/models/interfaces/Message';
import {ChatProvider} from '../../../providers/tables/chat/chat';
import {UserProvider} from '../../../providers/tables/user/user';
import {CameraProvider} from '../../../providers/utility/camera/camera';
import {GalleryModal} from 'ionic-gallery-modal';
import {NotificationProvider} from '../../../providers/utility/notification/notification';
import {LocalNotifications} from '@ionic-native/local-notifications';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  title: string;
  receiver: string;
  messageTemp = {} as Message;
  lock = false;
  @ViewChild('content') content: Content;
  @ViewChild('textArea') textArea: ElementRef;
  defaultHeight = 0;
  previousHeight = 0;

  constructor(private notificationProvider: NotificationProvider, private modalCtrl: ModalController, private cameraProvider: CameraProvider, private userProvider: UserProvider, private chatProvider: ChatProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.title = this.navParams.get('title');
    this.receiver = this.navParams.get('receiver');
    this.chatProvider.currentView = this.receiver;
    this.chatProvider.newMsgFlag = false;
    this.initMessage();
    this.notificationProvider.clearAllNotification();

  }


  ionViewDidLoad() {
    this.scrollToBottom();
    this.defaultHeight = this.textArea.nativeElement.scrollHeight + 10;
    this.previousHeight = this.defaultHeight;
    this.textArea.nativeElement.style.height = this.defaultHeight + 'px';
  }

  resize() {
    if ((this.textArea.nativeElement.scrollHeight) <= this.previousHeight) {
      return;
    } else {
      this.previousHeight = 10 + this.textArea.nativeElement.scrollHeight;
      this.textArea.nativeElement.style.height = this.previousHeight + 'px'

    }
  }

  ionViewWillLeave() {
    this.chatProvider.currentView = '';
    this.chatProvider.newMsgFlag = false;
    this.cameraProvider.initStartUpImage('');
  }


  onScrollEnd() {
    if ((this.content.getContentDimensions().scrollHeight - this.content.getContentDimensions().scrollTop) <= (this.content.getContentDimensions().contentHeight + this.content.getContentDimensions().contentBottom)) {
      this.chatProvider.newMsgFlag = false;
    } else {
    }
  }

  chooseImage() {
    this.cameraProvider.presentChoiceNotSupportedForIOS();
  }

  initMessage() {
    this.messageTemp = {} as Message;
    this.messageTemp.content = '';
    this.messageTemp.type = this.chatProvider.text;
    this.cameraProvider.initStartUpImage('');
    this.lock = false;
  }

  sendMessage() {
    this.lock = true;
    if (this.messageTemp.type == this.chatProvider.text) {
      if (this.messageTemp.content == null || this.messageTemp.content.trim() == '') {
        this.messageTemp.content = '';
        return;
      }

    }
    this.chatProvider.sendMessage(this.receiver, this.messageTemp).then((res) => {
      this.initMessage();
      this.scrollToBottom();
      this.previousHeight = this.defaultHeight;
      this.textArea.nativeElement.style.height = this.defaultHeight + 'px';
    }).catch((err) => {
      this.lock = false;
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
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
    this.lock = true;
    this.cameraProvider.uploadImage(this.cameraProvider.chatImgRef).then((url: any) => {
      this.messageTemp.content = url;
      this.messageTemp.type = this.chatProvider.image;
      this.sendMessage();
    }).catch((err) => {
      this.lock = false;
    });
  }

}
