import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  navNumber = 0;
  conversationContent = ["Hi, I am Prof. Andy! In 2008, I developed the first real Artificial Intelligent – ‘Eccentra’, to assist me in developing time-travelling theory and time-travelling machine. With the help from ‘Eccentra’, we finally did it and it garnered me a Nobel prize."
    , "Hi, I am ‘Eccentra’. I am a human-shape Artificial Intelligent with the capability to learn like a real human being. I helped Prof. Andy to develop time-travelling theory and time-travelling machine. No one admires Prof. Andy better than I do!"
    , "‘Eccentra’ is indeed a good assistant. However, it is not complete…to some reason, which I can’t tell you, there is still 20% of codes left undeveloped."
    , "I believe I can do more to help Prof. Andy if I can get the remaining 20% of codes. These coeds are hidden somewhere in school of EEE. The warriors of EEE, I urge you to solve the puzzle and find the codes for me!"];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  changeNav(adder) {
    this.navNumber += adder;
  }

  ionViewDidLoad() {

  }

}
