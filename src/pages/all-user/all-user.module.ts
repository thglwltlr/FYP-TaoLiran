import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllUserPage } from './all-user';

@NgModule({
  declarations: [
    AllUserPage,
  ],
  imports: [
    IonicPageModule.forChild(AllUserPage),
  ],
})
export class AllUserPageModule {}
