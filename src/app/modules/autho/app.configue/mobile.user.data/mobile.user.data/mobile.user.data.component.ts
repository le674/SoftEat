import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Restaurant } from '../../../../../../app/interfaces/restaurant';
import { ShortUser, User } from '../../../../../../app/interfaces/user';
import { UserInteractionService } from '../../../../../../app/services/user-interaction.service';

@Component({
  selector: 'app-mobile.user.data',
  templateUrl: './mobile.user.data.component.html',
  styleUrls: ['./mobile.user.data.component.css']
})
export class MobileUserDataComponent implements OnInit {
  public is_prop:boolean;
  public user: User;
  public restaurants: Array<string>;
  public roles: Array<string>;
  // cette objet contient les différents selecteurs pour l'écriture et la lecture
  private proprietaire: string; 
  private options_right: {
    r: QueryList<MatOption> | null,
    w: QueryList<MatOption> | null
  };
  @ViewChildren("options")
  options!: QueryList<MatOption>;
  @ViewChildren("options_read")
  options_read!: QueryList<MatOption>;
  @ViewChildren("options_write")
  options_write!: QueryList<MatOption>;


  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: {
    user: User,
    prop_user: ShortUser[],
    is_prop:boolean,
    proprietaire: string
  }, private user_services: UserInteractionService, private _snackBar: MatSnackBar) {
    this.proprietaire = this.data.proprietaire;
    this.user = this.data.user;
    this.is_prop = this.data.is_prop;
    const full_user = this.data.prop_user.find((user_full) => user_full.id === this.user.id);
    this.options_right = {
      r: null,
      w: null
    };
    if (full_user !== undefined) {
      this.restaurants = full_user.restaurants.split(',');
    }
    else {
      this.restaurants = [];
    }
    this.roles = ["alertes", "stock", "analyse", "budget", "facture", "planning"];
  }

  ngOnInit(): void {
  }
 /*  get_restaurant() {

    if(this.user.restaurants !== null){
      const restaurants = this.user.restaurants.map((restaurant) => restaurant);
      let options = this.options.filter((option: MatOption) => {
        return restaurants.includes(option.value)
      });
      options.forEach((option) => {
        option.select()
      })
    }
  }
  set_restaurants(restaurants_selected: MatSelectChange) {
    this.user.restaurants = [];
    const _restaurants: Array<string> = restaurants_selected.value;
    _restaurants.forEach((restaurant) => {
      let restau = new Restaurant()
      restau.id = restaurant
      this.user.restaurants.push(restau)
    })
  }
  get_right(right: string) {
    // ont récupère les slecteurs en écriture et en lecture que l'on range dans l'objet selecteur des droits
    this.options_right.r = this.options_read;
    this.options_right.w = this.options_write;
    let options: MatOption<any>[] = [];
    //On récupère les list des options en fonction de si la fonction des droit attribués (lecture écriture)
    const _options_right = this.options_right;
    const options_right = _options_right[right as keyof typeof _options_right];
    if (options_right !== null) {
      //On récupère l'information si l'utilisateur est propriétaire ou non 
      const is_prop_user = this.user.statut.is_prop;
      if (is_prop_user !== undefined) {
        if (is_prop_user) {
          //Si il est propriétaire ont récupère tout le statut
          options = options_right.filter((option) => true);
        }
      }
      //On supprime la coomposante propriétaire si c'est le cas 
      delete this.user.statut.is_prop;
      const status = this.user.statut;
      if ((is_prop_user === undefined) || !is_prop_user) {
        //On filtre l'ensemble des options du selecteur pour ne récupéré que ceux dont l'utilisateur à actuellement les accès en écriture 
        options = options_right.filter((option: MatOption) => {
          const option_right = status[option.value as keyof typeof status];
          if (typeof option_right === "string") {
            return option_right.includes(right);
          }
          else {
            return false;
          }
        })
      }
      // ontr séléctionne chacun des options du selecteur 
      options.forEach((option) => {
        option.select()
      })
    }
  }
  // Cette fonction permet d'ajouter des droits en écriture à l'utilisateur en fonction des options sélkectionné du selecteur 
  set_right(event: MatSelectChange, right: string) {
    const new_rights = event.value;
    this.user.setStatus(new_rights, right);
  }
  //permet de modifier l'employé dans la base de donnée
  modifEmployee() {
    //On récupère l'utilisateur à partir du tableau   
    let user = this.user
    // Cette étape avant l'ajout de l'utilisateur est la abse de données permet de s'assurer que les restaurants sont unique 
    const restaurant_ids = user?.restaurants.map((restaurant) => restaurant.id)
    const unique_restau = Array.from(new Set(restaurant_ids))
    let filter_user = user?.restaurants.filter((restaurant) => {
      if(unique_restau.includes(restaurant.id)) {
        unique_restau.shift();
        return true
      } else {
        return false
      }
    })
    //On ajoute l'utilisateur à la base de donnée  
    if (user !== undefined) {
      if (filter_user != undefined) user.restaurants = filter_user
      this.user_services.setUser(this.proprietaire, user)
    }
    this._snackBar.open("vous avez bien modifier l'ultilisateur", "fermer")
  } */
}