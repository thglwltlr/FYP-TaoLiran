import {Component} from '@angular/core';
import {ActionSheetController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from '../../assets/models/interfaces/User';
import {UserProvider} from '../../providers/tables/user/user';
import {CameraProvider} from '../../providers/utility/camera/camera';
import {SettingProvider} from '../../providers/setting/setting';
import {ToastProvider} from '../../providers/utility/toast/toast';


@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userTemp = {} as User;
  lock = false;
  uid = '';
  nameChecked = false;

  constructor(private actionSheetCtrl: ActionSheetController, private toastProvider: ToastProvider, private settingProvider: SettingProvider, private cameraProvider: CameraProvider, private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.uid = this.navParams.get('uid');
    if (this.uid == null || this.uid == '')
      this.initUser();
    else {
      this.userTemp = this.userProvider.userTableInfo[this.uid];
    }
    this.cameraProvider.initStartUpImage(this.userTemp.photoUrl);
    this.lock = false;
  }

  changeName() {
    this.nameChecked = false;
  }

  initUser() {
    this.userTemp = {} as User;
    this.userTemp.name = '';
    this.userTemp.edited = false;
    this.userTemp.photoUrl = this.cameraProvider.userDefault;

  }

  checkName() {
    if (!this.settingProvider.checkName(this.userTemp.name)) {
      return;
    }
    this.nameChecked = true;
  }

  chooseImage() {
    this.presentChoice();
  }

  presentChoice() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Source:',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.cameraProvider.initGallery();
            this.cameraProvider.getPicture().then((res) => {
              this.update();
            }).catch((err) => {
            });
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.cameraProvider.initCamera();
            this.cameraProvider.getPicture().then((res) => {
              this.update();
            }).catch((err) => {
            });
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

  update() {
    console.log("update profile");
    this.lock = true;
    if (this.userTemp.photoUrl != this.cameraProvider.base64Image) {
      this.cameraProvider.uploadImage(this.cameraProvider.userImgRef).then((url: any) => {
        this.userTemp.photoUrl = url;
        this.updateFurther();
      }).catch((err) => {
        this.lock = false;
      });
    }
    else {
      this.updateFurther();
    }
  }

  updateFurther() {
    this.userProvider.updateUser(this.userTemp).then((res) => {
      if (this.uid == null || this.uid == '') {
        this.navCtrl.push("TabsPage");
      }
      else {
        this.navCtrl.pop();
      }
      this.lock = false;
    })
      .catch((err) => {
        this.lock = false;
      })
  }

  ionViewWillLeave() {
  }


}
