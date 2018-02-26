import {Injectable} from '@angular/core';
import {LocalNotifications} from '@ionic-native/local-notifications';

@Injectable()
export class NotificationProvider {

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
        text: textContent
      });
    }).catch((err) => {
      console.log(err);
    })

  }


}
