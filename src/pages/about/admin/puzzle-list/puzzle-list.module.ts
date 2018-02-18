import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PuzzleListPage } from './puzzle-list';

@NgModule({
  declarations: [
    PuzzleListPage,
  ],
  imports: [
    IonicPageModule.forChild(PuzzleListPage),
  ],
})
export class PuzzleListPageModule {}
