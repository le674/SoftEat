import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppFacturesComponent } from './app.factures/app.factures.component';
import { AppArchiComponent } from './app.archi/app.archi.component';

@NgModule({
  declarations: [
    AppFacturesComponent,
    AppArchiComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppFacturesComponent,
    AppArchiComponent
  ],
  providers: [],
})
export class AppFacturesModule {}
