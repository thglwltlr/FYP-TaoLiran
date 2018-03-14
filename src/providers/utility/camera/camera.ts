import {Injectable} from '@angular/core';
import {ActionSheetController, Events, Platform} from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import * as firebase from 'firebase';
import {SettingProvider} from '../../setting/setting';
import {UserProvider} from '../../tables/user/user';
import {normalizeURL} from 'ionic-angular';

@Injectable()
export class CameraProvider {
  options: CameraOptions;
  base64Image: string;
  base64ImgRaw: string;
  fireStore = firebase.storage();
  readonly groupImgRef = '/groupImage';
  readonly groupDefault = 'https://firebasestorage.googleapis.com/v0/b/fyp03-136e5.appspot.com/o/groupImageDefault.png?alt=media&token=11ae859f-3a99-477a-a50b-24f97b002c3a';
  readonly imgHeader = "data:image/png;base64,";
  readonly userDefault = 'https://firebasestorage.googleapis.com/v0/b/myapp-4eadd.appspot.com/o/chatterplace.png?alt=media&token=e51fa887-bfc6-48ff-87c6-e2c61976534e';
  readonly userImgRef = '/userImage';
  subChild: string;
  readonly puzzleDefault = 'https://firebasestorage.googleapis.com/v0/b/fyp03-136e5.appspot.com/o/puzzleImageDefault.png?alt=media&token=797e0b0a-152c-41be-b9ff-f3f0f838aa00';
  readonly puzzleRef = '/puzzleImage';
  readonly chatImgRef = 'chatImage';

  constructor(private platform: Platform, private userProvider: UserProvider, private settingProvider: SettingProvider, private camera: Camera, private actionSheetCtrl: ActionSheetController) {

  }

  initStartUpImage(startUpImage) {
    this.base64Image = startUpImage;
  }


  initGallery() {
    this.options = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      // destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      // correctOrientation: true
    }
  }

  initCamera() {
    this.options = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      // destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000
    }
  }

  getPicture() {
    var promise = new Promise((resolve, reject) => {
      this.camera.getPicture(this.options).then((imageData) => {
        this.base64Image = this.imgHeader + imageData;
        this.base64ImgRaw = imageData;
        resolve(true);
      }, (err) => {
        reject(err);
      });
    });
    return promise;
  }

  uploadImage(chosenRef) {
    var imgBlob = this.getBlob();
    if (chosenRef == this.userImgRef)
      this.subChild = this.userProvider.getUid();
    else
      this.subChild = this.settingProvider.time.toString();
    var promise = new Promise((resolve, reject) => {
      var imgRef = this.fireStore.ref(chosenRef).child(this.subChild);
      imgRef.put(imgBlob).then((res) => {
        imgRef.getDownloadURL().then((res) => {
          if (this.platform.is('ios')) {
            this.base64Image = res;
          }
          resolve(res);
        }).catch((err) => {
          reject(err);
        })
      })
    });
    return promise;
  }

  getBlob() {
    var byteCharacters = atob(this.base64ImgRaw);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    var byteArray = new Uint8Array(byteNumbers);
    var imgBlob = new Blob([byteArray], {type: 'image/jpeg'});
    this.base64ImgRaw = null;
    return imgBlob;
  }

  presentChoiceNotSupportedForIOS() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Source:',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.initGallery();
            this.getPicture().then((res) => {
            }).catch((err) => {
            });
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.initCamera();
            this.getPicture().then((res) => {
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

}
