import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentAcceuil } from './app.component.acceuil/app.component.acceuil';
import { AppModuleRoutingModule } from './app.module-routing';
import { NavbarVitrineComponent } from './app.component.acceuil/navbar-vitrine/navbar-vitrine.component';
import { ConnectionComponent } from './app.component.acceuil/connection/connection.component';
import { HomeComponent } from './app.component.acceuil/home/home.component';
import { FonctionnaliteComponent } from './app.component.acceuil/fonctionnalite/fonctionnalite.component'
@NgModule({
  declarations: [ComponentAcceuil, NavbarVitrineComponent, ConnectionComponent, HomeComponent, FonctionnaliteComponent],
  imports: [CommonModule, AppModuleRoutingModule],
  exports: [],
  providers: [],
})
export class AppAcceuilModule{}
