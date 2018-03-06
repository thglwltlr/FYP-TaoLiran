import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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

  constructor(private toastProvider: ToastProvider, private settingProvider: SettingProvider, private cameraProvider: CameraProvider, private loaderProvider: LoaderProvider, private userProvider: UserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.uid = this.navParams.get('uid');
    if (this.uid == null || this.uid == '')
      this.initUser();
    else {
      this.userTemp = this.userProvider.userTableInfo[this.uid];
    }
    this.cameraProvider.initStartUpImage(this.userTemp.photoUrl);
  }

  initUser() {
    this.userTemp = {} as User;
    this.userTemp.name = '';
    this.userTemp.edited = false;
    this.userTemp.photoUrl = this.cameraProvider.userDefault;
  }

  chooseImage() {
    this.cameraProvider.presentChoice();
  }

  update() {
    if (!this.settingProvider.checkName(this.userTemp.name)) {
      return;
    }
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
      this.navCtrl.push("TabsPage");
      this.lock = false;
    })
      .catch((err) => {
        this.lock = false;
      })

  }

}
