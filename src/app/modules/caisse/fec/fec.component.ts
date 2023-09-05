import { Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-fec',
  templateUrl: './fec.component.html',
  styleUrls: ['./fec.component.css']
})
export class FecComponent implements OnInit {
  private url: UrlTree;
  public prop:string
 /*  public dataSource: MatTableDataSource<rowFec>; */
  constructor(private router: Router) { 
    this.url = this.router.parseUrl(this.router.url);
    this.prop = "";
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
  }
}
