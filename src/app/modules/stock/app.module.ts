import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStockComponent } from './app.stock/app.stock.component';
import { AppConsoComponent } from './app.conso/app.conso.component';
import {MatTableModule} from '@angular/material/table'; 
import { CIngredient } from 'src/app/interfaces/ingredient';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddIngComponent } from './app.stock/app.stock.modals/add-ing/add.ing/add.ing.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';  
import {MatTooltipModule} from '@angular/material/tooltip'; 
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar'; 
import { AddConsoComponent } from './app.conso/app.conso.modals/add-ing/add.ing/add.conso.component';
import { AppPreparationComponent } from './app.preparation/app.preparation.component';
import { AppAddPreparationComponent } from './app.preparation/app.preparation.modals/app.add.preparation/app.add.preparation.component';
import { AppHelpPreparationComponent } from './app.preparation/app.preparation.modals/app.help.preparation/app.help.preparation/app.help.preparation.component';

@NgModule({
  declarations: [
    AppStockComponent,
    AppConsoComponent,
    AddIngComponent,
    AddConsoComponent,
    AppPreparationComponent,
    AppAddPreparationComponent,
    AppHelpPreparationComponent
  ],
  imports: [ 
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatTableModule,
    MatSnackBarModule
   ],
  exports: [
    AppStockComponent,
    AppPreparationComponent,
    AppConsoComponent
  ],
  providers: [
    CIngredient
  ],
})
export class AppStockModule {}
