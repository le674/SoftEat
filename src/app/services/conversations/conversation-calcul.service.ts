import { Injectable } from '@angular/core';
import { Employee } from 'src/app/interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class ConversationCalculService {

  constructor() {

  }
  public fetchConvListUsers(employees: Array<Employee>): { [conv: string]: string[] } {
    const convListUsers = { 'ana': [''], 'com': [''], 'fac': [''], 'inv': [''], 'rec': [''], 'plan': [''], 'rh': [''] };
    for (let employee of employees) {
      const user_statuts = employee.statut;
      const user_email = employee.email;
      if (user_statuts.stock === 'wr' || user_statuts.stock === 'rw' || user_statuts.stock === 'r') { //userStatuts.stock.includes('w') || userStatuts.stock.includes('r')
        convListUsers['inv'].push(user_email);
        convListUsers['rec'].push(user_email);
      }
      if (user_statuts.analyse === 'wr' || user_statuts.analyse === 'rw' || user_statuts.analyse === 'r') convListUsers['ana'].push(user_email);
      if (user_statuts.budget === 'wr' || user_statuts.budget === 'rw' || user_statuts.budget === 'r') convListUsers['com'].push(user_email);
      if (user_statuts.facture === 'wr' || user_statuts.facture === 'rw' || user_statuts.facture === 'r') convListUsers['fac'].push(user_email);
      if (user_statuts.planning === 'wr' || user_statuts.planning === 'rw' || user_statuts.planning === 'r') convListUsers['plan'].push(user_email);
    }
    return convListUsers;
  }
}
