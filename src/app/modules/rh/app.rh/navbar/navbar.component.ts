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
  Gerants!: { nom: String; selectionne: boolean }[];

  select!: String[];
  isChecked: any;
  selectAll: boolean = false;

  constructor() {}

  ngOnInit(): void {
    this.Categories = [
      { nom: 'Cuisiniers', open: false, buttonname: '▼' },
      { nom: 'Serveurs', open: false, buttonname: '▼' },
      { nom: 'Barmans', open: false, buttonname: '▼' },
      { nom: 'Gérants', open: false, buttonname: '▼' },
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
    this.Gerants = [{ nom: 'Gerant1', selectionne: false }];

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

  /*
  selectEmployee(liste: any) {
    if (liste.selectionne) {
      this.select.splice(this.select.indexOf(liste.nom), 1);
    } else {
      this.select.push(liste.nom);
    }

    liste.selectionne = !liste.selectionne;
  }
  */

  selectEmployee(liste: any) {  
    if (liste.selectionne) {
      const index = this.select.indexOf(liste.nom);
      if (index !== -1) {
        this.select.splice(index, 1);
      }
    } else {
      this.select.push(liste.nom);
    }
  
    liste.selectionne = !liste.selectionne;
  }
  

  addAllEmployees() {
    if (this.selectAll) {
      this.Cuisiniers.forEach((cuisto) => {
        const index = this.select.indexOf(cuisto.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          cuisto.selectionne = !cuisto.selectionne;
        }
      });
  
      this.Serveurs.forEach((serveur) => {
        const index = this.select.indexOf(serveur.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          serveur.selectionne = !serveur.selectionne;
        }
      });
  
      this.Barmans.forEach((barman) => {
        const index = this.select.indexOf(barman.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          barman.selectionne = !barman.selectionne;
        }
      });
  
      this.Gerants.forEach((gerant) => {
        const index = this.select.indexOf(gerant.nom);
        if (index !== -1) {
          this.select.splice(index, 1);
          gerant.selectionne = !gerant.selectionne;
        }
      });
    } else {
      this.Cuisiniers.forEach((cuisto) => {
        if (!this.select.includes(cuisto.nom)) {
          this.select.push(cuisto.nom);
          cuisto.selectionne = !cuisto.selectionne;
        }
      });
  
      this.Serveurs.forEach((serveur) => {
        if (!this.select.includes(serveur.nom)) {
          this.select.push(serveur.nom);
          serveur.selectionne = !serveur.selectionne;
        }
      });
  
      this.Barmans.forEach((barman) => {
        if (!this.select.includes(barman.nom)) {
          this.select.push(barman.nom);
          barman.selectionne = !barman.selectionne;
        }
      });
  
      this.Gerants.forEach((gerant) => {
        if (!this.select.includes(gerant.nom)) {
          this.select.push(gerant.nom);
          gerant.selectionne = !gerant.selectionne;
        }
      });
    }
  
    this.selectAll = !this.selectAll;
  }  
}
