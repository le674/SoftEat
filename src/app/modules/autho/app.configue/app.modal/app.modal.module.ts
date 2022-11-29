import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModalComponent } from './app.modal.component';


@NgModule({
  declarations: [
    AppModalComponent
  ],
  imports: [ 
    CommonModule
   ],
  exports: [
    AppModalComponent
   ]
})
export class AppModalModule {}