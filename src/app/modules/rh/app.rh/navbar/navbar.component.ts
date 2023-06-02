import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  Categories!: { nom: string; open: boolean; buttonname: String }[];
  Cuisiniers!: { nom: String; selectionne: boolean }[];
  Serveurs!: { nom: String; selectionne: boolean }[];
  Barmans!: { nom: String; selectionne: boolean }[];
  Gerents!: { nom: String; selectionne: boolean }[];

  select!: String[];
isChecked: any;

  constructor() {}

  ngOnInit(): void {
    this.Categories = [
      { nom: 'Cuisiniers', open: false, buttonname: '▼' },
      { nom: 'Serveurs', open: false, buttonname: '▼' },
      { nom: 'Barmans', open: false, buttonname: '▼' },
      { nom: 'Gérents', open: false, buttonname: '▼' },
    ];
    this.Cuisiniers = [
      { nom: 'Cuisto1', selectionne: false },
      { nom: 'Cuisto2', selectionne: false },
      { nom: 'Cuisto3', selectionne: false },
    ];
    this.Serveurs = [
      { nom: 'Serveur1', selectionne: false },
      { nom: 'Serveur2', selectionne: false },
    ];
    this.Barmans = [
      { nom: 'Barman1', selectionne: false },
      { nom: 'Barman2', selectionne: false },
      { nom: 'Barman3', selectionne: false },
    ];
    this.Gerents = [{ nom: 'Gerent1', selectionne: false }];

    this.select = [];
  }

  openCategories(categories: any) {
    if (categories.buttonname == '▼') {
      categories.buttonname = '▲';
    } else {
      categories.buttonname = '▼';
    }
    categories.open = !categories.open;
  }

  /*selectEmployee(liste: any) {
    if (!liste.selectionne) {
      this.select.push(liste.nom);
      liste.selectionne = !liste.selectionne;
    } else {
      this.select.splice(this.select.indexOf(liste.nom), 1);
      liste.selectionne = !liste.selectionne;
    }
  }*/
  selectEmployee(liste: any) {
    if (liste.selectionne) {
      this.select.splice(this.select.indexOf(liste.nom), 1);
    } else {
      this.select.push(liste.nom);
    }
    
    liste.selectionne = !liste.selectionne;
  }
  
}
