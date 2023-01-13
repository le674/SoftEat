import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecettesRoutingModule } from './recettes-routing.module';
import { AppMenuComponent } from './app.menu/app.menu.component';
import { AppPlatsComponent } from './app.plats/app.plats.component';
import { AppPreparationsComponent } from './app.preparations/app.preparations.component';



@NgModule({
  declarations: [
   AppMenuComponent,
   AppPlatsComponent,
   AppPreparationsComponent
  ],
  imports: [
    CommonModule,
    RecettesRoutingModule
  ],
  exports: [
    AppMenuComponent,
    AppPlatsComponent,
    AppPreparationsComponent
  ],
})
export class RecettesModule { }
