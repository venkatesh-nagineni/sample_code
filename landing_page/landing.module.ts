import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LandingPage } from './landing';
import {PipesModule} from '../../pipes/pipes.module'
@NgModule({
  declarations: [
    LandingPage,
  ],
  imports: [
    IonicPageModule.forChild(LandingPage),
    PipesModule
  ]
})
export class LandingPageModule {}
