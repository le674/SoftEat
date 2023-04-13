import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacturesComponent } from './app.factures/app.factures.component';
import { AppArchiComponent } from './app.archi/app.archi.component';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule} from '@angular/material/radio';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FactureLoadComponent } from './app.factures/app.factures.load/facture-load/facture-load.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModifIngComponent } from './app.factures/app.factures.modif/modif.ing/modif.ing.component';
import { CIngredient } from 'src/app/interfaces/ingredient';

@NgModule({
  declarations: [
    ModifIngComponent,
    AppFacturesComponent,
    AppArchiComponent,
    FactureLoadComponent
  ],
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    MatPaginatorModule,
    MatRadioModule,
    MatOptionModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    CommonModule 
  ],
  exports: [
    AppFacturesComponent,
    AppArchiComponent
  ],
  providers: [
    CIngredient
  ],
})
export class AppFacturesModule {}
