import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { ShortUser, User } from 'src/app/interfaces/user';
import { InteractionRestaurantService } from '../app.autho/interaction-restaurant.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Visibles } from './app.configue.index';

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
  public dataSource: {
    data0:  MatTableDataSource<ShortUser>;
    data1:  MatTableDataSource<ShortUser>;
    data2:  MatTableDataSource<ShortUser>;
    data3:  MatTableDataSource<ShortUser>;
    data4:  MatTableDataSource<ShortUser>;
    data5:  MatTableDataSource<ShortUser>;
    data6:  MatTableDataSource<ShortUser>;
  }
  public display_columns: string[];

  private page_number: number;

  private roles: string[];
  public statuts: string[];

  public visibles: Visibles = {
    index_1: true,
    index_2: true,
    index_3: true,
    index_4: true,
    index_5: true,
    index_6: true,
    index_7: true
  };

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChildren("options")
  options!: QueryList<MatOption>

  @ViewChildren("options_read")
  options_read!: QueryList<MatOption>

  @ViewChildren("options_write")
  options_write!: QueryList<MatOption>

  constructor(private service: InteractionRestaurantService, private user_services: UserInteractionService,
    private ofApp: FirebaseApp, private router: Router) {
    this.prop_user = [];
    this.users = [];
    this.display_columns = ["id", "email", "restaurants", "read_right", "write_right", "validation"];
    this.roles = ["proprietaire", "stock", "alertes", "analyse ", "budget ", "facture ", "planning"];
    const first_user = new ShortUser();
    first_user.restaurants = "1,2";
    first_user.roles = "1,2";
    this.dataSource = {
      "data0": new MatTableDataSource([first_user]),
      "data1": new MatTableDataSource([first_user]),
      "data2": new MatTableDataSource([first_user]),
      "data3": new MatTableDataSource([first_user]),
      "data4": new MatTableDataSource([first_user]),
      "data5": new MatTableDataSource([first_user]),
      "data6": new MatTableDataSource([first_user]),
    }
    this.statuts = ["Ajouter des employées au restaurant",
      "Cuisinier", "Serveur", "Économiste Comptable Analyste", "Ressources humaines", "Gérant", "Propriétaire"];
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
            return (props)
          })
          return (all_id)
        })

        all_id.then((users) => {
          if (users.employee !== null) {
            const rest_prom = this.service.getAllRestaurants(this.proprietaire).then((restau_list) => {
              return (restau_list)
            })
            const employees = users.employee
            for (let i = 0; i < employees.length; i++) {

              let user = new User()
              user.id = employees[i].id;
              user.email = employees[i].email;
              user.restaurants = (employees[i].restaurants === null) ? [] : employees[i].restaurants
              user.setStatus(employees[i])
              this.users.push(user)

              rest_prom.then((restau_list) => {

                let row_user = new ShortUser()

                row_user.id = employees[i].id;
                row_user.email = employees[i].email;
                row_user.restToString(restau_list);
                row_user.roles = this.roles.toString()
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
    this.page_number = event.pageIndex
    datasource = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    if (datasource != null) {
      this.dataSource.data0.data = datasource
    }
  }

  get_restaurant(event: boolean, index: number) {
    if (event) {
      console.log("set_restaurant");

      //modifier si la taille de la pagination change 
      let prev_index = index
      index = 6 * this.page_number + index
      let user = this.users.at(index)
      if (user) {
        if (user.restaurants !== null) {
          let restaurants = user.restaurants.map((restaurant) => restaurant.id)

          console.log(this.options);
          let options = this.options.filter((option: MatOption, index_opt: number) => {
            const min_length = this.rest_max_length * prev_index
            const max_length = this.rest_max_length * (prev_index + 1)
            return (restaurants.includes(option.value) && (index_opt >= min_length) && (index_opt < max_length))
          })

          options.forEach((option) => {
            option.select()
          })

        }
      }
    }
  }

  get_read_right(event: boolean, index: number) {
    if (event) {
      //modifier si la taille de la pagination change 

      let prev_index = index
      index = 6 * this.page_number + index
      let user = this.users.at(index)
      if (user) {
        console.log(this.options_read);
        console.log(index);

        let options = this.options_read.filter((option: MatOption, index_opt: number) => {
          const min_length = 7 * prev_index
          const max_length = 7 * (prev_index + 1)
          return ((index_opt >= min_length) && (index_opt < max_length))
        })
        console.log(options);

        if (user.is_prop) {
          options.at(0)?.select()
        }

        if (user.stock.includes("r")) {
          options.at(1)?.select()
        }

        if (user.alertes.includes("r")) {
          options.at(2)?.select()
        }
        if (user.analyse.includes("r")) {
          options.at(3)?.select()
        }

        if (user.budget.includes("r")) {
          options.at(4)?.select()
        }

        if (user.facture.includes("r")) {
          options.at(5)?.select()
        }

        if (user.planning.includes("r")) {
          options.at(6)?.select()
        }
      }
    }
  }

  get_write_right(event: boolean, index: number) {
    if (event) {
      //modifier si la taille de la pagination change 
      let prev_index = index
      index = 6 * this.page_number + index
      let user = this.users.at(index)
      if (user) {
        let options = this.options_write.filter((option: MatOption, index_opt: number) => {
          const min_length = 7 * prev_index
          const max_length = 7 * (prev_index + 1)
          return ((index_opt >= min_length) && (index_opt < max_length))
        })

        if (user.is_prop) {
          options.at(0)?.select()
        }

        if (user.stock.includes("w")) {
          options.at(1)?.select()
        }

        if (user.alertes.includes("w")) {
          options.at(2)?.select()
        }
        if (user.analyse.includes("w")) {
          options.at(3)?.select()
        }

        if (user.budget.includes("w")) {
          options.at(4)?.select()
        }

        if (user.facture.includes("w")) {
          options.at(5)?.select()
        }

        if (user.planning.includes("w")) {
          options.at(6)?.select()
        }
      }
    }
  }

  set_restaurants(event:MatSelectChange, index:number){
    index = 6 * this.page_number + index
    console.log(index);
    const restaurants = event.value
    console.log(restaurants);
    const user = this.users.at(index)
    console.log(user?.id);
    if(user?.restaurants !== undefined){
      user.restaurants.forEach((restaurant:Restaurant, index:number) => {
        if(restaurants.includes(restaurant.id)){
          restaurants.filter((restaurant: { id: any; }) => (restaurant !== restaurant.id))
        }
        user.restaurants.shift()
      })
      restaurants.forEach((restaurant_id: any) => {
        const restaurant = new Restaurant();
        restaurant.setId(restaurant_id)
        user.restaurants.push(restaurants)
      })
      if(user.restaurants.length === 2) user.restaurants.shift()
      console.log(user);
      
    } 
    
  }

  set_read_right(event:MatSelectChange, index:number){
    console.log(event);
  }

  set_write_right(event:MatSelectChange, index:number){
    console.log(event);
  }

  modif_right(index:number) {

  }


  clicdeConnexion() {
    const auth = getAuth(this.ofApp);
    auth.signOut();
    window.location.reload();
  }

  clicAcceuil() {
    this.router.navigate(['']);
  }

  getDataSource(index:number){
    return this.dataSource[('data' + index) as keyof typeof this.dataSource]
  }

  getVisible(visibles: Visibles, i: number):boolean{
    return this.visibles[('index_' + (i + 1)) as keyof typeof this.visibles]
  }

  changeArrow(arrow_index: number) {

    if ((this.visibles.index_1 === true) && (arrow_index === 0)) {
      this.visibles.index_1 = false;
    }
    else {
      this.visibles.index_1 = true;
    }

    if (this.visibles.index_2 === true && (arrow_index === 1)) {
      this.visibles.index_2 = false;
    }
    else {
      this.visibles.index_2 = true;
    }

    if (this.visibles.index_3 === true && (arrow_index === 2)) {
      this.visibles.index_3 = false;
    }
    else {
      this.visibles.index_3 = true;
    }

    if (this.visibles.index_4 === true && (arrow_index === 3)) {
      this.visibles.index_4 = false;
    }
    else {
      this.visibles.index_4 = true;
    }

    if (this.visibles.index_5 === true && (arrow_index === 4)) {
      this.visibles.index_5 = false;
    }
    else {
      this.visibles.index_5 = true;
    }

    if (this.visibles.index_6 === true && (arrow_index === 5)) {
      this.visibles.index_6 = false;
    }
  }
}


