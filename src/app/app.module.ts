import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import {SettingProvider} from '../providers/setting/setting';
import {config} from "./firebaseConfig";
import {AngularFireModule} from "angularfire2";
import {AngularFireAuth} from "angularfire2/auth";
import {UserProvider} from '../providers/tables/user/user';
import {Network} from '@ionic-native/network';
import {ToastProvider} from '../providers/utility/toast/toast';
import {LoaderProvider} from '../providers/utility/loader/loader';
import {Device} from '@ionic-native/device';
import {OpenPage} from '../pages/open/open';
import {GameProvider} from '../providers/tables/game/game';
import {StatusProvider} from '../providers/tables/status/status';
import {GroupProvider} from '../providers/tables/group/group';
import {ChatProvider} from '../providers/tables/chat/chat';
import {Camera} from '@ionic-native/camera';
import {CameraProvider} from '../providers/utility/camera/camera';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';

@NgModule({
  declarations: [
    MyApp,
    OpenPage
  ],
  imports: [
    BrowserModule,
    // IonicModule.forRoot(MyApp),
    IonicModule.forRoot(MyApp, {tabsPlacement: 'top', scrollAssist: false, autoFocusAssist: true}),
    AngularFireModule.initializeApp(config),
    ionicGalleryModal.GalleryModalModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    OpenPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SettingProvider,
    UserProvider,

    AngularFireAuth,
    Network,
    ToastProvider,
    UserProvider,
    LoaderProvider,
    Device,
    GameProvider,
    StatusProvider,
    GroupProvider,
    ChatProvider,
    Camera,
    CameraProvider,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal.GalleryModalHammerConfig,
    }
  ]
})
export class AppModule {
}
