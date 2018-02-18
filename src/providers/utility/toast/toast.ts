import {Injectable} from '@angular/core';
import {ToastController} from 'ionic-angular';

@Injectable()
export class ToastProvider {

  constructor(private toastController: ToastController) {

  }

  showToast(toastMessage) {
    var toast = this.toastController.create(
      {
        message: '',
        duration: 3000,
        position: 'top'
      }
    );
    toast.setMessage(toastMessage);
    toast.present();
  }

}
