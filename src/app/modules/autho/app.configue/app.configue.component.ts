import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { FirebaseApp } from '@angular/fire/app';
import { Router } from '@angular/router';
import { ShortUser, User } from '../../../../app/interfaces/user';
import { UserInteractionService } from '../../../../app/services/user-interaction.service';
import { Restaurant } from '../../../../app/interfaces/restaurant';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatOption } from '@angular/material/core';
import { Visibles } from './app.configue.index';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonService } from '../../../../app/services/common/common.service';
import { CommonCacheServices } from 'src/app/services/common/common.cache.services.service';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription, throwError } from 'rxjs';
import { Employee, EmployeeFull } from 'src/app/interfaces/employee';
import { MatSelectChange } from '@angular/material/select';
import { AddConfigueEmployeeComponent } from './add.configue.employee/add.configue.employee/add.configue.employee.component';
import { AddConfigueSalaryComponent } from './add.configue.salary/add.configue.salary.component';
import { MobileUserDataComponent } from './mobile.user.data/mobile.user.data/mobile.user.data.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Condition, InteractionBddFirestore } from 'src/app/interfaces/interaction_bdd';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-app.configue',
  templateUrl: './app.configue.component.html',
  styleUrls: ['./app.configue.component.css']
})
export class AppConfigueComponent implements OnInit, OnDestroy {
  private uid: string;
  private proprietaire: string;
  private user: User;
  private users: Array<EmployeeFull>;
  private path_to_restaurant:Array<string>;
  private path_to_employees:Array<string>;
  private path_to_users:Array<string> = User.getPathsToFirestore();
  private rest_max_length: number;
  public restau_list: Array<Restaurant>;

  private user_unsubscribe!: Unsubscribe;
  private all_user_unsubscribe!:Unsubscribe;
  private all_employee_unsubscribe!:Unsubscribe;
  private all_restaurants_unsubscribe!:Unsubscribe;
  private user_subscription!:Subscription;
  private all_user_subscription!:Subscription;
  private all_employee_subscription!:Subscription;
  private all_restaurants_subscription!:Subscription;

  // prop_user est semblable à curr_user cependant prop_user contient 
  //pas uniquement les restaurants (prop_user.restaurants) et roles(prop_user.roles) assigné à 
  //l'utilisateur x mais tout les restaurant et tout les roles

  private curr_user: {
    user0: Array<EmployeeFull>,
    user1: Array<EmployeeFull>,
    user2: Array<EmployeeFull>,
    user3: Array<EmployeeFull>,
    user4: Array<EmployeeFull>,
    user5: Array<EmployeeFull>,
    user6: Array<EmployeeFull>
  }
  public prop_user: Array<ShortUser>;

  public dataSource: {
    data0: MatTableDataSource<ShortUser>;
    data1: MatTableDataSource<ShortUser>;
    data2: MatTableDataSource<ShortUser>;
    data3: MatTableDataSource<ShortUser>;
    data4: MatTableDataSource<ShortUser>;
    data5: MatTableDataSource<ShortUser>;
    data6: MatTableDataSource<ShortUser>;
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
  private length_statut:number;
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
  public is_prop: boolean;
  public windows_screen_mobile: boolean;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChildren("options")
  options!: QueryList<MatOption>

  @ViewChildren("options_read")
  options_read!: QueryList<MatOption>

  @ViewChildren("options_write")
  options_write!: QueryList<MatOption>



  constructor(public dialog: MatDialog, private user_services: UserInteractionService,
    private ofApp: FirebaseApp, private router: Router, private _snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet, private common_service: CommonService,
    private cache_service: CommonCacheServices, private firestore:FirebaseService,
    private auth:Auth) {
    this.prop_user = [];
    this.users = [];
    this.path_to_restaurant = [];
    this.path_to_employees = [];
    this.display_columns = this.common_service.getColumnAdminTab();
    this.roles = this.common_service.getStatut();
    this.length_statut = this.common_service.getStatut().length;
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
      "user0": [],
      "user1": [],
      "user2": [],
      "user3": [],
      "user4": [],
      "user5": [],
      "user6": []
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
    this.windows_screen_mobile = this.common_service.getMobileBreakpoint("user");
    this.user = new User();
  }
  ngOnDestroy(): void {
    this.user_unsubscribe();
    this.user_subscription.unsubscribe();
    this.all_user_unsubscribe();
    this.all_user_subscription.unsubscribe();
    if(this.all_restaurants_unsubscribe !== undefined){
      this.all_restaurants_unsubscribe();
    }
    if(this.all_restaurants_subscription !== undefined){
      this.all_restaurants_subscription.unsubscribe();
    }
  }
  ngOnInit(): void {
    const auth = this.auth;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.uid = user.uid;
        const condition:Condition = {
          attribut:"uid",
          condition:"==",
          value:this.uid
        }
        this.user_unsubscribe = this.firestore.getFromFirestoreBDD(this.path_to_users, User, [condition]); 
        this.user_subscription = this.firestore.getFromFirestore().subscribe((_user: Array<InteractionBddFirestore>) => {
        const _users = _user as Array<User>;
        if(_users.length > 1){
          throw new Error("Plusieurs utilisateurs avec le même uid");
        }
        this.user = _users[0];
        if(this.user.proprietary_id !== null){
          this.proprietaire = this.user.proprietary_id;
          this.path_to_employees = Employee.getPathsToFirestore(this.user.proprietary_id);
        }
        this.path_to_restaurant = Restaurant.getPathsToFirestore(this.proprietaire);
        if (this.user.related_restaurants !== null) {
            this.all_employee_unsubscribe = this.firestore.getFromFirestoreBDD(this.path_to_employees , Employee, null); 
            this.firestore.getFromFirestore().subscribe((employees) => {
              let _employees = employees as Array<Employee>;
              const _employee = _employees.find((employee) => employee.uid === user.uid);
              if(_employee !== undefined){
                if(_employee.roles?.includes("propriétaire")){
                  this.is_prop = true;
                }
              }
              this.firestore.getFromFirestoreBDD(this.path_to_restaurant, Restaurant, null);
              this.firestore.getFromFirestore().subscribe((restaurants:Array<InteractionBddFirestore>)  => {
                this.users = [];
                this.prop_user = [];
                for(let employee of _employees){
                  let row_user = new ShortUser();
                  let _employee = new EmployeeFull(employee.email, employee.statut, employee.uid, this.common_service);
                  _employee.setEmployee(employee);
                  _employee.proprietaire = this.proprietaire;
                  _employee.getAllRestaurant(this.user, restaurants as Array<Restaurant>);
                  row_user.setRowUser(employee, this.common_service.getStatut(), restaurants as Array<Restaurant>);
                  this.users.push(_employee);
                  this.rest_max_length = restaurants.length;
                  this.prop_user.push(row_user);
                  const first_event = new PageEvent();
                  first_event.length = this.prop_user.length
                  first_event.pageSize = 6
                  first_event.pageIndex = 0
                  this.clearDataSource();
                  this.pageChanged(first_event, 0);
                  this.pageChanged(first_event, 1);
                  this.pageChanged(first_event, 2);
                  this.pageChanged(first_event, 3); 
                  this.pageChanged(first_event, 4);
                  this.pageChanged(first_event, 5);
                  this.pageChanged(first_event, 6);
                }
              })
            })  
          } 
        })
      }
    })
  }
   clearDataSource() {
      this.dataSource.data0 = new MatTableDataSource([new ShortUser()]);
      this.dataSource.data1 = new MatTableDataSource([new ShortUser()]);
      this.dataSource.data2 = new MatTableDataSource([new ShortUser()]);
      this.dataSource.data3 = new MatTableDataSource([new ShortUser()]);
      this.dataSource.data4 = new MatTableDataSource([new ShortUser()]);
      this.dataSource.data5 = new MatTableDataSource([new ShortUser()]);
      this.dataSource.data6 = new MatTableDataSource([new ShortUser()]);
   }
   pageChanged(event: PageEvent, i: number) {
    let role_names = this.common_service.getRoles();
    for(let i = 0; i < this.users.length; i++){
      if(this.prop_user.at(i) !== undefined){
        const roles = this.users[i].roles;
        if(roles !== null){
          this.prop_user[i].roles = roles.toString();
        }
      }
    }
    let datasource = [...this.prop_user];
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
    this.curr_user["user" + i as keyof typeof this.curr_user] = this.users;
    let datas_user = this.curr_user[("user"+ i) as keyof typeof  this.curr_user].filter((user) => {
      if(user.id !== null) return datasource_ids.includes(user.id);
      return false;
    });
    this.curr_user[("user" + i) as keyof typeof  this.curr_user] = datas_user;
    datasource = datasource.splice(event.pageIndex * event.pageSize, event.pageSize);
    if (datasource != null) {
      this.dataSource["data" + i  as keyof typeof this.dataSource].data =  datasource;
    }
  }

  // cette fonction permet de récupérer les restaurant pour un utilisateur filtre les options du select et séléctionne les restaurant
  // sur lequelle l'utilisateur est attribué
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
          let restaurants = user.restaurants.map((restaurant) => restaurant.name)
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

 // permet de séléctionner les droits en écriture pour un utilisateur lors de l'ouverture de la liste déroulante
  get_read_right(event: boolean, index: number,  categorie:number) {
    if (event) {
      // on récupère l'utilisateur de la liste
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
        // on filtre les statut pour ne récupérer que ceux qui sont lié à l'utilisateur dans le tableau
        let options = this.options_read.filter((option: MatOption, index_opt: number) => {
          const min_length = this.length_statut* (prev_index + cum_length_pages)
          const max_length = this.length_statut* (prev_index + cum_length_pages + 1)
          return ((index_opt >= min_length) && (index_opt < max_length))
        })
        for(let key in user.statut){

          // on vérifie pour chacun des role de l'utilisateur si celui-ci inclue r (lecture)
          const role = user.statut[key as keyof typeof user.statut] as string
          if(typeof role === "string"){
            if(role.includes('r')){
              const option = options.find((option) => option.value === key);
              if(option !== undefined) options_list.push(option);
            }
          }
          i = i + 1 
        }
        // on séléctionne les options correspondantes 
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
          const min_length = this.length_statut * (prev_index + cum_length_pages) 
          const max_length = this.length_statut * (prev_index + cum_length_pages + 1)
          return ((index_opt >= min_length) && (index_opt < max_length))
        })
        for(let key in user.statut){
          const role = user.statut[key as keyof typeof user.statut] as string
          if(typeof role === "string"){
            if(role.includes('w')){
              const option = options.find((option) => option.value === key);
              if(option !== undefined) options_list.push(option);
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
    // ici ont récupère l'ensemble des restaurants selectionnés
    let restaurants = event.value
    // ici ont récupère l'utilisateur
    index = 6 * this.page_number + index
    let user = this.curr_user["user" +  this.curr_categorie as keyof typeof this.curr_user].at(index);
    if(user?.restaurants !== undefined){
       user.restaurants.forEach((_restaurant:Restaurant, index:number) => {
        // on enlève dans les restaureants utilisateurs tout les restaurants qui ne sont pas séléctionné
        //les restaurants sont conv
        restaurants.filter((restaurant:string) => (restaurant !== _restaurant.id))
      })
      restaurants = user.restaurants.filter((restaurant) => restaurants.includes(restaurant.name));
      user.restaurants = [];
      for(let restaurant of restaurants){
        user.restaurants.push(restaurant);
      }
      // on créer une liste de restaurants qui sont unique
      user.restaurants = user.restaurants.filter((restaurant, index, self) => self.map((restau) => restau.id).indexOf(restaurant.id) === index); 
    }
  }

  set_read_right(event:MatSelectChange, index:number,  categorie:number){
    index = this.length_statut * this.page_number + index;
    const new_rights = event.value;
    const user = this.curr_user["user" +  this.curr_categorie as keyof typeof this.curr_user].at(index);
    user?.setStatus(new_rights, "r");  
  }

  set_write_right(event:MatSelectChange, index:number,  categorie:number){
    index = this.length_statut * this.page_number + index;
    const new_rights = event.value;
    const user = this.curr_user["user" +  this.curr_categorie as keyof typeof this.curr_user].at(index);
    user?.setStatus(new_rights, "w"); 
  }

  //permet de modifier l'employé dans la base de donnée
  modifEmployee(index:number,  categorie:number) {
    //On récupère l'utilisateur à partir du tableau   
    index = 6*this.page_number + index
    let user =this.curr_user["user" + categorie as keyof typeof this.curr_user].at(index);
    // Cette étape avant l'ajout de l'utilisateur est la abse de données permet de s'assurer que les restaurants sont unique 
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
    //On ajoute l'utilisateur à la base de donnée  
    if(user !== undefined){
      if(filter_user != undefined) user.restaurants = filter_user
      this.user_services.setEmployeeBDD(user).then(() => {
        this._snackBar.open("vous avez bien modifié l'ultilisateur", "fermer");   
      }).catch((e) => {
        console.log(e);
        this._snackBar.open("vous n'avez pas modifié l'ultilisateur", "fermer"); 
      })
    }
  }

  //Récupération des datasource en fonction des différentes catégorie 
  //data0 -> Ajouter des employés au restaurant 
  //data1 -> Cuisinier
  //...
  //data6 -> Propriétaire
  getDataSource(index:number){
    return this.dataSource[('data' + index) as keyof typeof this.dataSource]
  }

  //Permet d'ajouter un employé à la base de donnée 
  AddEmployee(){
    this.dialog.open(AddConfigueEmployeeComponent, {
      height: "500px",
      width: "400px",
      data: {
        restaurants: this.restau_list.map((restau) => restau.id),
        prop: this.proprietaire,
        auth: this.auth
      }
    });
  }

  //Ajoute un salaire moyen pour l'ensemble des employés en sélctionnant une catégorie 
  addSalaryRestaurant(){
    this.dialog.open(AddConfigueSalaryComponent, {
      height: "500px",
      width: "400px",
      data: {
        restaurants: this.restau_list.map((restau) => restau.id),
        prop: this.proprietaire
      }
    });
  }

  //Déconnexion de l'utilisateur à l'application 
  clicdeConnexion() {
    this.auth.signOut();
    window.location.reload();
  }

  //Retour à la page d'acceuil 
  clicAcceuil() {
    this.router.navigate(['']);
  }

  //=============================================== mobile adaptation ====================================================== 
  getUsers(index_user: number): any {
   return this.curr_user[("user" + index_user) as keyof typeof this.curr_user];
  }
  changeUserInfo(user: User) {
    this._bottomSheet.open(MobileUserDataComponent, {
      data:{
        user:user,
        prop_user: this.prop_user,
        is_prop: this.is_prop,
        proprietaire:this.proprietaire
      }
    })
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