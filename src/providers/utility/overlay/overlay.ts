import {Injectable} from '@angular/core';

@Injectable()
export class OverlayProvider {

  showOverLay = false;
  showCanvas = false;
  tabBarElement: any;

  constructor() {
    this.initOverlays();
  }

  showDraw() {
    this.showOverLay = true;
    this.showCanvas = true;

  }

  initOverlays() {
    this.showOverLay = false;
    this.showCanvas = false;
   
  }
}
