import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from './app.modal.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    AppModalComponent
  ],
  imports: [ 
    CommonModule,
    MatButtonModule
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