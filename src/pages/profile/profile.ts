import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams} from 'ionic-angular';
import {User} from '../../assets/models/interfaces/User';
import {UserProvider} from '../../providers/tables/user/user';
import {CameraProvider} from '../../providers/utility/camera/camera';
import {LoaderProvider} from '../../providers/utility/loader/loader';
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

  constructor(private events: Events, private toastProvider: ToastProvider, private settingProvider: SettingProvider, private cameraProvider: CameraProvider, private loaderProvider: LoaderProvider, private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.uid = this.navParams.get('uid');
    if (this.uid == null || this.uid == '')
      this.initUser();
    else {
      this.userTemp = this.userProvider.userTableInfo[this.uid];
    }
    this.cameraProvider.initStartUpImage(this.userTemp.photoUrl);
    this.events.subscribe('image', (dataImage) => {
      this.loaderProvider.showLoader("Updating");
      this.update();
    })
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
    this.cameraProvider.presentChoice();
  }

  update() {

    this.lock = true;
    if (this.userTemp.photoUrl != this.cameraProvider.base64Image) {
      this.cameraProvider.uploadImage(this.cameraProvider.userImgRef).then((url: any) => {
        this.userTemp.photoUrl = url;
        this.updateFurther();
      }).catch((err) => {
        this.lock = false;
        this.loaderProvider.dismissLoader();
      });
    }
    else {
      this.updateFurther();
    }
  }

  updateFurther() {
    this.userProvider.updateUser(this.userTemp).then((res) => {
      this.loaderProvider.dismissLoader();
      this.events.unsubscribe('image');
      if (this.uid == null || this.uid == '') {
        this.navCtrl.push("TabsPage");
      }
      else {
        this.navCtrl.pop();
      }
      this.lock = false;
    })
      .catch((err) => {
        this.loaderProvider.dismissLoader();
        this.lock = false;
      })

  }

}
