import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilComponent } from './profil/profil.component';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { RouterModule } from '@angular/router';
import {MatDividerModule} from '@angular/material/divider'; 
import {MatListModule} from '@angular/material/list'; 
import {MatSelectModule} from '@angular/material/select'; 
import {MatDialogModule } from '@angular/material/dialog';
import { ModifMdpComponent } from './modif-mdp/modif-mdp.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ModifMailComponent } from './modif-mail/modif-mail.component';
import { ModifNumberComponent } from './modif-number/modif-number.component'; 


@NgModule({
  declarations: [
    ProfilComponent,
    ModifMdpComponent,
    ModifMailComponent,
    ModifNumberComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatListModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  exports: [
    ProfilComponent
  ]
})
export class ProfilModule { }