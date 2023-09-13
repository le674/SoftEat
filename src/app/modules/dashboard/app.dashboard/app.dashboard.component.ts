import { Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Router, UrlTree } from '@angular/router';
import { Unsubscribe } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Employee } from 'src/app/interfaces/employee';
import { Statut } from 'src/app/interfaces/statut';
import { User } from 'src/app/interfaces/user';
import { CommonService } from 'src/app/services/common/common.service';
import { UserInteractionService } from 'src/app/services/user-interaction.service';

@Component({
  selector: 'app-app.dashboard',
  templateUrl: './app.dashboard.component.html',
  styleUrls: ['./app.dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppDashboardComponent implements OnInit, OnDestroy {
  private prop:string;
  private restaurant:string;
  private user_subscription: Subscription; 
  private url: UrlTree;
  public numP = 1;
  public status:Statut;
  private router: Router;
  private user_unsubscribe!:Unsubscribe;
  private sub_user!:Subscription;

  constructor(public common_service:CommonService,
    router: Router,
    private employee_service:UserInteractionService,
    private auth:Auth) {
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.user_subscription = new Subscription();
    this.status = new Statut();
    this.url = this.router.parseUrl(this.router.url);
  }
  ngOnDestroy(): void {
   if(this.user_unsubscribe){
    this.user_unsubscribe();
   }
   if(this.sub_user){
    this.sub_user.unsubscribe();
   }
  }
  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    onAuthStateChanged(this.auth, (user) => {
      if(user !== null){
        let _user = new User()
        _user.proprietary_id = this.prop;
        _user.uid = user.uid;
        this.user_unsubscribe = this.employee_service.getEmployeeBDD(_user);
        this.sub_user = this.employee_service.getEmployee().subscribe((employee:Employee) => {
          this.status = employee.statut;
        })
        
      }
    });
  }
}
