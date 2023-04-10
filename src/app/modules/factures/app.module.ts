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

@NgModule({
  declarations: [
    AppFacturesComponent,
    AppArchiComponent,
    FactureLoadComponent
  ],
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    CommonModule 
  ],
  exports: [
    AppFacturesComponent,
    AppArchiComponent
  ],
  providers: [],
})
export class AppFacturesModule {}
