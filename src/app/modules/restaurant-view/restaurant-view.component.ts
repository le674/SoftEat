import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { RestaurantData } from 'src/app/interfaces/restaurantdata';

@Component({
  selector: 'app-restaurant-view',
  templateUrl: './restaurant-view.component.html',
  styleUrls: ['./restaurant-view.component.css']
})
export class RestaurantViewComponent implements OnInit {
  restaurants$: Observable<RestaurantData[]> = new Observable<RestaurantData[]>();

  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    this.restaurants$ = this.firestore.collection<RestaurantData>('restaurants').valueChanges();
  }
}
