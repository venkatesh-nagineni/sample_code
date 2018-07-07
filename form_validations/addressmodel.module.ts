import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressmodelPage } from './addressmodel';
import {PipesModule} from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    AddressmodelPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressmodelPage),
    PipesModule
  ],
})
export class AddressmodelPageModule {}
