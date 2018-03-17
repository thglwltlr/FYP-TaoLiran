import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';


@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  readonly forwardSlash = /\//g;
  readonly backSlash = /\\/g;
  navNumber = 0;
  conversationContent = ["Hi, I am \\Prof. X/! In \\2008/, I developed the first Artificial Intelligent ‘\\Eccentra/’, to assist me in completing the \\time travelling theory/. With the help from ‘Eccentra’,  we finally developed the time-travelling machine and it garnered me a Nobel prize."
    , "Hi, I am ‘Eccentra’. I am a \\human-shape/ Artificial Intelligent with the capability to learn like a real human being. I \\helped/ Prof. X to develop time-travelling theory and time-travelling machine. No one admires Prof. X better than I do!"
    , "‘Eccentra’ is indeed a good assistant. However, it is \\not complete/…to some reason, which I can’t tell you, there is still \\20% of codes left undeveloped/."
    , "I believe I can do more to help Prof. X if I can get the \\remaining 20% of codes/. These codes are \\hidden somewhere in School of EEE/. The warriors of EEE, I urge you to solve the puzzle and find the codes for me!"];

  constructor(private domSanitizer: DomSanitizer, public navCtrl: NavController, public navParams: NavParams) {
  }

  changeNav(adder) {
    this.navNumber += adder;
  }

  ionViewDidLoad() {

  }

  back() {
    this.navCtrl.pop();
  }

}
