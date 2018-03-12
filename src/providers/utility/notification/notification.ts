import {Injectable} from '@angular/core';
import {LocalNotifications} from '@ionic-native/local-notifications';

@Injectable()
export class NotificationProvider {
  readonly iconUrl = 'https://firebasestorage.googleapis.com/v0/b/fyp03-136e5.appspot.com/o/Doge.png?alt=media&token=e0ff153d-f580-414c-b45c-9e07307705c7';

  constructor(private localNotifications: LocalNotifications) {

  }

  clearAllNotification() {
    this.localNotifications.clearAll().then(() => {
    }).catch((err) => {
    })
  }

  showNotification(titleContent, textContent) {
    this.localNotifications.clearAll().then(() => {
      this.localNotifications.schedule({
        id: 1,
        title: titleContent,
        text: textContent,
        smallIcon: this.iconUrl,
        icon: this.iconUrl
      });
    }).catch((err) => {
      console.log(err);
    })

  }


}
