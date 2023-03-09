import { Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { child, connectDatabaseEmulator, get, getDatabase, push, ref, set, update } from 'firebase/database';
import { User } from '../interfaces/user';
import { FirebaseApp } from "@angular/fire/app";
import { Proprietaire } from '../interfaces/proprietaire';
import { Restaurant } from '../interfaces/restaurant';
import { FIREBASE_DATABASE_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {
  private db: any;
  private uid: string;
  private proprietary: string;
  private prop_list: Proprietaire;
  private user: User;
  private count;
  public is_prop

  constructor(private ofApp: FirebaseApp) {
    this.prop_list = {
      proprietaire: "",
      employee: []
    }
    this.db = getDatabase(ofApp);
    if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
      try {
        // Point to the RTDB emulator running on localhost.
        connectDatabaseEmulator(this.db, FIREBASE_DATABASE_EMULATOR_HOST.host, FIREBASE_DATABASE_EMULATOR_HOST.port);
      } catch (error) {
        console.log(error);

      }
    }
    this.user = new User();
    this.count = 0;
    this.proprietary = "";
    this.uid = "";
    this.is_prop = false;

  }
  async getAllIdFromProp(prop: string) {
    const ref_db = ref(this.db);
    await get(child(ref_db, `users/${prop}/`)).then((users) => {
      this.prop_list.proprietaire = prop
      users.forEach((user) => {
        let add_user = new User();
        add_user.id = (user.key === null) ? '' : user.key;
        add_user.email = user.val().email;
        user.child('restaurant').forEach((restaurant: any) => {
          let tmp_restaurant = new Restaurant();
          tmp_restaurant.id = restaurant.val().id;
          add_user.restaurants.push(tmp_restaurant);
        })
        add_user.statut.alertes = user.child("statut/alertes").val();
        add_user.statut.analyse = user.child("statut/analyse").val();
        add_user.statut.budget = user.child("statut/budget").val();
        add_user.statut.facture = user.child("statut/facture").val();
        add_user.statut.stock = user.child("statut/stock").val();
        add_user.statut.planning = user.child("statut/planning").val();
        add_user.statut.is_prop = user.child("statut/is_prop").val();
        add_user.to_roles();

        this.prop_list.employee.push(add_user);
      })
    })
    return (this.prop_list)
  }

  async getProprietaireFromUsers(uid: string) {
    const ref_db = ref(this.db);

    await get(child(ref_db, `users/${uid}`)).then((user: any) => {
      
      if (user.exists()) {
        this.user.proprietaire = user.val().proprietaire;
      }
      else {
        console.log("pas de proprietaire pour cette identifiant");

      }
    }).catch((error) => {
      console.log(error);
    })
    return (this.user.proprietaire);
  }

  async getUserDataFromUid(uid: string, prop: string, restaurant: string) {
    this.user = new User()
    const ref_db = ref(this.db, `user_${prop}/${prop}/${restaurant}/${uid}`);
    await get(ref_db).then((user: any) => {
      if (user.exists()) {
        this.user.id = uid;
        this.user.email = user.val().email;
        this.user.numero = user.val().number;
        this.user.surname = user.val().surname;
        this.user.name = user.val().name;
      }
    })
    return this.user
  }

  async getUserFromUid(uid: string, prop: string) {
    this.user = new User()
    const ref_db = ref(this.db, `users/${prop}/${uid}`);
    await get(ref_db).then((user: any) => {
      if (user.exists()) {
        user.child('restaurant').forEach((restaurant: any) => {
          let tmp_restaurant = new Restaurant()
          tmp_restaurant.id = restaurant.val().id
          this.user.restaurants.push(tmp_restaurant)
        });
        // on supprime le premer utilisateur lié à la création de User
        if ((this.user.restaurants.at(1)?.id != null) && (this.user.restaurants.at(1)?.id == "")) {
          this.user.restaurants.shift();
        }

        this.user.statut.alertes = user.child("statut/alertes").val();
        this.user.statut.analyse = user.child("statut/analyse").val();
        this.user.statut.budget = user.child("statut/budget").val();
        this.user.statut.facture = user.child("statut/facture").val();
        this.user.statut.stock = user.child("statut/stock").val();
        this.user.statut.planning = user.child("statut/planning").val();
        this.user.statut.is_prop = user.child(`statut/is_prop`).val();
        this.user.to_roles();
      }
    })
    return this.user
  }

  async checkIsProp(uid: string, proprietaire: string) {
    const ref_db = ref(this.db, `users/${proprietaire}/${uid}/statut/is_prop/`);
    await get(ref_db).then((is_prop) => {
      this.is_prop = is_prop.val()
    })
    return this.is_prop
  }

  async setUser(prop: string, user: User) {
    let data_to_add = {};
    const ref_db = ref(this.db);
    const path_prop = `users/${prop}/${user.id}`
    const path_dico = `users/${user.id}`
    let restaurants: Array<{id:string, adresse:string}> = [];
    restaurants = user.restaurants.filter((restaurant) => (restaurant !== null) && (restaurant !== undefined))
      .map((restaurant) => {
        return {id:restaurant.id, adresse: restaurant.adresse};
      });
    
    Object.assign(data_to_add, {
      [path_dico]: {
        email: user.email,
        proprietaire:prop
      },
      [path_prop]: {
        email: user.email,
        statut: user.statut,
        restaurant: restaurants
      }
    })

    for (let restaurant of restaurants.map((restaurant) => restaurant.id)) {
      Object.assign(data_to_add, {
        [`resto_auth/${prop}/${restaurant}/${user.id}`]: user.email
      })
    }
    await update(ref_db, data_to_add)
  }

  async setUserInfo(prop: string, user: User) {
    let data_to_add = {};
    const ref_db = ref(this.db);
    let restaurants: Array<string> = [];
    restaurants = user.restaurants.filter((restaurant) => (restaurant !== null) && (restaurant !== undefined))
      .map((restaurant) => restaurant.id);
    for (let restaurant of restaurants) {
      Object.assign(data_to_add, {
        [`user_${prop}/${prop}/${restaurant}`]: {
          email: user.email,
          name: user.name,
          number: user.numero,
          surname:user.surname,
          time_work:user.time_work
        }
      })
    }
    await update(ref_db, data_to_add)
  }

  async updateEmail(prop: string, restaurant: string, user_uid: string, email: string) {
    const ref_db = ref(this.db);
    await update(ref_db, {
      [`users/${prop}/${user_uid}/email/`]: email,
      [`users/${user_uid}/email/`]: email,
      [`user_${prop}/${prop}/${restaurant}/${user_uid}/email/`]: email
    })
  }

  async updateNumber(prop: string, restaurant: string, user_uid: string, new_number: string) {
    const ref_db = ref(this.db, `user_${prop}/${prop}/${restaurant}/${user_uid}/number/`);
    await set(ref_db, new_number)
  }

}
