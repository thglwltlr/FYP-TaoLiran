import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PuzzleSolvePage } from './puzzle-solve';
import {ComponentsModule} from '../../../components/components.module';

@NgModule({
  declarations: [
    PuzzleSolvePage,
  ],
  imports: [
    IonicPageModule.forChild(PuzzleSolvePage),
    ComponentsModule
  ],
})
export class PuzzleSolvePageModule {}
