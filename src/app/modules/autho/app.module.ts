import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppAuthoComponent
  ],
  imports: [ 
    CommonModule,
    AppRoutingModule
   ],
  exports: [AppAuthoComponent],
  providers: [],
})
export class AppAuthoModule {}
