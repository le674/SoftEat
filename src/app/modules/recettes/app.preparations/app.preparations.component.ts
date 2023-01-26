import { Component, OnInit } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { CIngredient } from 'src/app/interfaces/ingredient';
import { Cpreparation } from 'src/app/interfaces/preparation';
import { IngredientsInteractionService } from 'src/app/services/menus/ingredients-interaction.service';

@Component({
  selector: 'app-preparations',
  templateUrl: './app.preparations.component.html',
  styleUrls: ['./app.preparations.component.css']
})
export class AppPreparationsComponent implements OnInit {
  private url: UrlTree;
  private router: Router;
  public preparations: Array<Cpreparation>;
  private prop:string;
  private restaurant:string;

  constructor(private ingredient_service: IngredientsInteractionService, router: Router) { 
    this.preparations = [];
    this.router = router;
    this.prop = "";
    this.restaurant = "";
    this.url = this.router.parseUrl(this.router.url);
  }

  ngOnInit(): void {
    let user_info = this.url.queryParams;
    this.prop = user_info["prop"];
    this.restaurant = user_info["restaurant"];
    this.ingredient_service.getIngredientsPrepFromRestaurantsPROMForMenu(this.prop,this.restaurant).then((ingredients) => {
      this.preparations = ingredients;
    })
  }

}
