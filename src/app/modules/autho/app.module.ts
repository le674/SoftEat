import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppAuthoComponent } from './app.autho/app.autho.component';
import { AppRoutingModule } from './app-routing.module';
import { InteractionRestaurantService } from './app.autho/interaction-restaurant.service';
import { AppConfigueComponent } from './app.configue/app.configue.component';
import { AppModalModule } from './app.configue/app.modal/app.modal.module'
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [
    AppAuthoComponent,
    AppConfigueComponent
  ],
  imports: [ 
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    AppModalModule
   ],
  exports: [
    AppAuthoComponent
  ],
  providers: [
    InteractionRestaurantService
  ]
})
export class AppAuthoModule {}
