import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from './authentification.service';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(
    public authService: AuthentificationService,
    public router: Router,
    private auth:Auth
  ){ 
    
  }
  user = this.auth.currentUser;

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