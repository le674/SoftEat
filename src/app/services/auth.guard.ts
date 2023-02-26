import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { Observable } from 'rxjs';
import { FIREBASE_AUTH_EMULATOR_HOST, FIREBASE_PROD } from 'src/environments/variables';
import { AuthentificationService } from './authentification.service';
const auth = getAuth();
if ((location.hostname === "localhost") && (!FIREBASE_PROD)) {
  try {
   // Point to the RTDB emulator running on localhost.
   connectAuthEmulator(auth, FIREBASE_AUTH_EMULATOR_HOST); 
  } catch (error) {
    console.log(error);
  }
} 

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(
    public authService: AuthentificationService,
    public router: Router
  ){ 
    
  }
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