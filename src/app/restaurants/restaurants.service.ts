import { Restaurant } from "./restaurant/restaurant.model";

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { MEAT_API } from "../app.api";

import { MenuItem } from "../restaurant-detail/menu-item/menu-item.model";

@Injectable()
export class RestaurantsService {

    constructor(private http: HttpClient) {}

    restaurants(search?: string): Observable<Restaurant[]> {
        let params : HttpParams = undefined;
        if (search) {
            params = new HttpParams().append(name, search)
        }
        return this.http.get<Restaurant[]>(`${MEAT_API}/api/restaurants`, {params: params});
    }

    restaurantById(id: string): Observable<Restaurant> {
        return this.http.get<Restaurant>(`${MEAT_API}/api/restaurants/${id}`);
    }

    reviewsOfRestaurant(id: string): Observable<any> {
        return this.http.get(`${MEAT_API}/api/restaurants/${id}/reviews`);
    }

    menuOfRestaurant(id: string): Observable<MenuItem[]> {
        return this.http.get<MenuItem[]>(`${MEAT_API}/api/restaurants/${id}/menu`);
    }
}
