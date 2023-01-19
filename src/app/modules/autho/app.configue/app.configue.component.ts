import { AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { ShortUser, User } from 'src/app/interfaces/user';
import { InteractionRestaurantService } from '../app.autho/interaction-restaurant.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';
import { Restaurant } from 'src/app/interfaces/restaurant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { Visibles } from './app.configue.index';

@Component({
  selector: 'app-app.configue',
  templateUrl: './app.configue.component.html',
  styleUrls: ['./app.configue.component.css']
})
export class AppConfigueComponent implements OnInit{
  private uid: string;
  private proprietaire: string;

  private rest_max_length: number;
  public restau_list: Array<Restaurant>;

  private users: Array<User>;
  private curr_user: {
    user0: Array<User>,
    user1: Array<User>,
    user2: Array<User>,
    user3: Array<User>,
    user4: Array<User>,
    user5: Array<User>,
    user6: Array<User>
  }
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
  private filter_datasource: {
    na: Array<ShortUser>,
    cuisinier: Array<ShortUser>,
    serveur: Array<ShortUser>,
    comptable: Array<ShortUser>,
    rh: Array<ShortUser>,
    gérant: Array<ShortUser>,
    proprietaire: Array<ShortUser>
  }

  public display_columns: string[];

  private page_number: number;
  private curr_categorie: number;

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
  public is_prop:boolean;

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
    this.roles = ["stock", "alertes", "analyse", "budget", "facture", "planning"];
    const first_user = new ShortUser();
    first_user.restaurants = "1,2";
    first_user.roles = "1,2";
    first_user.row_roles = "1,2"
    this.dataSource = {
      "data0": new MatTableDataSource([first_user]),
      "data1": new MatTableDataSource([first_user]),
      "data2": new MatTableDataSource([first_user]),
      "data3": new MatTableDataSource([first_user]),
      "data4": new MatTableDataSource([first_user]),
      "data5": new MatTableDataSource([first_user]),
      "data6": new MatTableDataSource([first_user]),
    }
    this.curr_user = {
      "user0": [new User()],
      "user1": [new User()],
      "user2": [new User()],
      "user3": [new User()],
      "user4": [new User()],
      "user5": [new User()],
      "user6": [new User()]
    };

    this.filter_datasource = {
      na: [],
      comptable: [],
      cuisinier: [],
      gérant: [],
      proprietaire: [],
      rh: [],
      serveur: []
    }

    this.statuts = ["Ajouter des employées au restaurant",
      "Cuisinier", "Serveur", "Économiste Comptable Analyste", "Ressources humaines", "Gérant", "Propriétaire"];
    this.uid = "";
    this.restau_list = [];
    this.proprietaire = "";
    this.page_number = 1;
    this.rest_max_length = 0;
    this.curr_categorie = 0;
    this.is_prop = false;
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
          this.user_services.checkIsProp(user.uid, this.proprietaire).then((is_prop:boolean) => {
            this.is_prop = is_prop;
            console.log(this.is_prop);
            
          })
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
                user.setStatusFromUser(employees[i]) 
                this.users.push(user)
                rest_prom.then((restau_list) => {

                let row_user = new ShortUser()

                row_user.id = employees[i].id;
                row_user.email = employees[i].email;
                row_user.restToString(restau_list);
                row_user.row_roles = this.roles.toString()
                this.rest_max_length = restau_list.length
                this.prop_user.push(row_user)
                if(i === (employees.length - 1)){
                  const first_event = new PageEvent();
                  first_event.length = this.prop_user.length
                  first_event.pageSize = 6
                  first_event.pageIndex = 0
                  this.pageChanged(first_event, 0);
                  this.pageChanged(first_event, 1);
                  this.pageChanged(first_event, 2);
                  this.pageChanged(first_event, 3); 
                  this.pageChanged(first_event, 4);
                  this.pageChanged(first_event, 5);
                  this.pageChanged(first_event, 6);
                }
              }).catch((e) => {
                console.log("erreur pour la fonction getAllRestaurant qui est", e);
                
              })
            }
          }
          else {
            console.log("pas d'utilisateur");
          }
          return this.users
        });
      }
    })
  }

  pageChanged(event: PageEvent, i: number) {
    event.length;
    let users_data = [] as User[];
    this.curr_user["user" + i as keyof typeof this.curr_user] = this.users;
    let role_names = ["","cuisinié", "serveur",
     ["analyste", "economiste", "prévisionniste", "comptable", "comptable +"], "RH", "gérant", "proprietaire"] 
    for(let i = 0; i < this.users.length; i++){
      this.users[i].to_roles();
      if(this.prop_user.at(i) !== undefined){
        this.prop_user[i].roles = this.users[i].roles.toString();
      }
    }
    
    let datasource = [... this.prop_user];

    this.page_number = event.pageIndex;


    if(typeof role_names[i] === "string"){
      datasource = datasource.filter((data) => data.roles === role_names[i])
    }
    else{
      datasource = datasource.filter((data) => {
        let role_check = role_names[i] as string[]
        let is_role = role_check.map((role) => {
          return data.roles.includes(role)
        })
        return(is_role.reduce((previousValue,currentValue) => {
          return(currentValue || previousValue)
        }))
      })
    }

    let datasource_ids = datasource.map((data) => data.id);
    let datas_user = this.curr_user[("user"+ i) as keyof typeof  this.curr_user].filter((user) => datasource_ids.includes(user.id));
    this.curr_user[("user" + i) as keyof typeof  this.curr_user] = datas_user;
    
    
    datasource = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    if (datasource != null) {
      this.dataSource["data" + i  as keyof typeof this.dataSource].data =  datasource;
    }
  }

  get_restaurant(event: boolean, index: number, categorie:number) {
    if (event) {
      let cum_length_pages = 0;
      this.curr_categorie = categorie;
      //modifier si la taille de la pagination change 
      let prev_index = index;
      index = 6 * this.page_number + index;
      let user = this.curr_user["user" + categorie as keyof typeof this.curr_user].at(index);
      for(let i = 0; i < categorie; i++){
        cum_length_pages = cum_length_pages + this.curr_user["user" + i as keyof typeof this.curr_user].length ;
      }
      if (user) {
        if (user.restaurants !== null) {
          let restaurants = user.restaurants.map((restaurant) => restaurant.id)
          let options = this.options.filter((option: MatOption, index_opt: number) => {  
            const min_length = this.rest_max_length * prev_index + cum_length_pages*this.rest_max_length
            const max_length = this.rest_max_length * (prev_index + 1) + cum_length_pages*this.rest_max_length
            return (restaurants.includes(option.value) && (index_opt >= min_length) && (index_opt < max_length))
          })

          options.forEach((option) => {
            option.select()
          })

        }
      }
    }
  }

  get_read_right(event: boolean, index: number,  categorie:number) {
    if (event) {
      let cum_length_pages = 0;
      this.curr_categorie = categorie
      //modifier si la taille de la pagination change 
      let prev_index = index;
      let options_list = [];
      index = 6 * this.page_number + index;
      for(let i = 0; i < categorie; i++){
        cum_length_pages = cum_length_pages + this.curr_user["user" + i as keyof typeof this.curr_user].length ;
      }
      let user = this.curr_user["user" + categorie as keyof typeof this.curr_user].at(index);
      let i = 0;
      if (user) {
        let options = this.options_read.filter((option: MatOption, index_opt: number) => {
          const min_length = 7 * (prev_index + cum_length_pages)
          const max_length = 7 * (prev_index + cum_length_pages + 1)
          return ((index_opt >= min_length) && (index_opt < max_length))
        })
        if(user.is_prop){
          options_list.push(options.at(0))
        }
        for(let key in user.statut){
          const role = user.statut[key as keyof typeof user.statut] as string
          if(typeof role === "string"){
            if(role.includes('r')){
              console.log("options", options_list);
              options_list.push(options.at(i))
            }
          }
          i = i + 1 
        }
        options_list.forEach((option) => {
          option?.select()
        })
      }
    }
  }

  get_write_right(event: boolean, index: number,  categorie:number) {
    if (event) {
      this.curr_categorie = categorie
      let cum_length_pages = 0;
      //modifier si la taille de la pagination change 
      let prev_index = index
      index = 6 * this.page_number + index
      for(let i = 0; i < categorie; i++){
        cum_length_pages = cum_length_pages + this.curr_user["user" + i as keyof typeof this.curr_user].length ;
      }
      let user = this.curr_user["user" + categorie as keyof typeof this.curr_user].at(index);

      let i = 0;
      let options_list = []
      if (user) {
        let options = this.options_write.filter((option: MatOption, index_opt: number) => {
          const min_length = 7 * (prev_index + cum_length_pages) 
          const max_length = 7 * (prev_index + cum_length_pages + 1)
          return ((index_opt >= min_length) && (index_opt < max_length))
        })
        if(user.is_prop){
          options_list.push(options.at(0))
        }
        for(let key in user.statut){
          const role = user.statut[key as keyof typeof user.statut] as string
          if(typeof role === "string"){
            if(role.includes('w')){
              options_list.push(options.at(i))
            }
          }
          i = i + 1 
        }
        options_list.forEach((option) => {
          option?.select()
        })
      }
    }
  }

  set_restaurants(event:MatSelectChange, index:number,  categorie:number){
    index = 6 * this.page_number + index
    const restaurants = event.value
    let user = this.curr_user["user" +  this.curr_categorie as keyof typeof this.curr_user].at(index);
    
    if(user?.restaurants !== undefined){
      user.restaurants.forEach((restaurant:Restaurant, index:number) => {
        restaurants.filter((restaurant: {id: any;}) => (restaurant !== restaurant.id))
      })
      
      user.restaurants = [];

      for(let restaurant of restaurants){
        let restau = new Restaurant()
        restau.id = restaurant 
        user.restaurants.push(restau)
      }
      // on créer une liste de restaurants qui sont unique
      user.restaurants = user.restaurants.filter((restaurant, index, self) => self.map((restau) => restau.id).indexOf(restaurant.id) === index) 
    }
  }

  set_read_right(event:MatSelectChange, index:number,  categorie:number){
    index = 6 * this.page_number + index;
    const new_rights = event.value;
    const user = this.curr_user["user" +  this.curr_categorie as keyof typeof this.curr_user].at(index);
    user?.setStatus(new_rights, "r");  
  }

  set_write_right(event:MatSelectChange, index:number,  categorie:number){
    index = 6 * this.page_number + index;
    const new_rights = event.value;
    const user = this.curr_user["user" +  this.curr_categorie as keyof typeof this.curr_user].at(index);
    user?.setStatus(new_rights, "w"); 
  }

  modif_right(index:number,  categorie:number) {
    index = 6*this.page_number + index
    let user =this.curr_user["user" + categorie as keyof typeof this.curr_user].at(index);
    const restaurant_ids = user?.restaurants.map((restaurant) => restaurant.id)
    const unique_restau = Array.from(new Set(restaurant_ids))
    let filter_user = user?.restaurants.filter((restaurant) => {
      if(unique_restau.includes(restaurant.id)){
        unique_restau.shift();
        return true
      }else{
        return false
      }
    })

    if(user !== undefined){
      if(filter_user != undefined) user.restaurants = filter_user
      this.user_services.setUser(this.proprietaire, user)
    }
    alert("vous avez bien modifier l'ultilisateur")
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


