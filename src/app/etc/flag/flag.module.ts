import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlagPageRoutingModule } from './flag-routing.module';

import { FlagPage } from './flag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlagPageRoutingModule
  ],
  declarations: [FlagPage]
})
export class FlagPageModule {}
