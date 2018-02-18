import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationListPage } from './location-list';

@NgModule({
  declarations: [
    LocationListPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationListPage),
  ],
})
export class LocationListPageModule {}
