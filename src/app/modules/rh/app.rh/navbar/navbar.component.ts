import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  Categories!: { nom: string; open: boolean; buttonname : String }[];
  Cuisiniers!: String[];
  Serveurs!: String[];
  Barmans!: String[];
  Gerents!: String[];

  select!: String;

  constructor() {}

  ngOnInit(): void {
    this.Categories = [
      { nom: 'Cuisiniers', open: false, buttonname: 'open' },
      { nom: 'Serveurs', open: false, buttonname: 'open' },
      { nom: 'Barmans', open: false, buttonname: 'open' },
      { nom: 'Gérents', open: false, buttonname: 'open' },
    ];
    this.Cuisiniers = ['Cuisto1', 'Cuisto2', 'Cuisto3'];
    this.Serveurs = ['Serveur1', 'Serveur2'];
    this.Barmans = ['Barman1', 'Barman2', 'Barman3'];
    this.Gerents = ['Gerent1'];

    this.select = '';
  }

  openCategories(categories: any) {
    if (categories.buttonname == 'open') {
      categories.buttonname = 'close';
    } else {
      categories.buttonname = 'open';
    }
    categories.open = !categories.open;
  }

  selectEmployee(liste: any){
    this.select=liste;
  }
}
