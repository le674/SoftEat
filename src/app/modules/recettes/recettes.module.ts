import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecettesRoutingModule } from './recettes-routing.module';
import { AppMenuComponent } from './app.menu/app.menu.component';
import { AppPlatsComponent } from './app.plats/app.plats.component';
import { AppPreparationsComponent } from './app.preparations/app.preparations.component';
import {MatDialogModule } from '@angular/material/dialog';
import { AddMenuComponent } from './app.menu/add.menu/add.menu.component';
import { MatButtonModule } from '@angular/material/button';
import { AddPreparationsComponent } from './app.preparations/add.preparations/add.preparations.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';



@NgModule({
  declarations: [
   AppMenuComponent,
   AppPlatsComponent,
   AppPreparationsComponent,
   AddMenuComponent,
   AddPreparationsComponent
  ],
  imports: [
    CommonModule,
    RecettesRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatOptionModule
  ],
  exports: [
    AppMenuComponent,
    AppPlatsComponent,
    AppPreparationsComponent
  ],
})
export class RecettesModule { }
