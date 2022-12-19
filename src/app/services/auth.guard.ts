import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import { AuthentificationService } from './authentification.service';
const auth = getAuth();

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(
    public authService: AuthentificationService,
    public router: Router
  ){ }
  user = auth.currentUser;

  getConnexion():boolean{
    if(this.user == null){
      return false;
    }else{
      return true;
    }
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.estConnecter == true ) {

        return true;

      }
      else{
      this.router.navigate([''])

    }
    
        
    return false;
  }
}