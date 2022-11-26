import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthenComponent } from './app.authen/app.authen.component';

@NgModule({
  declarations: [
    AppAuthenComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppAuthenComponent
  ],
  providers: [],
})
export class AppAuthenModule {}
