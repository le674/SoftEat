import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from './app.modal/app.modal/app.modal.component';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AppFormComponent } from './app.form/app.form/app.form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'


@NgModule({
  declarations: [
    AppModalComponent,
    AppFormComponent
  ],
  imports: [ 
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCommonModule
   ],
  exports: [
    AppModalComponent,
    AppFormComponent
   ],
   providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
       useValue: {hasBackdrop: true}
     }
   ]
})
export class AppModalModule {}