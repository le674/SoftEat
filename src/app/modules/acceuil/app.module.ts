import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentAcceuil } from './app.component.acceuil/app.component.acceuil';
import { AppModuleRoutingModule } from './app.module-routing';
import { NavbarVitrineComponent } from './app.component.acceuil/navbar-vitrine/navbar-vitrine.component';
import { ConnectionComponent } from './app.component.acceuil/connection/connection.component'

@NgModule({
  declarations: [ComponentAcceuil, NavbarVitrineComponent, ConnectionComponent],
  imports: [CommonModule, AppModuleRoutingModule],
  exports: [],
  providers: [],
})
export class AppAcceuilModule{}
