import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecettesRoutingModule } from './recettes-routing.module';
import { AppMenuComponent } from './app.menu/app.menu.component';
import { AppPlatsComponent } from './app.plats/app.plats.component';
import { AppPreparationsComponent } from './app.preparations/app.preparations.component';
import {MatTabsModule} from '@angular/material/tabs'; 
import {MatDialogModule } from '@angular/material/dialog';
import { AddMenuComponent } from './app.menu/add.menu/add.menu.component';
import { MatButtonModule } from '@angular/material/button';
import { AddPreparationsComponent } from './app.preparations/add.preparations/add.preparations.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list'; 
import { DisplayPreparationsComponent } from './app.preparations/display.preparation/display.preparations/display.preparations.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddPlatsComponent } from './app.plats/add.plats/add.plats.component';
import { DisplayPlatsComponent } from './app.plats/display.plats/display.plats.component';
import { DisplayMenuComponent } from './app.menu/display.menu/display.menu.component';
import { MatListModule } from '@angular/material/list';
import { RecetteHelpPreparationsComponent } from './app.preparations/display.preparation/display.preparations/display.preparations.modals/recette.help.preparations/recette.help.preparations.component';
import { RecetteHelpPlatsComponent } from './app.plats/display.plats/display.plats.modals/recette.help.plats/recette.help.plats.component';



@NgModule({
  declarations: [
   AppMenuComponent,
   AppPlatsComponent,
   AppPreparationsComponent,
   AddMenuComponent,
   AddPreparationsComponent,
   DisplayPreparationsComponent,
   AddPlatsComponent,
   DisplayPlatsComponent,
   DisplayMenuComponent,
   RecetteHelpPreparationsComponent,
   RecetteHelpPlatsComponent
  ],
  imports: [
    CommonModule,
    RecettesRoutingModule,
    MatTabsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    MatListModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatPaginatorModule,
    MatTableModule,
    MatOptionModule
  ],
  exports: [
    AppMenuComponent,
    AppPlatsComponent,
    AppPreparationsComponent
  ],
})
export class RecettesModule { }
