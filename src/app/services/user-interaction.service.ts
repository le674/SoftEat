import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { FirebaseApp } from "@angular/fire/app";
import { Proprietaire } from '../interfaces/proprietaire';
import { writeBatch, Firestore, DocumentSnapshot, SnapshotOptions, Unsubscribe, addDoc, collection, onSnapshot, query, where, doc, collectionGroup } from '@angular/fire/firestore';
import { Subject } from 'rxjs';
import { CommonService } from './common/common.service';
import { Employee, EmployeeFull } from '../interfaces/employee';
import { updateDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserInteractionService {
  private uid: string;
  private proprietary: string;
  private prop_list: Proprietaire;
  private user = new Subject<User>();
  private employee = new Subject<Employee>();
  private employees = new Subject<Array<Employee>>();
  private users = new Subject<Array<User>>();
  private _users: Array<User>;
  private _employees: Array<Employee>;
  private count;
  public is_prop;
  private user_converter: any;
  private employee_converter: any;
  private sub_users!: Unsubscribe;
  private sub_user!: Unsubscribe;
  private sub_employee!: Unsubscribe;
  private sub_employees!: Unsubscribe;

  constructor(private ofApp: FirebaseApp, private firestore: Firestore, private common_service: CommonService) {
    this._users = [];
    this._employees = [];
    this.prop_list = {
      proprietaire: "",
      employee: []
    }
    this.user_converter = {
      toFirestore: (user: User) => {
        return user
      },
      fromFirestore: (snapshot: DocumentSnapshot<{ user: User }>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        if (data !== undefined) {
          return data;
        }
        else {
          return null;
        }
      }
    };
    this.employee_converter = {
      toFirestore: (employee: Employee) => {
        return employee;
      },
      fromFirestore: (snapshot: DocumentSnapshot<Employee>, options: SnapshotOptions) => {
        const data = snapshot.data(options);
        if (data !== undefined) {
          let employee = new Employee(data.email, data.statut, data.uid, this.common_service);
          employee.setData(data);
          return employee;
        }
        else {
          return null;
        }
      }
    };
    this.count = 0;
    this.proprietary = "";
    this.uid = "";
    this.is_prop = false;

  }
  /**
   * @description attache un écouteur au noeud clients/uid/ récupération de l'utilisateur associé à l'uid
   * @param uid identifiant unique de la personne dont nous souhaitons récupérer les informations
   * @returns {Unsubscribe} une fonction qui permet de se désabonner de l'écouteur attaché au noeud clients/uid/
  */
  getUserFromUidBDD(uid: string) {
    let client_ref = query(collection(this.firestore, "clients"), where("uid", "==", uid)).withConverter(this.user_converter);
    this.sub_user = onSnapshot(client_ref, (users) => {
      users.forEach((user) => {
        if (user.exists()) {
          this.user.next(user.data() as User);
        }
      })
      this.common_service.incCounter();
      const source = users.metadata.fromCache ? "cache local" : "serveur";
      console.log(`les données  de récupération de l'user par l'uid proviennent de ${source}`);
    })
    return this.sub_user;
  }
  /**
    * @description attache un écouteur dans le noeud employees afin de récupérer les infos sur l'utilisateur
    * @param user  user permet de récupérer un employé à partir d'un user dans client
    * @returns {Unsubscribe} une fonction qui permet de se désabonner de l'écouteur attaché au noeud proprietaires/<id_prop>/restaurants/<id_restau>/employees/<id_employee>
  */
  getEmployeeBDD(user: User) {
    if (user.related_restaurants !== null) {
      const uid = user.uid;
      const prop = user.proprietary_id;
      if ((prop !== null) && (user.id_employee !== null)) {
        let employee_ref = query(
          collection(
            doc(
              collection(this.firestore, "proprietaires"), prop
            ), "employees"
          ),
          where("uid", "==", uid),
          where("auth_rh", "array-contains", uid)).withConverter(this.employee_converter);

        this.sub_employee = onSnapshot(employee_ref, (employees) => {
          
          employees.forEach((employee) => {
            this.employee.next(employee.data() as Employee)
          })
          const source = employees.metadata.fromCache ? "cache local" : "serveur";
          console.log(`les données  de récupération des employees proviennent de ${source}`);
          this.common_service.incCounter();
        })
        }
      }
      return this.sub_employee;
  }

  async getProprietaireFromUsers(uid: string) {
   /*  const ref_db = ref(this.db);

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
    return (this.user.proprietaire); */
  }

  async getUserDataFromUid(uid: string, prop: string, restaurant: string) {
    /* this.user = new User()
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
    return this.user */
  }


  async checkIsProp(uid: string, proprietaire: string) {
   /*  const ref_db = ref(this.db, `users/${proprietaire}/${uid}/statut/is_prop/`);
    await get(ref_db).then((is_prop) => {
      this.is_prop = is_prop.val()
    })
    return this.is_prop */
  }

  async setUser(prop: string, user: User) {
   /*  let data_to_add = {};
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
    return this.sub_employee; */
  }

  /**
      * @description attache un écouteur dans le noeud employees pour un groupe de collection restaurants
      * @param users ensembles des employées dont nous souhaitons récupérer les informations
      * @param prop identifiant du proprietaire pour lequel ont souhaitent récupérer les informations
      * @returns {Unsubscribe} une fonction qui permet de se désabonner de l'écouteur attaché aux noeuds proprietaires/<id_prop>/restaurants/<id_restau>/employees
  */
  getAllEmployeeBDD(prop: string, uid:string) {

    const employee_ref = query(
      collectionGroup(this.firestore, "employees"),
      where("proprietary_id", "==", prop),
      where("auth_rh", "array-contains", uid)
    ).withConverter(this.employee_converter);
    this.sub_employees = onSnapshot(employee_ref, (employees) => {
      this._employees = [];
      employees.forEach((employee) => {
        if (employee.exists()) {
          this._employees.push(employee.data() as Employee);
        }
      })
      this.employees.next(this._employees);
      const source = employees.metadata.fromCache ? "cache local" : "serveur";
      console.log(`les données  de récupération des employees proviennent de ${source}`);
      this.common_service.incCounter();
    })
    return this.sub_employees;
  }
  /**
     * @description permet de récupérer tout les employé d'une enseigne ou les clients
     * @param proprietaire
  */
  getAllUsersFromPropBDD(proprietaire: string, employee: boolean) {
    let user_ref = query(collection(this.firestore, "clients"),
      where("id_employee", "==", null),
      where("proprietary_id", "==", proprietaire))
      .withConverter(this.user_converter);
    if (employee) {
      user_ref = query(collection(this.firestore, "clients"),
        where("proprietary_id", ">", ""),
        where("proprietary_id", "==", proprietaire))
        .withConverter(this.user_converter);
    }
    this.sub_users = onSnapshot(user_ref, (users) => {
      this._users = [];
      users.forEach((user) => {
        if (user.exists()) {
          this._users.push(user.data() as User);
        }
      })
      this.users.next(this._users);
      const source = users.metadata.fromCache ? "cache local" : "serveur";
      console.log(`les données  de récupération des utilisateurs d'une enseigne proviennent de ${source}`);
      this.common_service.incCounter();
    })
    return this.sub_users;
  }
  /**
   * @description permet de modifier un utilisateur dans la base de donnée
   * @returns {void}
  */
  async setUserBDD(user: User) {
    const user_ref = collection(this.firestore, "clients").withConverter(this.user_converter);
    await addDoc(user_ref, user)
  }
  /**
   * @description ajout d'un employee complétement dans la base de donnée
   * @returns {void}
   */
  async setEmployeeBDD(employee: EmployeeFull) {
    
    const batch = writeBatch(this.firestore);
    const user = new User();
    const restaurants_ids = employee.getRestaurantsIds();
    const restaurant_prop = employee.getRestaurantsProp();
    user.related_restaurants = restaurant_prop;
    const user_ref = doc(collection(this.firestore, "clients"), employee.user_id);
    batch.update(user_ref, {
      related_restaurants: user.related_restaurants
    });
    for(let index = 0; index < restaurants_ids.length; index++) {
      employee.to_roles();
      const proprietaire = user.related_restaurants[index].proprietaire_id;
      const restaurant = user.related_restaurants[index].restaurant_id;
      const employee_ref = doc(
        collection(
          doc(
            collection(this.firestore, "proprietaires"), proprietaire),
          "employees"),
        employee.id);
      batch.update(employee_ref, {
        roles: employee.roles,
        statut: employee.statut.getData()
      })
    }
    await batch.commit();
  }
  /**
   * cette fonction permet de modifier le numéro d'un employée
   * @param prop nom de l'enseigne dont fait partie l'employée
   * @param employee employée pour lequel nous modifions le numéro
   * @param number nouveau numéro associé à l'employé
   */
  async updateEmployee(prop: string, employee: Employee, attribut: string, valeur:string) {
    const user_ref =
    doc(
      collection(
      doc(
        collection(this.firestore, "proprietaires"), prop
      ), "employees"
    ),employee.id).withConverter(this.employee_converter);
    employee[attribut] = valeur;
    await updateDoc(user_ref, employee.getData(null, null))
  }

  /**
   * @description récupération de l'observable qui contient les donnés écoutés sur le noeud clients/uid/
   * @returns {Observable}
   */
  getUserFromUid() {
    return this.user.asObservable();
  }
  /**
   * @description permet de récupérer les employé depuis la base de donnée dans clients/
   * pour une enseigne
   * @returns {void}
  */
  getAllUsersFromProp() {
    return this.users.asObservable();
  }
  /**
   * @description permet de récupérer un employé depuis la base de donnée dans prop/restaurant/employees
   * @returns {void}
   */
  getEmployee() {
    return this.employee.asObservable();
  }
  /**
   * @description permet de récupérer tout les employées depuis la base de donnée dans prop/restaurant/employees
   * @returns {void}
  */
  getAllEmployee() {
    return this.employees.asObservable();
  }
}
