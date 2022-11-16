import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacturesComponent } from './app.factures/app.factures.component';

@NgModule({
  declarations: [
    AppFacturesComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppFacturesComponent
  ],
  providers: [],
})
export class AppFacturesModule {}
