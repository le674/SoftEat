import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { ShortUser, User } from 'src/app/interfaces/user';
import { InteractionRestaurantService } from '../app.autho/interaction-restaurant.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';
import { Proprietaire } from 'src/app/interfaces/proprietaire';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { FormControl } from '@angular/forms';
import {MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { map } from '@firebase/util';

@Component({
  selector: 'app-app.configue',
  templateUrl: './app.configue.component.html',
  styleUrls: ['./app.configue.component.css']
})
export class AppConfigueComponent implements OnInit {
  private uid: string;
  private proprietaire: string;

  private rest_max_length: number;
  public restau_list: Array<Restaurant>;
 
  private users: Array<User>;
  public prop_user: Array<ShortUser>;
  public dataSource : MatTableDataSource<ShortUser>;
  public display_columns: string[] = ["id", "email", "restaurants"];

  private page_number:number;

  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChildren(MatOption)
  options!: QueryList<MatOption>

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
    this.prop_user = [];
    this.users = []
    const first_user = new ShortUser()
    first_user.restaurants = "1,2"
    this.dataSource = new MatTableDataSource([first_user]);

    this.uid = "";
    this.restau_list = [];
    this.proprietaire = "";
    this.page_number = 1;
    this.rest_max_length = 0;
  }
  ngOnInit(): void {
    const auth = getAuth(this.ofApp);
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
          if (users.employee !== null) {
            const rest_prom = this.service.getAllRestaurants(this.proprietaire).then((restau_list) => {
              return(restau_list)
            })
            const employees = users.employee
            for(let i = 0; i < employees.length; i++){
        
              let user = new User()
              user.id = employees[i].id;
              user.email = employees[i].email;
              user.restaurants = (employees[i].restaurants === null) ? [] : employees[i].restaurants
              this.users.push(user)

              rest_prom.then((restau_list) => {
                
                let row_user = new ShortUser()
                
                row_user.id = employees[i].id;
                row_user.email = employees[i].email;
                row_user.restToString(restau_list);
                this.rest_max_length = restau_list.length
                this.prop_user.push(row_user)

                const first_event = new PageEvent();
                first_event.length = this.prop_user.length
                first_event.pageSize = 6
                first_event.pageIndex = 0
                this.pageChanged(first_event);
              })
            }
          }
          else {
            console.log("pas d'utilisateur");
          }
        });
      }
    })
  }

  ngAfterViewInit(): void {
  }

  pageChanged(event: PageEvent) {
    event.length;
    let datasource = [... this.prop_user];
    let restaurants_ids:string[] = []
    this.page_number = event.pageIndex
    datasource =  datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    if(datasource != null){
      this.dataSource.data = datasource
    }
  }

  set_restaurant(event:boolean, index:number){
    if(event){
      //modifier si la taille de la pagination change 
      let prev_index = index
      index = 6*this.page_number + index
      let user = this.users.at(index)
      if(user){
        console.log(user);
        if(user.restaurants !== null) {
          console.log(user.restaurants);
          let restaurants = user.restaurants.map((restaurant) => restaurant.id)
         
          console.log(this.options);
          let options = this.options.filter((option: MatOption, index_opt:number) => {
            const min_length = this.rest_max_length*prev_index
            const max_length = this.rest_max_length*(prev_index + 1)
            return(restaurants.includes(option.value) && (index_opt >= min_length) && (index_opt < max_length))
          })
          console.log(options);
          
          options.forEach((option) => {
            option.select()
          })

        }
      }
    }
    console.log(event);
  }

  modif_restau(event: MatSelectChange, index:number){
    console.log(event.value);
    
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
  }
}
function getProprietaireFromUsers(uid: string) {
  throw new Error('Function not implemented.');
}

