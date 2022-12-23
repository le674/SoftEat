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


@NgModule({
  declarations: [
    ProfilComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule
  ],
  exports: [
    ProfilComponent
  ]
})
export class ProfilModule { }
