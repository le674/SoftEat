import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { User } from 'src/app/interfaces/user';
import { InteractionRestaurantService } from '../app.autho/interaction-restaurant.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';
import { Proprietaire } from 'src/app/interfaces/proprietaire';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { FormControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-app.configue',
  templateUrl: './app.configue.component.html',
  styleUrls: ['./app.configue.component.css']
})
export class AppConfigueComponent implements OnInit {
  public restauts = new FormControl('');
  public restau_list: Array<Restaurant>;
  private users: Array<Proprietaire>;
  private proprietaire: string;
  public dataSource: [{
    id: string;
    email: string;
    restaurants: Array<string>;
  }];
  public prop_user: [{
    id:string,
    email:string,
    restaurants: Array<string>
  }];
  private uid: string;
  public display_columns: string[] = ["id", "email", "restaurants"];
  @ViewChild(MatTable)
  table!: MatTable<[{
    id: string;
    email: string;
    restaurants: Array<string>;
  }]>;

  public visibles: {
    index_1: boolean,
    index_2: boolean,
    index_3: boolean,
    index_4: boolean,
    index_5: boolean,
    index_6: boolean,
    index_7: boolean
  };
  constructor(private service: InteractionRestaurantService, private user_services: UserInteractionService,
    private ofApp: FirebaseApp, private router: Router) {
    this.visibles = { index_1: true, index_2: true, index_3: true, index_4: true, index_5: true, index_6: true, index_7: true };
    this.prop_user = [{
      id: "test",
      email:  "",
      restaurants:  [""]
    }];
    this.dataSource = this.prop_user
    this.users = [];
    this.uid = "";
    this.restau_list = [];
    this.proprietaire = "";
  }
  ngOnInit(): void {
    const auth = getAuth(this.ofApp);
    this.prop_user = [{
      id: "",
      email:  "",
      restaurants:  [""]
    }]
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const prop_user = this.user_services.getProprietaireFromUsers(user.uid).then((name: string) => {
          this.proprietaire = name;
          return (name);
        })

        const all_id = prop_user.then((name) => {
          const all_id = this.user_services.getAllIdFromProp(name).then((props) => {
            return(props) 
          })
          return(all_id)
        })

        all_id.then((users) => {
          if (users !== null) {
            for(let employee of users.employee){
              const Urestaurant = this.service.getRestaurantFromUser(employee.id, this.proprietaire)
              Urestaurant.then((restaurants) => {
                if (restaurants.length !== 0) {
                  employee.restaurants = restaurants
                  let new_user = new User();
                  new_user.id = employee.id;
                  new_user.restaurants = employee.restaurants;
                  new_user.email = employee.email;
                  let restaurants_ids = new_user.restaurants.map((restaurant) => restaurant.id)
                  this.prop_user.push({
                    id: new_user.id,
                    email: new_user.email,
                    restaurants: restaurants_ids
                  })
                  this.table.renderRows()
                }
                else {
                  this.service.getAllRestaurants(this.proprietaire).then((restau_list) => {
                    employee.restaurants = restau_list
                    let new_user = new User();
                    new_user.id = employee.id;
                    new_user.restaurants = employee.restaurants;
                    new_user.email = employee.email;
                    let restaurants_ids = new_user.restaurants.map((restaurant) => restaurant.id)
                    console.log(restaurants_ids);
                    this.prop_user.push({
                      id: new_user.id,
                      email: new_user.email,
                      restaurants: restaurants_ids
                    })
                    this.table.renderRows()
                  })
                }
              })
            }
          }
          else {
            console.log("pas d'utilisateur");
          }
        });
      }
    })
    this.dataSource = this.prop_user
  }

  ngAfterViewInit(): void {
    this.table.renderRows()
  }


  clicdeConnexion() {
    const auth = getAuth(this.ofApp);
    auth.signOut();
    window.location.reload();
  }

  clicAcceuil() {
    this.router.navigate(['']);
  }

  changeArrow(arrow_index: number) {
    if ((this.visibles.index_1 === true) && (arrow_index === 1)) {
      this.visibles.index_1 = false;
    }
    else {
      this.visibles.index_1 = true;
    }

    if (this.visibles.index_2 === true && (arrow_index === 2)) {
      this.visibles.index_2 = false;
    }
    else {
      this.visibles.index_2 = true;
    }

    if (this.visibles.index_3 === true && (arrow_index === 3)) {
      this.visibles.index_3 = false;
    }
    else {
      this.visibles.index_3 = true;
    }

    if (this.visibles.index_4 === true && (arrow_index === 4)) {
      this.visibles.index_4 = false;
    }
    else {
      this.visibles.index_4 = true;
    }

    if (this.visibles.index_5 === true && (arrow_index === 5)) {
      this.visibles.index_5 = false;
    }
    else {
      this.visibles.index_5 = true;
    }

    if (this.visibles.index_6 === true && (arrow_index === 6)) {
      this.visibles.index_6 = false;
    }
    else {
      this.visibles.index_6 = true;
    }

    if (this.visibles.index_7 === true && (arrow_index === 7)) {
      this.visibles.index_7 = false;
    }
    else {
      this.visibles.index_7 = true;
    }
    console.log("test");
  }
}
function getProprietaireFromUsers(uid: string) {
  throw new Error('Function not implemented.');
}

