import {Injectable} from '@angular/core';
import {LoadingController} from 'ionic-angular';

@Injectable()
export class LoaderProvider {
  loader: any;

  constructor(private loadingController: LoadingController) {

  }

  showLoader(loaderMessage) {
    this.loader = this.loadingController.create(
      {content: loaderMessage});
    this.loader.present();
  }

  dismissLoader() {
    if (this.loader != null) {
      this.loader.dismiss();
    }
  }

}
