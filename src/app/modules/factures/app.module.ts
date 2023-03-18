import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacturesComponent } from './app.factures/app.factures.component';
import { AppArchiComponent } from './app.archi/app.archi.component';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppFacturesComponent,
    AppArchiComponent
  ],
  imports: [
    MatButtonModule,
    MatPaginatorModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    CommonModule 
  ],
  exports: [
    AppFacturesComponent,
    AppArchiComponent
  ],
  providers: [],
})
export class AppFacturesModule {}
