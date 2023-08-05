import { Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Facture } from 'src/app/interfaces/facture';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-archi',
  templateUrl: './app.archi.component.html',
  styleUrls: ['./app.archi.component.css']
})
export class AppArchiComponent implements OnInit {
  private url: UrlTree;
  private years_folders:Array<string>;
  private days_folders:Array<string>;
  private actual_date:Date;
  public folders:Array<string>;
  public position:number;
  public full_date:Array<string>;
  public prop: string;
  public restaurant: string;
  constructor(private router: Router, private service_common:CommonService) { 
    this.actual_date = new Date();
    this.folders = [];
    this.years_folders = [];
    this.days_folders = [];
    this.position = 0;
    this.full_date = [];
    this.url = this.router.parseUrl(this.router.url);
    this.prop = "";
    this.restaurant = "";
  }
  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    for (let index = 0; index < 6; index++) {
      let numeric_year = this.actual_date.getFullYear() - index;
      this.folders.push(numeric_year.toString());  
    }
    this.years_folders = this.folders;
  }
  selectDate(date:string){
    if(this.position === 0){
      this.full_date = [];
      this.folders = this.service_common.getMonths();
    }
    if(this.position === 1){
      this.folders = this.service_common.getDays(this.actual_date.getFullYear(),this.actual_date.getMonth());
      this.days_folders = this.folders;
    }
    this.position = this.position + 1;
    this.full_date.push(date); 
  }
  returnPage() {
    if(this.position === 1){
      this.folders = this.years_folders;
    }
    if(this.position === 2){
      this.folders = this.service_common.getMonths();
    }
    if(this.position === 3){
      this.folders = this.days_folders;
    }
    this.position = this.position - 1;
    this.full_date.pop();
  }
}
