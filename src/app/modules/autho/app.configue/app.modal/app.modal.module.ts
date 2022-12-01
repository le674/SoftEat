import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from './app.modal.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppModalComponent
  ],
  imports: [ 
    CommonModule
   ],
  exports: [
    AppModalComponent
   ],
   providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
       useValue: {hasBackdrop: true}
     }
   ]
})
export class AppModalModule {}