import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAnalyseComponent } from './app.analyse/app.analyse.component';

@NgModule({
  declarations: [
    AppAnalyseComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppAnalyseComponent
  ],
  providers: [],
})
export class AppAnalyseModule {}
