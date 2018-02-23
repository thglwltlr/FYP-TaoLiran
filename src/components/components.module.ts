import { NgModule } from '@angular/core';
import { CanvasDrawComponent } from './canvas-draw/canvas-draw';
import {IonicModule} from 'ionic-angular';
@NgModule({
	declarations: [CanvasDrawComponent],
	imports: [IonicModule],
	exports: [CanvasDrawComponent]
})
export class ComponentsModule {}
