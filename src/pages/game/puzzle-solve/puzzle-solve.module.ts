import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PuzzleSolvePage } from './puzzle-solve';

@NgModule({
  declarations: [
    PuzzleSolvePage,
  ],
  imports: [
    IonicPageModule.forChild(PuzzleSolvePage),
  ],
})
export class PuzzleSolvePageModule {}
