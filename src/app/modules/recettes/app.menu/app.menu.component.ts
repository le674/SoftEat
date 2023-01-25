import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, UrlTree } from '@angular/router';
import { Cmenu } from 'src/app/interfaces/menu';
import { MenuInteractionService } from 'src/app/services/menus/menu-interaction.service';
import { AddMenuComponent } from './add.menu/add.menu.component';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  styleUrls: ['./app.menu.component.css']
})
export class AppMenuComponent implements OnInit {

  public menus: Array<Cmenu>
  private url: UrlTree;
  private prop:string;
  private restaurant:string;
  private router: Router;

  constructor(private menu_service:MenuInteractionService,
    router: Router,  public dialog: MatDialog) {
    this.menus = [];  
    this.prop = "";
    this.restaurant = "";  
    this.router = router; 
    this.url = this.router.parseUrl(this.router.url);
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.menu_service.getMenusFromRestaurants(this.prop, this.restaurant).then((menus) => {
      console.log(menus);
      
      this.menus = menus;
    })
  }

  addMenu():void{
    const dialogRef = this.dialog.open(AddMenuComponent, {
      height: `${window.innerHeight}px`,
      width: `${window.innerWidth - window.innerWidth / 15}px`
    });
  }

}
