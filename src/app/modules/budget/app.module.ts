import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBudgetComponent } from './app.budget/app.budget.component';

@NgModule({
  declarations: [
    AppBudgetComponent
  ],
  imports: [ CommonModule ],
  exports: [
    AppBudgetComponent
  ],
  providers: [],
})
export class AppBudgetModule {}
