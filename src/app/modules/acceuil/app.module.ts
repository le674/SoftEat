import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentAcceuil } from './app.component.acceuil/app.component.acceuil';
import { AppModuleRoutingModule } from './app.module-routing';
import { NavbarVitrineComponent } from './app.component.acceuil/navbar-vitrine/navbar-vitrine.component';
import { ConnectionComponent } from './app.component.acceuil/connection/connection.component';
import { HomeComponent } from './app.component.acceuil/home/home.component';
import { FonctionnaliteComponent } from './app.component.acceuil/fonctionnalite/fonctionnalite.component';
import { PrixComponent } from './app.component.acceuil/prix/prix.component';
import { ProposComponent } from './app.component.acceuil/propos/propos.component';
import { ContactComponent } from './app.component.acceuil/contact/contact.component'
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './app.component.acceuil/footer/footer.component';
@NgModule({
  declarations: [
    ComponentAcceuil,
    NavbarVitrineComponent,
    ConnectionComponent,
    HomeComponent,
    FonctionnaliteComponent,
    PrixComponent,
    ProposComponent,
    ContactComponent,
    FooterComponent
  ],
  imports: [
     CommonModule,
     MatDividerModule,
     ReactiveFormsModule,
     AppModuleRoutingModule,
     MatDialogModule
    ],
  exports: [],
  providers: [],
})
export class AppAcceuilModule{}
